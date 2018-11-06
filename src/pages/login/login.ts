import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireAuth } from 'angularfire2/auth';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import { auth } from 'firebase';


import { environment } from '../../environments/environment';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  users: AngularFireList<any>;

  email : string ;
  password : string ;
  email_r : string ;
  phone : string ;
  name : string ;
  password_r : string ;
  login : boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebook: Facebook,
    public twitterConnect: TwitterConnect,
    public afAuth: AngularFireAuth,
    private platform: Platform,
    database: AngularFireDatabase,
    public afDatabase: AngularFireDatabase,
  ) {
    this.users = database.list('Usuarios');
  }

  // login with email and password
  procesarLogin(){
    let credentials = {
			email: this.email,
			password: this.password
    };
      this.afAuth.auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      ).then(
        () => this.navCtrl.setRoot(TabsPage),
        error =>  alert(error.message)
      );
  }

  // register new user with email and password
  procesarRegistro(){
    let credentials = {
			email: this.email_r,
			password: this.password_r
    };
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then( (firebaseUser) =>  {
        alert(firebaseUser.user.uid);
        this.saveUserFirebase(firebaseUser.user.uid ,credentials.email, this.name, this.phone, 'email');
        this.navCtrl.setRoot(TabsPage);
      }).catch(function(error) {
        console.error("Error: ", error);
    });
  }

  // login with Faceboook
  procesarFacebook(): Promise<any> {
    AngularFireModule.initializeApp(environment.firebase);
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const fbCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.afAuth.auth.signInWithCredential(fbCredential).then(user => {
          console.log(JSON.stringify(user));
          this.saveUserFirebase(user.uid, user.email, user.displayName, user.phoneNumber, 'Facebook');
          this.navCtrl.setRoot(TabsPage);
        }).catch(error => {
         console.log(JSON.stringify(error));
         alert(JSON.stringify(error));
        });
      });
  }
  // login with Twiter
  procesarTwitter(){
    if (this.platform.is('cordova')) {
      this.twitterConnect.login().then(res => {
        const twitterCredential = auth.TwitterAuthProvider.credential(res.token, res.secret);
        this.afAuth.auth.signInWithCredential(twitterCredential).then(user => {
          this.saveUserFirebase(user.uid,user.email, user.displayName, user.phoneNumber, 'Twitter');
          console.log(JSON.stringify(user));
          this.navCtrl.setRoot(TabsPage)
        }).catch(error => {
          console.log(JSON.stringify(error));
          alert(JSON.stringify(error));
        });
      }).catch((error) => {
        alert(JSON.stringify(error));
      });
    } else {
      this.afAuth.auth
        .signInWithPopup(new auth.TwitterAuthProvider())
        .then((res) => {
          this.saveUserFirebase(res.user.uid, res.user.email, res.user.displayName, res.user.phoneNumber, 'Twitter');
          console.log(JSON.stringify(res));
          this.navCtrl.setRoot(TabsPage)
        }).catch(error => {
          alert(JSON.stringify(error));
      });
    }
  }

  // save user data to firebase 
  saveUserFirebase(uid, email, nombre, telefono, metodo){
    if( this.loadUsr( uid ) ){
    //if(!this.getUserExist(uid)){
      let newUser = {
        key : uid,
        email : email,
        nombre : nombre,
        telefono : telefono,
        reputacion: 'novato',//
        rol :'usuario',
        metodo: metodo, 
        estado :'pendiente',
        configuracion : {
          buscando : true, //
          notificaciones : true //
        }
      };
      this.users.update(uid, newUser);
      alert('acount created sucess');
    } else{
      alert('login sucess');
    }
  }

  getUserExist = async(uid) =>{
    let lng = await this.loadUsr( uid );
    alert('await ' +lng);
    return lng;
  }

  loadUsr = (uid) => {
    return new Promise((resolve, reject) => {
      this.afDatabase.database.ref('/Usuarios/'+uid+'/').once('value').then( (snapshot) => {
        if(snapshot.val() != null){
          resolve ( true ) ;
        }else{
          resolve( false );
        }
        
      });
      
    });
  }

  //for ui controls
  activeFormRegistro(){
    this.login = true;
  }
  disactiveFormRegistro(){
    this.login = false;
  }

}
