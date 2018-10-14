import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'

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

  login : boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebook: Facebook
  ) {
  }

  procesarTwitter(){

  }
  procesarLogin(){
    this.navCtrl.setRoot(TabsPage);
  }
  procesarRegistro(){

  }
  procesarFacebook(){
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => { 
          console.log("Firebase success: " + JSON.stringify(success)); 
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
