import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { StatusBar } from '@ionic-native/status-bar';
import { mapStyle } from './mapStyle';
import { SingleUniversityPage } from '../single-university/single-university';
import { Platform } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CreateUniversityPage } from '../create-university/create-university';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Geocoder,
  GeocoderResult
} from '@ionic-native/google-maps';

@NgModule({
  imports: [
    Ionic2RatingModule
  ],
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public monthNm  = '';
  loads = 0;
  public idLoginUser = '';
  public cityActual : string = "";
  txtSearch : string = "";

  results: boolean = false;
  searchNull : boolean = false;

  map: GoogleMap;

  //universidades destacas
  featuresUniversities : any[];
  //

  //universidades mas evaluadas
  evaluatesUniversities : any;
  //

  //universidades cercanas
  nearbyUniversities : any[];
  //

  // univeirsidades inicioo prox
  universityMonthsList : any[];
  //

  // resultado 
  resultUniversities : any[];
  //

  //calendario
  date: any;
  currentYear: any;
  monthNames: string[];
  activities : string[];
  universityDays : any[];
  //end calenadario

  public langGeneral = '';

  constructor(
    private navCtrl: NavController,
    private googleMaps: GoogleMaps,
    public statusBar: StatusBar,
    public plt: Platform,
    public afDatabase: AngularFireDatabase,
    public navParams: NavParams,
    private storage: Storage,
  ){

  }
  
  ionViewWillEnter(){
    this.resultUniversities = [];
    this.universityMonthsList = [];
    this.nearbyUniversities = [];
    this.featuresUniversities = [];
    this.evaluatesUniversities = [];

    this.storage.get('id_userlogin').then((val) => {
      //alert(val);
    });

    this.loadMap();
    this.loadUniversitiesFeature();
    this.loadUniversitiesMostEvaluet();
    this.loadUniversitiesNextStart();

    //this.loadUniversitiesNearby('Ciudad Guzman');

    //this.loadFakeData();
  }

  //inicializa el mapa
  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 19.42847, // default location
          lng: -99.12766 // default location
        },
        zoom: 11,
        tilt: 30
      },
      styles: mapStyle 
    };

    this.map = this.googleMaps.create('map_canvas', mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      this.getPosition();
    })
    .catch(error =>{
      alert("map error " +error);
    });

  }

  // inserta marcadores en el mapa
  insertMarker(title, icon, latLng){
    this.map.addMarker({
      title: title,
      icon: icon,
      position: latLng
    });
  }

  //llamada a promesa para obtener la ubicacion real del usuario
  getPosition(): void{
    this.map.getMyLocation()
    .then(response => {
      this.map.moveCamera({
        target: response.latLng
      });
      //this.insertMarker('Mi ubicación', 'blue', response.latLng);
      this.searchUniversitiesNearby(response.latLng);
    })
    .catch(error =>{
      console.log(error);
    });
  }

  searchUniversitiesNearby(latLng){
    Geocoder.geocode({
      "position": latLng
    }).then((results: GeocoderResult[]) => {
      if (results.length == 0) {
        // Not found
        return null;
      }
      let address: any = [
        results[0].locality || ""].join(", ");
        this.cityActual = ''+address;
        this.loadUniversitiesNearby(address);
    });
  }

  searchUniversityWithName($event){
    let st = ''+$event.target.value;
    let resf = false;
    let unis = [];
    let nulo = true;
    if(st.length > 2){
      resf = true;
      this.afDatabase.database.ref('Universidades').orderByChild('nombre').startAt(st.toUpperCase()).endAt(st.toLowerCase()+'\uf8ff').on("value", function(snapshot) {
          if(snapshot.val() != null ){
            nulo = false;
            //alert('encontre algo');
            snapshot.forEach(function(data) {
                unis.push({
                  imgsrc : "",
                  nombre :  data.val().nombre,
                  address : data.val().direccion[0],
                  rating : data.val().scores.global,
                  id: data.val().id// snapshot.val().id
                });
            });
          }else{
            nulo = true;
            console.log('no hay resultados para : '+st);
          }
      });
      
    }else{
      resf = false;
    }
    
    unis.forEach(element => {
      this.afDatabase.database.ref("Imagenes/Universidad/"+element.id).once('value').then( (snpImg) => {
        let key = Object.keys(snpImg.val())[0];
        let nombre = snpImg.val()[key].name;
        element.imgsrc =  'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media';
      });
    });
    this.results = resf;
    this.resultUniversities = unis;
    this.searchNull = nulo;
  }
  
  viewUniversity(id){
    this.navCtrl.push(SingleUniversityPage,{id_university : id});
  }

  createUniversity(){
    this.navCtrl.push(CreateUniversityPage);
  }

  // sin escuchador de cambios
  loadUniversitiesFeature(){
    this.featuresUniversities= [];
    this.afDatabase.database.ref('/Universidades/').once('value').then( (snapshot) => {
      "use strict";
      snapshot.forEach(element => {
        this.getImages(element.val().id);
      });
    });
    
    
    //this.featuresUniversities = unis;
  }

  getImages(id){
    this.afDatabase.database.ref('Imagenes/Universidad/' + id).once('value').then( (snapshot) => {
      let key = Object.keys(snapshot.val())[0];
      let nombre = snapshot.val()[key].name;
      this.featuresUniversities.push({
        imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
        id:id
      });
    });
  }

  loadUniversitiesNearby(city){
    
    this.afDatabase.database.ref('Universidades').orderByChild('ciudad').equalTo(city).once('value').then( (snapshot) => {
      for(var ip in snapshot.val()){
        let unv = { nombre : snapshot.val()[ip].nombre, rat : ''+ snapshot.val()[ip].scores.global , key : ip};
        var cords ={lat: snapshot.val()[ip].gps.lat, lng: snapshot.val()[ip].gps.lng};
        this.insertMarker(snapshot.val()[ip].nombre, 'blue', cords );
        this.afDatabase.database.ref("Imagenes/Universidad/"+ip).once('value').then( (snpImg) => {
          //for(var ip2 in snpImg.val()){
            let key = Object.keys(snpImg.val())[0];
          let nombre = snpImg.val()[key].name;
            this.nearbyUniversities.push({
              imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
              name : unv.nombre,
              rate: unv.rat,
              id: unv.key
            });
            
          //}
        });
      }
    });
  }

  loadUniversitiesMostEvaluet(){
    this.afDatabase.database.ref('Universidades').orderByChild('scores/global').once('value').then( (snapshot) => {
      for(var ip in snapshot.val()){
        //alert(snapshot.val()[ip].nombre);
        let unv = { nombre : snapshot.val()[ip].nombre, rat : snapshot.val()[ip].scores.global , key : ip};
        this.afDatabase.database.ref("Imagenes/Universidad/"+ip).once('value').then( (snpImg) => {
          let key = Object.keys(snpImg.val())[0];
          let nombre = snpImg.val()[key].name;
            this.evaluatesUniversities.push({
              imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
              name : unv.nombre,
              rating: unv.rat,
              id: unv.key
            });
        });
      }
    });
  }

  loadUniversitiesNextStart(){
    var monthD = new Date().getMonth()+1; // en el servidor inicia en 1, ionic inicia en 0; enero = 0 
    this.afDatabase.database.ref('Universidades').orderByChild('cursos/'+monthD).equalTo(true).once('value').then( (snapshot) => {
      for(var ip in snapshot.val()){
        let unv = { nombre : snapshot.val()[ip].nombre, key : ip};
        this.afDatabase.database.ref("Imagenes/Universidad/"+ip).once('value').then( (snpImg) => {
          for(var ip2 in snpImg.val()){
            this.universityMonthsList.push({
              imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+snpImg.val()[ip2].name+'?alt=media',
              name : unv.nombre,
              id: unv.key
            });
            
          }
        });
      }
    });
  }

}
