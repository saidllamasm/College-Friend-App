import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { StatusBar } from '@ionic-native/status-bar';
import { mapStyle } from './mapStyle';
import { SingleUniversityPage } from '../single-university/single-university';
import { Platform } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { CreateUniversityPage } from '../create-university/create-university';
import { Storage } from '@ionic/storage';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
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
  universities:any;
  txtSearch : string = "";

  results: boolean = false;

  map: GoogleMap;

  //universidades destacas
  featuresUniversities : any;
  //

  //universidades cercanas
  nearbyUniversities : any;
  //

  //calendario
  date: any;
  currentYear: any;
  monthNames: string[];
  activities : string[];
  universityDays : any;
  //end calenadario

  constructor(
    private navCtrl: NavController,
    private googleMaps: GoogleMaps,
    public statusBar: StatusBar,
    public plt: Platform,
    private storage: Storage
  ){
    this.loadMap();
    this.loadUniversitiesForCalendar();
    this.loadCalendar();
    this.loadFakeData();
  }

  // construir el calendario
  // carga todos los meses dependiendo el lenguaje de la plataforma
  loadCalendar(){
    this.storage.get('lang').then((val) => {
      console.log('calendar lang '+val);
      if(val == 'es'){
        this.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else if(val == 'fr'){
        this.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else if(val == 'pt'){
        this.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octobre","Noviembre","Diciembre"];
      } else {
        this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      }
    });
  }
  // me sirve para evaluar si el mes creado en el calendario tiene algun evento
  // si tiene evento entonces aplicar estilo diferente
  checkEvent(month){
    let flag = false;
    for(let i = 0; i < this.activities.length; i++){
      if(this.activities[i].toString() == month){
        flag =  true;
      }
    }
    return flag;
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
      this.insertMarker('Mi ubicación', 'blue', response.latLng);
    })
    .catch(error =>{
      console.log(error);
    });
  }

  onModelChange(event){
    alert(event);
  }

  testViewUniversity(id){
    //alert(id);
  }

  viewUniversity(id){
    this.navCtrl.setRoot(SingleUniversityPage);
  }

  // me sirve para saber si hay una busqueda de universidad
  viewResults(){
    // comprobar contenido del input, si es vacio llamar a resetResults, sino proceder a resultados = true
    if(this.txtSearch.length > 1)
      this.results = true;
    else 
      this.resetResults(  );
  }

  // el campo de busqueda es vacio entonces regresar los items iniciales y ocultar resultados
  resetResults(){
    this.results = false;
  }

  createUniversity(){
    this.navCtrl.setRoot(CreateUniversityPage);
  }

  viewUniversities(month){
    console.log('load universities with start courses in : '+month);
  }

  // consulta a la db para obtener los inicios de cursos de las universidades registradas
  loadUniversitiesForCalendar(){
    this.date = new Date();
    this.currentYear = this.date.getFullYear();
    // load month with university
    this.activities =["January","February","March"];
  }

  loadFakeData(){
    this.universityDays = [
      {
        name:"Universidad de Guadalajara",
        date:"Agosto 2018",
        id:"1"
      },
      {
        name:"Universida Autonoma de Mexico",
        date:"Agosto 2018",
        id:"1"
      }
    ];
    this.universities = [
      {
        imgsrc: "https://st2.depositphotos.com/1035886/8363/i/950/depositphotos_83635296-stock-photo-pennsylvania-state-university.jpg",
        title:"",
        id:"1"
      },
      {
        imgsrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSelwrji3FhHKyfTeD5iovsP3B1mpVnCIAFEugMZG1tONDXoWr",
        title:"",
        id:"2"
      },
      {
        imgsrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXTmxHvtYK_Zi7uDD5WVvuBPx3pprePBqw4qJDe-BVPG5LO040",
        title:"",
        id:"3"
      },
      {
        imgsrc: "http://periodicolafuente.com/wp-content/uploads/2016/10/las-mejores-universidades-en-Estados-Unidos-La-Fuente.jpg",
        title:"",
        id:"4"
      },
      {
        imgsrc: "https://www.infoidiomas.com/wp-content/uploads/universidad_Pennsylvania.jpg",
        title:"",
        id:"5"
      },
      {
        imgsrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGYDP-pUHdJ-J-xkgfb4_L_CI_q8EQdc-uzxPLWCCPKUYB4h1wEQ",
        title:"",
        id:"6"
      }
    ];
    this.featuresUniversities = [
      {
        imgsrc : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGYDP-pUHdJ-J-xkgfb4_L_CI_q8EQdc-uzxPLWCCPKUYB4h1wEQ",
        name :"Universidad de Chile",
        id:"3"
      }
    ];
    this.nearbyUniversities = [
      {
        imgsrc : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGYDP-pUHdJ-J-xkgfb4_L_CI_q8EQdc-uzxPLWCCPKUYB4h1wEQ",
        name :"Universidad de Chile",
        id:"3" 
      }
    ];
  }

}
