import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { ImagePicker } from '@ionic-native/image-picker';

import {
  GoogleMaps,
  GoogleMap,
  Geocoder,
  GeocoderResult,
  Marker
} from '@ionic-native/google-maps';

import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { database, storage } from 'firebase';
/**
 * Generated class for the CreateUniversityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-university',
  templateUrl: 'create-university.html',
})
export class CreateUniversityPage {
  images: any = [];

  nameUniversity:String;
  address:String;
  phoneUniversity:String;
  website:String;
  //geopoints : AddressUniversity;
  positionLat : string;
  positionLng : string;
  locality : string;
  addresses : string[];

  university: AngularFireList<any>;
  map: GoogleMap;
  loading: any;
  @ViewChild('search_address') search_address:ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth,
    database: AngularFireDatabase,
    public imagePicker: ImagePicker,
    public loadingCtrl: LoadingController,
  ) {
    //this.loadMap();
    this.university = database.list('UniversidadesT');
  }

  ionViewDidEnter() {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loadMap();
  }

  loadMap(){
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });
  }

  onButton1_click(event) {
    this.loading.present();
    this.map.clear();
    this.address = this.search_address.nativeElement.value;
    // Address -> latitude,longitude
    Geocoder.geocode({
      "address": this.search_address.nativeElement.value
    })
    .then((results: GeocoderResult[]) => {

      this.loading.dismiss();
      this.positionLat = ''+results[0].position.lat;
      this.positionLng = ''+results[0].position.lng;
      this.locality = results[0].locality;
      this.addresses = results[0].extra.lines;

      let marker: Marker = this.map.addMarkerSync({
        'position': results[0].position,
        'title':  JSON.stringify(results[0].position)
      });
      this.map.animateCamera({
        'target': marker.getPosition(),
        'zoom': 17
      }).then(() => {
        marker.showInfoWindow();
      })
    });
  }

  addPicture(){
    this.imagePicker.hasReadPermission().then(
      (result) => { // sin permisos
        if(result == false){
          // solicitar permiso para acceder a galeria
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){ // con permiso
          this.imagePicker.getPictures({
            quality: 50,
            width: 512,
            height: 512,
            outputType: 1 // retornar en base64
          }).then(
            (results) => {
              // recorrer todas las imagenes selecccionadas
              this.images = results;
              /*for (var i = 0; i < results.length; i++) {
                let id = ''+new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '_' + new Date().getMilliseconds() + '_' + new Date().getSeconds() + '_' + new Date().getMinutes() + '_' + new Date().getHours() + '_' + i;
                this.uploadPics(results[i] , id);
              }*/
            }, (err) => {
              console.log(err);
              alert(JSON.stringify(err));}
          );
        }
      }, (err) => {
        console.log(err);
        alert(err);
      });
  }

  uploadPics( image , name){
    const img = 'data:image/jpeg;base64,' + image; 
    const pics = storage().ref('pictures/'+name); // test1, test2, ..., testX
    pics.putString(img, 'data_url');
  }

  saveUniversity(){
    this.afAuth.authState.subscribe(user => {
      const newUniversity = this.university.push({});
      newUniversity.set({
        uid_creador: user.uid,
        direccion: this.addresses,
        ciudad : this.locality,
        estado:'pendiente',
        gps:{
          lat: this.positionLat,
          lng: this.positionLng
        },
        nombre: this.nameUniversity,
        website:this.website,
        telefono:this.phoneUniversity,
        timestamp:database.ServerValue.TIMESTAMP
      }).then( () =>{
        this.clearInputs();
        let toast = this.toastCtrl.create({
          message: 'University was added successfully',
          duration: 3000,
          position: 'bottom'
        }).present();
      }).catch(error =>{
        console.log(error);
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000,
          position: 'bottom'
        }).present();
      });
    });
    for (var i = 0; i < this.images.length; i++) {
      let id = ''+new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '_' + new Date().getMilliseconds() + '_' + new Date().getSeconds() + '_' + new Date().getMinutes() + '_' + new Date().getHours();
      this.uploadPics(this.images[i] , id);
    }
  }

  clearInputs(){
    this.nameUniversity = "";
    this.address = "";
    this.phoneUniversity = "";
    this.website = "";
    this.positionLng = "";
    this.positionLat = "";
    this.addresses = [];
    this.locality ="";
  }

}
