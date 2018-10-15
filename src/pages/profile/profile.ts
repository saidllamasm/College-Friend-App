import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import md5 from 'crypto-md5';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

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
  profile : any = {};

  edited : boolean = false;

  profilePicture: any = "https://www.gravatar.com/avatar/"

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    afDatabase: AngularFireDatabase,
    private storage: Storage
  ) {
    let dir_base = "";
    this.storage.get('uid').then((val) => {
      console.log('UID:', val);
      //dir_base = "/UsuariosT/"+val+"/";
      this.profile = afDatabase.list("/UsuariosT/-LOpQmApsZ0wINnf_Q52/").valueChanges();
      /*this.profilePicture = "https://www.gravatar.com/avatar/" + md5(this.profile.email, 'hex')+"?s=400";
      this.email = this.profile.email;*/
      console.log(JSON.stringify(this.profile));
    });
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
