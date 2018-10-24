import { University } from './../../model/university/university.model';
import { ImageUniversity } from './../../model/image/image.model';
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
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Geocoder,
  GeocoderResult
} from '@ionic-native/google-maps';
import { DomSanitizer } from '@angular/platform-browser';

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
  public cityActual : string = "";
  txtSearch : string = "";

  results: boolean = false;

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

  //calendario
  date: any;
  currentYear: any;
  monthNames: string[];
  activities : string[];
  universityDays : any[];
  //end calenadario

  constructor(
    private navCtrl: NavController,
    private googleMaps: GoogleMaps,
    public statusBar: StatusBar,
    public plt: Platform,
    private storage: Storage,
    public afDatabase: AngularFireDatabase,
    public navParams: NavParams,
    private sanitization:DomSanitizer,
  ){
    this.nearbyUniversities = [];
    this.featuresUniversities = [];

    this.loadMap();
    this.loadUniversitiesFeature();
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
      this.insertMarker('Mi ubicación', 'blue', response.latLng);
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
        alert(address);
        this.cityActual = ''+address;
        this.loadUniversitiesNearby(address);
    });
  }

  loadUniversitiesNearby(city){
    let tmpNombre, tmpRate, tmpId;
    var ref = this.afDatabase.database.ref("Universidades").orderByChild('ciudad').equalTo(city).on("child_added", function(snapshot) {
      //alert(snapshot.val().nombre);
      console.log('nearby: '+snapshot.val().nombre);
      tmpNombre = snapshot.val().nombre;
      tmpRate = snapshot.val().scores.global;
      tmpId = snapshot.val().id;

    });
    this.nearbyUniversities.push({
      imgsrc : "http://becas-mexico.mx/wp-content/uploads/2017/10/becas-mexico-itcg-2017-2018.jpg",
      name : tmpNombre,
      rate : tmpRate, // snapshot.val().scores.global,
      id: tmpId// snapshot.val().id
    });
    
  }

  viewUniversity(id){
    //alert(id);
    this.navCtrl.push(SingleUniversityPage,{id_university : id });
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
    this.navCtrl.push(CreateUniversityPage);
  }

  viewUniversities(month){
    console.log('load universities with start courses in : '+month);
  }

  loadUniversitiesFeature(){
    this.afDatabase.list<University>('/Universidades/').valueChanges().subscribe((res: University[]) => { 
      res.forEach((item) => {
        console.log(item.id+" :university");
        this.afDatabase.object('Imagenes/Universidad/' + item.id).valueChanges().subscribe((images : ImageUniversity) =>{
          //console.log(item.id+' IMPORTANT '+JSON.stringify(images));
          //console.log('ms : '+JSON.parse(images));
          let key = Object.keys(images)[0];
          let nombre = images[key].name;
          this.featuresUniversities.push({
            imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
            id : item.id
          });
        });
      });
    },(err)=>{
       console.log("problem : ", err)
       alert(err);
    });
  }
  
  loadFakeData(){
   //  this.fakeFeatures();
    this.universityDays = [
      {
        imgsrc : "https://upload.wikimedia.org/wikipedia/commons/9/99/San_Giovanni_Laterano_Rom.jpg",
        name:"Universidad de Guadalajara",
        date:"Agosto",
        id:"1"
      },
      {
        imgsrc : "https://www.unam.mx/sites/default/files/images/menu/library-345273_1280.jpg",
        name:"Universida Autonoma de Mexico",
        date:"Agosto",
        id:"1"
      },
      {
        imgsrc : "https://periodicocorreo.com.mx/wp-content/uploads/2017/01/UG.jpg",
        name:"Universida de Guanajuato",
        date:"Agosto",
        id:"1"
      }
    ];
    
    this.evaluatesUniversities = [
      {
        imgsrc : "https://upload.wikimedia.org/wikipedia/commons/9/99/San_Giovanni_Laterano_Rom.jpg",
        name :"Universidad de Chile",
        id:"3"
      },
      {
        imgsrc : "https://storage.googleapis.com/mmc-cdn-bucket/uploads/2017/02/aa4b297f-uasd-1.jpg",
        name :"universidad de Santo Domingo",
        id:"3"
      }
    ];
  }

}
