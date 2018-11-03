import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OpinionSinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opinion-single',
  templateUrl: 'opinion-single.html',
})
export class OpinionSinglePage {
  public universityName = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    
  }
}
