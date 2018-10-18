import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { ImagePicker } from '@ionic-native/image-picker';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
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

  university: AngularFireList<any>;
  map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private googleMaps: GoogleMaps,
    database: AngularFireDatabase,
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth,
    public imagePicker: ImagePicker,
  ) {

    this.loadMap();
    this.university = database.list('UniversidadesT');

  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 19.42847, // default location
          lng: -99.12766 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create('map_canvas', mapOptions);
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
        direccion: this.address,
        estado:'pendiente',
        gps:{
          lat:'LAT',
          lng:'LNG'
        },
        nombre: this.nameUniversity,
        website:this.website,
        telefono:this.phoneUniversity,
        timestamp:database.ServerValue.TIMESTAMP
      }).then( () =>{
        let toast = this.toastCtrl.create({
          message: 'University was added successfully',
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

}
