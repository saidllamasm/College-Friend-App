import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import md5 from 'crypto-md5';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { UserCustom } from '../../model/user/user.model';
 
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  uuid : string ;
  //info user
  txtUserMethodEmail;
  txtUserName;
  txtUserPhone;
  txtUserEmail;
  userPass : string;
  pre_student : boolean = true;
  notifications : boolean = true;
  methodEmail : boolean = false;

  edited : boolean = false;
  profilePicture: any = "https://www.gravatar.com/avatar/"

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    private storage: Storage,
    public afAuth: AngularFireAuth,
  ) {
    
    this.afAuth.authState.subscribe(user => {
      this.afDatabase.list<UserCustom>('/UsuariosT/').valueChanges().subscribe((res: UserCustom[]) => { 
        this.uuid = user.uid;
        res.forEach((item) => {
            if(item.key == user.uid){
              if( item.metodo=='Twitter' || item.metodo=='Facebook'){
                this.txtUserMethodEmail = false;
                this.methodEmail = false;
              }else{
                this.txtUserMethodEmail = true;
                this.methodEmail = true;
                //this.passUser = ; //password pending
              }
               
              if(item.configuracion.notificaciones == false){
                this.notifications = false;
              }
              if(item.configuracion.buscando == false){
                this.pre_student = false;
              }
              //this.search = item.
              this.txtUserName = item.nombre;
              this.txtUserPhone = item.telefono;
              this.txtUserEmail = item.email;
              this.profilePicture = "https://www.gravatar.com/avatar/" + md5(this.txtUserEmail, 'hex')+"?s=400";
              console.log(item);
            } 
        });
      },(err)=>{
         console.log("problem : ", err)
         alert(err);
      });
    })
  }

  activeEdit(){
    if(this.edited)
      this.edited = false;  
    else
    this.edited = true;
  }

  saved(){
    // save to firebase
    if(this.methodEmail == true){
      this.afDatabase.object('/UsuariosT/' + this.uuid).update(
        {
          configuracion : {
            buscando : this.pre_student,
            notificaciones: this.notifications
          },
          nombre : this.txtUserName,
          telefono : this.txtUserPhone,
          email : this.txtUserEmail
        }
      );
    } else {
      this.afDatabase.object('/UsuariosT/' + this.uuid).update(
        {
          configuracion : {
            buscando : this.pre_student,
            notificaciones: this.notifications
          },
          nombre : this.txtUserName,
          telefono : this.txtUserPhone
        }
      );
    }
    this.edited = false;
    
  }

  alerts(){
    alert('checkbox');
  }

  exit(){
    this.afAuth.auth.signOut();
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(LoginPage);
    }).catch(error => console.log(error + ' in clear db'));
    
  }

}
