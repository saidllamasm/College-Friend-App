import { InboxSinglePage } from './../inbox-single/inbox-single';
import { CallNumber } from '@ionic-native/call-number';
import { University } from './../../model/university/university.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { WriteReviewPage } from '../write-review/write-review';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import md5 from 'crypto-md5';
import { UserCustom } from '../../model/user/user.model';
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
  public isFav = false;
  public nameUserCreated = 'default';
  public userProfileCreated = '';
  public creatorUID = [{}];
  public langGeneral = '';

  public rateInstalaciones = '0';
  public rateProfesores = '0'; 
  public rateUbicacion = '0';
  public rateActividades = '0';
  public rateBecas = '0';
  public rateGeneral = '0.0';


  carrers: AngularFireList<any>;
  monthsAF: AngularFireList<any>;
  userAF : AngularFireList<any>;

  public id_university; //id esta universidad 
  public id_userlogin; // id este usuario
  
  public name = 'default';
  public address = 'default';
  public userCreated = 'default';
  public lat;
  public lng;
  public phone;
  public website;

  //
  public timeCreated = '';
  public listCarrers = [];
  public listMonths = [];
  public listReviews = [];
  public tmpReviews = [];
  public listIms = [];

  monthNames = [];

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
    public afAuth: AngularFireAuth
    ) {
      statusBar.backgroundColorByHexString('#0055CB');
      this.langGeneral = ''+this.getLenguaje().then((res)=>{
      });
      this.getIsFav(); // para habilitar el icono especifico de fav

      this.id_university = this.navParams.get('id_university');
      this.getImagesFeature();
      
      // get basic info
      this.afDatabase.database.ref('/Universidades/'+this.id_university+'/').once('value').then( (snapshot) => {
        console.log(snapshot.val());
        "use strict";
        this.name = snapshot.val().nombre;
        this.address = snapshot.val().direccion[0];
        this.lat = snapshot.val().gps.lat;
        this.lng = snapshot.val().gps.lng;
        this.rateInstalaciones = snapshot.val().scores.instalaciones;
        this.rateProfesores = snapshot.val().scores.profesores;
        this.rateUbicacion = snapshot.val().scores.ubicacion;
        this.rateActividades = snapshot.val().scores.actividades;
        this.rateBecas = snapshot.val().scores.becas;
        this.timeCreated = this.timeConverter(snapshot.val().timestamp).dia + ' '+this.timeConverter(snapshot.val().timestamp).mes + ' '+this.timeConverter(snapshot.val().timestamp).año,
        this.rateGeneral = snapshot.val().scores.global;
        this.tmpReviews = snapshot.val().reviews;
        this.phone = snapshot.val().telefono;
        this.website = snapshot.val().website;
        this.getReviews();
        let user = snapshot.val().uid_creador;
        this.afDatabase.database.ref('/Usuarios/'+user+'/').once('value').then( (snp) => {
          this.nameUserCreated = snp.val().nombre;
          this.userProfileCreated = "https://www.gravatar.com/avatar/" + md5(snp.val().email, 'hex')+"?s=400";
        });
        //this.creatorUID = this.getInfoUser(user);

        
        //load carrers
        for (var ip in snapshot.val().carreras) {
          this.listCarrers.push({nombre : snapshot.val().carreras[ip]});
        }

        //load months
        for (var ip in snapshot.val().cursos) {
          if(snapshot.val().cursos[ip] == true){
            this.listMonths.push({nombre : this.getNameMonth(ip) });// .push('2');// = university[0];
            this.monthNames.push(this.getNameMonth(ip));
          }
        }
      });
      

  }

  getLenguaje = async() =>{
    let lng = await this.loadLng();
    return lng;
  }

  loadLng = () => {
    return new Promise((resolve, reject) => {
      this.storage.get('lang').then((val) => {
        console.log(val);
        resolve (val);
      });
    });
  }
  
  getNameMonth(id){
    var mth = "null";
    if(this.langGeneral == 'es'){
      //alert('es '+id);
      if(id == '1'){
        mth = 'Enero';
      } else if(id == '2') {
        mth = 'Febrero';
      } else if(id == '3') {
        mth = 'Marzo';
      } else if(id == '4') {
        mth = 'Abril';
      } else if(id == '5') {
        mth = 'Mayo';
      } else if(id == '6') {
        mth = 'Junio';
      } else if(id == '7') {
        mth = 'Julio';
      } else if(id == '8') {
        mth = 'Agosto';
      } else if(id == '9') {
        mth = 'Septiembre';
      } else if(id == '10') {
        mth = 'Octubre';
      } else if(id == '11') {
        mth = 'Noviembre';
      } else if(id == '12') {
        mth = 'Diciembre';
      }
    } else if(this.langGeneral == 'fr'){
      //alert('fr '+id);
    } else if(this.langGeneral == 'pt'){
      //alert('pt '+id);
    } else {
      //alert('en '+id);
      if(id == '1'){
        mth = 'January';
      } else if(id == '2') {
        mth = 'February';
      } else if(id == '3') {
        mth = 'March';
      } else if(id == '4') {
        mth = 'April';
      } else if(id == '5') {
        mth = 'May';
      } else if(id == '6') {
        mth = 'June';
      } else if(id == '7') {
        mth = 'July';
      } else if(id == '8') {
        mth = 'August';
      } else if(id == '9') {
        mth = 'September';
      } else if(id == '10') {
        mth = 'October';
      } else if(id == '11') {
        mth = 'November';
      } else if(id == '12') {
        mth = 'December';
      }
    }
    return mth;
  }

  addCarrer(){
    let alert = this.alertCtrl.create({
      title: 'Register new carrer',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
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
            this.carrers = this.afDatabase.list('Universidades/'+this.id_university+'/');
            var id = Math.floor((Math.random() * 150) + 1) + ''+Math.floor((Math.random() * 150) + 1) + ''+Math.floor((Math.random() * 150) + 1) +''+Math.floor((Math.random() * 1000) + 1) + ''+Math.floor((Math.random() * 1000) + 1) ;
            let newCarrer = {};
            newCarrer[id] = data.name;
            this.carrers.update('carreras', newCarrer);
          }
        }
      ]
    });
    alert.present();
  }

  getImagesFeature(){
    this.afDatabase.database.ref('Imagenes/Universidad/' + this.id_university).once('value').then( (span) => {
      for (var ip in span.val()) {
        this.listIms.push({
          imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+span.val()[ip].name+'?alt=media'
        });
        //imagesTMP.push({imgurl : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+span[ip].name+'?alt=media' });
      }
    });
  }

  initChat(id){
    // send id user with param: id_user
    this.navCtrl.push(InboxSinglePage, {id_user : id});
  }

  getReviews(){
    for (var review in this.tmpReviews) {
      //alert( this.tmpReviews[review].opinion );
      this.listReviews.push({
        id_username : review,
        id_review : review,
        content : this.tmpReviews[review].opinion,
        //time : this.tmpReviews[review].opinion
        time : this.timeConverter(this.tmpReviews[review].timestamp).mes + ' '+this.timeConverter(this.tmpReviews[review].timestamp).año, //time
      });
    }
    this.listReviews.forEach(element => {
      //alert(element.id_username);
      this.afDatabase.database.ref('Usuarios/' + element.id_username+'/').once('value').then( (span) => {
        element.username  = span.val().nombre;
        element.imgsrc  = "https://www.gravatar.com/avatar/" + md5(span.val().email, 'hex')+"?s=400";
      });
    });
    this.listReviews.forEach(element => {
      let imagesTMP = [];
      //alert(element.id_username);
      //alert(element.id_username);
      //this.afDatabase.database.ref('Imagenes/Opiniones/'+element.id_username+"/" + this.id_university).once('value').then( (span) => {
        this.afDatabase.database.ref('Imagenes/Opiniones/'+element.id_username+'/'+this.id_university+'/').once('value').then( (span) => {
        "use strict";
        
        for (var ip in span.val()) {
          //alert(span.val()[ip].name);
          imagesTMP.push({imgurl : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+span.val()[ip].name+'?alt=media' });
        }
        element.images = imagesTMP ;
      });

    });
  }


  timeConverter(time){
    var timestamp   = time.toString().substring(0,10),
    date        = new Date(timestamp * 1000),
    datevalues  = [
                   date.getFullYear(), //0
                   date.getMonth(), //1
                   date.getDate(), //2
                   date.getHours(), //3
                   date.getMinutes(), //4
                   date.getSeconds(), //5
                ]; 
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var timeTraslate = {
      segundo : datevalues[5],
      minuto : datevalues[4],
      hora  : datevalues[3],
      dia : datevalues[2],
      mes : months[datevalues[1]],
      año : datevalues[0]
    };
    
    return timeTraslate;
  }

  addMonth(){
    this.storage.get('lang').then((val) => {
      console.log('calendar lang '+val);
      let monthNamesBase : string [];
      let titleMondal = "";
      if(val == 'es'){
        monthNamesBase = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
        titleMondal = 'Registrar nuevo mes';
      } else if(val == 'fr'){
        titleMondal = 'Register new month';
        monthNamesBase = ["EneroFR","FebreroFR","MarzoFR","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else if(val == 'pt'){
        titleMondal = 'Register new month';
        monthNamesBase = ["EneroPT","FebreroPT","MarzoPT","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else {
        titleMondal = 'Register new month';
        monthNamesBase = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      }
      let alert = this.alertCtrl.create({
        title: titleMondal
      });
      let index = 1;
      monthNamesBase.forEach(element => {
        let added = false;
        this.monthNames.forEach(lmBase => {
          if(element == lmBase){
            added = true;
            alert.addInput({
              type: 'checkbox',
              label: element,
              value: ''+index,
              checked: true
            });
          }
        });
        if(!added){
          alert.addInput({
            type: 'checkbox',
            label: element,
            value: ''+index,
            checked: false
          });
        }
        index++;
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
            let MonthsAF = { 1 : false, 2 : false, 3 : false, 4 : false, 5 : false, 6 : false,  7 : false, 8 : false, 9 : false, 10 : false, 11 : false, 12 : false };
            data.forEach(element => {
              MonthsAF[element] = true;
            });
            this.monthsAF = this.afDatabase.list('Universidades/'+this.id_university+'/');
            this.monthsAF.update('cursos', MonthsAF);
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
      window.open('twitter://user?screen_name=said_llamas', '_system', 'location=no');
    } else {
      window.open('https://twitter.com/said_llamas', '_system', 'location=no');
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
  
  // para universidad favorita de usuario
  getIsFav(){
    let idUnv = this.navParams.get('id_university');
    this.afAuth.authState.subscribe(user => {
      this.afDatabase.database.ref('/Usuarios/'+user.uid+'/favs/').once('value').then( (snapshot) => {
        for(var ip in snapshot.val()){
          if(ip == idUnv){
            this.isFav = true;
          }
        }
      });
    });
  }

  notFav(){
    this.isFav = false;
    let idUnv = this.navParams.get('id_university');
    this.afAuth.authState.subscribe(user => {
      let bd = '/Usuarios/' + user.uid+'/favs/'+idUnv;
      this.afDatabase.object(bd).remove();
    });
  }
  
  yesFav(){
    this.isFav = true;
    let idUnv = this.navParams.get('id_university');
    this.afAuth.authState.subscribe(user => {
      let uid = user.uid;
      let newFavorite = {};
      newFavorite[idUnv] = true;
      this.afDatabase.object('/Usuarios/' + uid+'/favs/').update(newFavorite);
    });
  }

}