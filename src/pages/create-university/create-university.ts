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

import { AngularFireList, AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
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
    public database: AngularFireDatabase,
    public imagePicker: ImagePicker,
    public loadingCtrl: LoadingController
  ) {
    //this.loadMap();
    this.university = database.list('Universidades');
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

  uploadPics( image , name, tokenUniversity){
    const img = 'data:image/jpeg;base64,' + image; 
    const pics = storage().ref('universidades/'+name); // test1, test2, ..., testX
    pics.putString(img, 'data_url').then(res =>{
      console.log(JSON.stringify(res.metadata) + " for univerisity "+tokenUniversity);
      const items = this.database.list('/Imagenes/Universidad/'+tokenUniversity+'/');
      items.push({}).set({
        name : ''+res.metadata.name + '',
        path : ''+ res.metadata.fullPath + '',
        hash : ''+res.metadata.md5Hash+'',
        content_type : ''+res.metadata.contentType+'',
        estado : 'pendiente'
      }).then( () =>{
        let toast = this.toastCtrl.create({
          message: 'Upload success',
          duration: 1000,
          position: 'bottom'
        }).present();
      });
    }).catch(err =>{
      console.log(JSON.stringify(err));
      alert(err);
    });
  }

  saveUniversity(){
    this.afAuth.authState.subscribe(user => {
      let data = {
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
        timestamp:database.ServerValue.TIMESTAMP,
        id : 'default',
        scores : {
          actividades : 0,
          becas : 0,
          global : 0,
          instalaciones : 0,
          profesores : 0,
          ubicacion : 0
        },
        reviews : {

        },
        cursos:{
          1 : false,
          2 : false,
          3 : false,
          4 : false,
          5 : false,
          6 : false,
          7 : false,
          8 : false,
          9 : false,
          10 : false,
          11 : false,
          12 : false
        }
      }
      let newUniversity = this.university.push( data ).key;
      data.id = newUniversity;
      //alert('verify id: '+data.id+ ' vs '+newUniversity);
      this.university.update( newUniversity, data);
      /*newUniversity.then( () => {*/
      this.clearInputs();
      for (var i = 0; i < this.images.length; i++) {
        let id = ''+new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '_' + new Date().getMilliseconds() + '_' + new Date().getSeconds() + '_' + new Date().getMinutes() + '_' + new Date().getHours();
        this.uploadPics(this.images[i] , id, newUniversity);
      }
      let toast = this.toastCtrl.create({
        message: 'University was added successfully',
        duration: 3000,
        position: 'bottom'
      }).present();
      
    });
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
