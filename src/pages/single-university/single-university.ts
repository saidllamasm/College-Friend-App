import { InboxSinglePage } from './../inbox-single/inbox-single';
import { CallNumber } from '@ionic-native/call-number';
import { University } from './../../model/university/university.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, Platform,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireDatabase } from 'angularfire2/database';
import { WriteReviewPage } from '../write-review/write-review';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';

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
  public phone;
  public website;

  //
  public listCarrers = [];
  public listMonths = [];
  public listReviews = [];
  public listIms = [];

  // for costs progress bar
  porcent : number;
  mount : number;
  min : number;
  max : number;
  color : string;
  //

  monthNames: string[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    public statusBar: StatusBar,
    private alertCtrl: AlertController,
    private platform : Platform,
    private callNumber: CallNumber,
    private iab: InAppBrowser,
    private storage: Storage,
    ) {
      statusBar.backgroundColorByHexString('#0055CB');
      this.getReviews();
      this.getImagesFeature();

      this.id_university = this.navParams.get('id_university');

      this.afDatabase.list<University>('/Universidades/'+this.id_university+'/').valueChanges().subscribe((university : any[]) => {
        this.name = '' +university[7];
        this.address = ''+university[3];
        this.lat = ''+university[5].lat;
        this.lng = ''+university[5].lng;
        this.phone = ''+university[10];
        this.website = ''+university[13];

        for (var ip in university[0]) {
          if (university[0].hasOwnProperty(ip)) {
            this.listCarrers.push({nombre : university[0][ip]});// .push('2');// = university[0];
          }
        }
        for (var ip in university[2]) {
          if (university[2].hasOwnProperty(ip)) {
            this.listMonths.push({nombre : university[2][ip]});// .push('2');// = university[0];
          }
        }

        
        let i = 0;
        for(; i < university.length; i++){
          console.log(i+') '+university[i]);
        }
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

  getImagesFeature(){
    this.listIms.push(
      {
        imgsrc : 'http://ejesur.com.mx/wp-content/uploads/2017/05/592877894acc6650689262.jpg',
      }
    );
    this.listIms.push({
      imgsrc : 'https://www.animalpolitico.com/wp-content/uploads/2018/03/UNAM_1_2-e1519923027696.jpg'
    });
  }

  initChat(id){
    this.navCtrl.push(InboxSinglePage);
  }
  notFav(id){
    // confirmar de problemas con el comentario?
  }

  fav(id){

  }

  getReviews(){
    
    this.listReviews.push(
      { 
      id_review : '1', // key de la review
      id_username : '1', // usuario que posteo el comentario
      username : 'said',
      time : 'September 2018',
      imgsrc : 'https://www.sintesis.mx/wp-content/uploads/2018/06/unam-docentes-.jpg',
      content : 'Holas sdads.',
      images : [
        {
          imgurl : 'http://www.abogadoschwitzer.com/wp-content/uploads/2016/12/KSU_Hale_library-1024x768.jpg'
        },
        {
          imgurl : 'http://www.abogadoschwitzer.com/wp-content/uploads/2016/12/KSU_Hale_library-1024x768.jpg'
        }
      ]
    });
  }

  addMonth(){
    this.storage.get('lang').then((val) => {
      console.log('calendar lang '+val);
      if(val == 'es'){
        this.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else if(val == 'fr'){
        this.monthNames = ["EneroFR","FebreroFR","MarzoFR","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else if(val == 'pt'){
        this.monthNames = ["EneroPT","FebreroPT","MarzoPT","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else {
        this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      }
      let alert = this.alertCtrl.create({
        title: 'Register new month'      
      });
      this.monthNames.forEach(element => {
  
        alert.addInput({
          type:'checkbox',
          label: element,
          value: element,
          checked: true
        });  
      });
      alert.addButton(
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      );  
      alert.addButton(
        {
          text: 'Save',
          handler: data => {
            console.log(' Save ');
          }
        },
      ); 
      alert.present();
    });
  }


  //ratings
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

  openBrowser(){
    this.iab.create('http://'+this.website);
  }

  openCall(){
    this.callNumber.callNumber(this.phone, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }

  //no utilizado pero lo conservo para versines posteriores
  openTwitter(){
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