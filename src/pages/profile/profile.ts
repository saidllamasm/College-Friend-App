import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import md5 from 'crypto-md5';

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
  email: any;
  password: any;

  edited : boolean = false;

  profilePicture: any = "https://www.gravatar.com/avatar/"

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.profilePicture = "https://www.gravatar.com/avatar/" + md5('saidllamas14@gmail.com', 'hex')+"?s=400";
  }

  activeEdit(){
    this.edited = true;
  }

  saved(){
    this.edited = false;
  }

  exit(){

  }

}
