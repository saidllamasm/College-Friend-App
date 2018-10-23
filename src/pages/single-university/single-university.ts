import { University } from './../../model/university/university.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  public showReviews = false; //cambiar a true en produccion
  public name : string;
  public address : string;
  public userCreated : string;


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
    private alertCtrl: AlertController
    ) {
      statusBar.backgroundColorByHexString('#0055CB');
      this.id_university = this.navParams.get('id_university');

      this.afDatabase.list<University>('/Universidades/'+this.id_university+'/').valueChanges().subscribe((university: University[]) => {
        //alert(JSON.stringify(university));
      });

      this.name = "Instituto tecnologico de ciudad guzman";
      this.address = 'Av afsdf';  
      this.userCreated = "Said Llamas;"

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
