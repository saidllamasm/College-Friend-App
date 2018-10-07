import { ErrorPage } from './../error/error';
import { OpinionSinglePage } from './../opinion-single/opinion-single';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OpinionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opinions',
  templateUrl: 'opinions.html',
})
export class OpinionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpinionsPage');
  }

  test(){
    this.navCtrl.setRoot(OpinionSinglePage);
  }
  testOpenPageError(){
    this.navCtrl.setRoot(ErrorPage);
  }
}
