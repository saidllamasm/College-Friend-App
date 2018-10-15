import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import * as firebase from "firebase";
import { Facebook } from '@ionic-native/facebook'
import { AngularFireAuth } from 'angularfire2/auth';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {auth} from 'firebase';
import { Storage } from '@ionic/storage';

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
    private storage: Storage
  ) {
    this.users = database.list('UsuariosT');
  }

  procesarTwitter(){
      if (this.platform.is('cordova')) {
       this.twitterConnect.login().then(res => {
        const twitterCredential = auth.TwitterAuthProvider.credential(res.token, res.secret);
        this.afAuth.auth.signInWithCredential(twitterCredential).then(user => {
          this.saveUserFirebase(user.email, user.displayName, user.phoneNumber, 'Twitter');
          console.log(JSON.stringify(user));
          this.navCtrl.setRoot(TabsPage)
        }).catch(error => {
         console.log(error);
         alert(JSON.stringify(error));
        });
       }).catch((error) => {
        alert(JSON.stringify(error));
       });
      } else {
       this.afAuth.auth
        .signInWithPopup(new auth.TwitterAuthProvider())
        .then((res) => {
          this.saveUserFirebase(res.user.email, res.user.displayName, res.user.phoneNumber, 'Twitter');
          console.log(JSON.stringify(res));
          this.navCtrl.setRoot(TabsPage)
        }).catch(error => {
         //observer.error(error);
         alert(JSON.stringify(error));
       });
      }
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
    
    //this.navCtrl.setRoot(TabsPage);
  }

  procesarRegistro(){
    let credentials = {
			email: this.email_r,
			password: this.password_r
    };
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(
        () => {
          this.saveUserFirebase(credentials.email, this.name, this.phone, 'email');
          this.navCtrl.setRoot(TabsPage);
        },
        error =>  alert(error.message)
      );
    
    
  }

  procesarFacebook(): Promise<any> {
    AngularFireModule.initializeApp(environment.firebase);
    //if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const fbCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.afAuth.auth.signInWithCredential(fbCredential).then(user => {
          console.log(user);
          this.saveUserFirebase(user.email, user.displayName, user.phoneNumber, 'Facebook');
          this.navCtrl.setRoot(TabsPage);
        }).catch(error => {
         console.log(error);
         alert(JSON.stringify(error));
        });
        //alert(JSON.stringify(res));
      })
    //}
  }

  activeFormRegistro(){
    this.login = true;
  }
  disactiveFormRegistro(){
    this.login = false;
  }

  saveUserFirebase(email, nombre, telefono, metodo){
    // set a key/value
    const newUser = this.users.push({});
    newUser.set({
      email : email,
      nombre : nombre,
      telefono : telefono,
      reputacion: 'novato',
      rol :'usuario',
      metodo: metodo, 
      estado :'pendiente',
      configuracion : {
        buscando : 'true',
        notificaciones : 'true'
      },
      timestamp : database.ServerValue.TIMESTAMP
  });
  this.storage.set('uid', newUser.key);
  alert(newUser.key);
}

}
