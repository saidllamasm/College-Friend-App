import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the SingleUniversityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-university',
  templateUrl: 'single-university.html',
})
export class SingleUniversityPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar
    ) {
      statusBar.backgroundColorByHexString('#0055CB');
  }

}
