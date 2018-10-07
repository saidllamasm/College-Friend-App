import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  procesarTwitter(){

  }
  procesarLogin(){
    this.navCtrl.setRoot(TabsPage);
  }
  procesarRegistro(){

  }
  procesarFacebook(){

  }

  activeFormRegistro(){
    this.login = true;
  }
  disactiveFormRegistro(){
    this.login = false;
  }

}
