import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ActionSheetController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
} from '@ionic-native/google-maps';

import { Camera, CameraOptions } from '@ionic-native/camera';


import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
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

  base64Image:any;
  photos:any;
  
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
    private camera: Camera,
    private alertCtrl: ActionSheetController,
    public afAuth: AngularFireAuth,
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
    let alert = this.alertCtrl.create({
      title: 'Add image',
      buttons: [
        {
          text: 'Take photo',
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true,
              sourceType:1 //Library
            }
            this.camera.getPicture(options).then((imageData) => {
              let base64Image = 'data:image/jpeg;base64,' + imageData;
            }, (err) => {
              // Handle error
              
            });
          }
        },
        {
          text: 'Add photo',
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true,
              sourceType:0 //Library
            }
            this.camera.getPicture(options).then((imageData) => {
              let base64Image = 'data:image/jpeg;base64,' + imageData;
            }, (err) => {
              // Handle error
              
            });
          }
        }
      ]
    });
    alert.present();
    
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
      });
    });
  }

}
