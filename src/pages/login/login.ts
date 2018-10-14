import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireAuth } from 'angularfire2/auth';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {auth} from 'firebase';

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
    private platform: Platform
  ) {
  }

  procesarTwitter(){
      if (this.platform.is('cordova')) {
       this.twitterConnect.login().then(res => {
        const twitterCredential = auth.TwitterAuthProvider.credential(res.token, res.secret);
        this.afAuth.auth.signInWithCredential(twitterCredential).then(user => {
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
        () => this.navCtrl.setRoot(TabsPage),
        error =>  alert(error.message)
      );
    
    
  }

  procesarFacebook(){
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => { 
          console.log("Firebase success: " + JSON.stringify(success)); 
          this.navCtrl.setRoot(TabsPage);
        });

    }).catch((error) => { alert(JSON.stringify(error)); });
  }

  activeFormRegistro(){
    this.login = true;
  }
  disactiveFormRegistro(){
    this.login = false;
  }

}
