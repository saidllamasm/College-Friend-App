import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SingleUniversityPage } from '../single-university/single-university';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
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
  uuid = '' ;
  public Favorites  = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase
  ) {
    statusBar.backgroundColorByHexString('#0055CB');
    this.afAuth.authState.subscribe(user => {
      let unis =[];
      this.uuid = user.uid;
      this.afDatabase.database.ref("Usuarios/"+user.uid+"/favs/").once('value').then( (snapshot) => {
        for(var ip in snapshot.val()){
          this.afDatabase.database.ref('/Universidades/'+ip).once('value').then( (snapshot) => {
            "use strict";
            this.getImages(snapshot.val().id, snapshot.val().nombre, snapshot.val().direccion[0]);
          });
        }
      });
      
    });
    
  }

  getImages(id, nom,addrs){
    this.afDatabase.database.ref('Imagenes/Universidad/' + id).once('value').then( (snapshot) => {
      let key = Object.keys(snapshot.val())[0];
      let nombre = snapshot.val()[key].name;
      this.Favorites.push({
        imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
        id:id,
        name:nom,
        address:addrs
      });
    });
  }

  deleteFav(id){
    this.afDatabase.object('/Usuarios/' + this.uuid+'/favs/'+id).remove();
  }

  goToUniversity(id){
    this.navCtrl.push(SingleUniversityPage, {id_university : id });
  }
}
