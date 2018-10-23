import { University } from './../../model/university/university.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { WriteReviewPage } from '../write-review/write-review';

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
  public id_university;
  public showReviews = true; //cambiar a true en produccion
  public name : string;
  public address : string;
  public userCreated : string;
  public lat;
  public lng;


  // for costs progress bar
  porcent : number;
  mount : number;
  min : number;
  max : number;
  color : string;
  //

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    public statusBar: StatusBar,
    private alertCtrl: AlertController,
    private platform : Platform
    ) {
      statusBar.backgroundColorByHexString('#0055CB');
      this.id_university = this.navParams.get('id_university');

      this.afDatabase.list<University>('/Universidades/'+this.id_university+'/').valueChanges().subscribe((university : any[]) => {
        console.log(JSON.stringify(university));
        this.name = '' +university[5];
        this.address = ''+university[1];
        this.lat = ''+university[3].lat;
        this.lng = ''+university[3].lng;
        university.forEach(element => {
          //alert(element);
        });
        //alert(JSON.stringify(university));
      });

      
      //progress
      this.mount = 440;
      this.min = 120;
      this.max = 2330;
      this.porcent = 45;
      if(this.porcent >= 80 )
        this.color = "danger";
      else if(this.porcent > 50 )
        this.color = "warning";
      else
        this.color = "green"; 

  }

  addGeneral(){
    let alert = this.alertCtrl.create({
      title: 'Add param',
      inputs: [
        {
          name: 'txtParam',
          placeholder: 'Vehicles'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log(data.txtParam);
          }
        }
      ]
    });
    alert.present();
  }

  openWriteReviewPage(){
    this.navCtrl.push(WriteReviewPage, {
      id_university : this.id_university,
      name_university : this.name
    });  
  }

  openCall(){
    if(this.platform.is('ios')){
      window.open('twitter://user?screen_name=gajotres', '_system', 'location=no');
    } else {
      window.open('https://twitter.com/gajotres', '_system', 'location=no');
    }
  }

  openMap(){
    let destination = this.lat + ',' + this.lng;
    if(this.platform.is('ios')){
      window.open('maps://?q=' + destination, '_system');
    } else {
      let label = encodeURI(this.name);
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }
  }

  goBack(){
      this.navCtrl.pop();
  }

  disableReviews(){
    this.showReviews = false;
  }

  activeReviews(){
    this.showReviews = true;
  }

}
