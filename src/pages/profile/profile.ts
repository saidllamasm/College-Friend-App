import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import md5 from 'crypto-md5';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
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

  //info user
  //
  
  edited : boolean = false;
  profilePicture: any = "https://www.gravatar.com/avatar/"

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    private storage: Storage,
    public afAuth: AngularFireAuth,
  ) {
    //this.profilePicture = "https://www.gravatar.com/avatar/" + md5(this.profile.email, 'hex')+"?s=400";
    this.afAuth.authState.subscribe(user => {
      this.afDatabase.list<UserCustom>('/UsuariosT/'+user.uid+'/').valueChanges().subscribe((data) => { 
        console.log(data);
      },(err)=>{
         console.log("problem : ", err)
         alert(err);
      });
    })
  }

  activeEdit(){
    this.edited = true;
  }

  saved(){
    this.edited = false;
  }

  exit(){
    this.afAuth.auth.signOut();
    this.storage.clear().then(() => {
      this.navCtrl.setRoot(LoginPage);
    }).catch(error => console.log(error + ' in clear db'));
    
  }

}
