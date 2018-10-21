import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SingleUniversityPage } from '../single-university/single-university';

/**
 * Generated class for the SavedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved',
  templateUrl: 'saved.html',
})
export class SavedPage {
  
  Favorites : any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar
  ) {
    statusBar.backgroundColorByHexString('#0055CB');
    this.loadFakeData();
  }

  deleteFav(id){
    alert(id);
  }

  loadFakeData(){
    this.Favorites = [
      {
        imgsrc : "https://mw2.google.com/mw-panoramio/photos/medium/21232128.jpg",
        name:"Instituto Tecnológico de Ciudad Guzman",
        address:"Avenida Tecnológico #100 Ciudad Guzmán, Mpio. de Zapotlán el Grande, Jalisco, México.",
        id:"2"
      },
      {
        imgsrc : "https://upload.wikimedia.org/wikipedia/commons/9/99/San_Giovanni_Laterano_Rom.jpg",
        name:"Universidad de Guadalajara",
        address:"Avenida Tecnológico #100 Ciudad Guzmán, Mpio. de Zapotlán el Grande, Jalisco, México.",
        id:"3"
      },
      {
        imgsrc : "https://www.itleon.edu.mx/images/tecnoticias/Ago-dic15/21-1/4.jpg",
        name:"Instituto Tecnológico de León",
        address:"Avenida Tecnológico #100 Ciudad Guzmán, Mpio. de Zapotlán el Grande, Jalisco, México.",
        id:"4"
      }
    ];
  }

  goToUniversity(id){
    this.navCtrl.push(SingleUniversityPage, {id_university : id });
  }
}
