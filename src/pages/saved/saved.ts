import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SingleUniversityPage } from '../single-university/single-university';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCustom } from '../../model/user/user.model';

import { University } from './../../model/university/university.model';
import { ImageUniversity } from '../../model/image/image.model';
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
      this.uuid = user.uid;
      this.afDatabase.database.ref("Usuarios/"+user.uid+"/favs/").once('value').then( (snapshot) => {
        "use strict";
        //console.log(snapshot.val());
        for(var ip in snapshot.val()){
          this.afDatabase.database.ref("Universidades/"+ip).once('value').then( (snp) => {
            console.log(snp.val());
            this.afDatabase.database.ref("Imagenes/Universidad/"+ip).once('value').then( (snpImg) => {
              console.log(snpImg.val());
              for(var ip in snpImg.val()){
                
                this.Favorites.push({
                  imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+snpImg.val()[ip].name+'?alt=media',
                  name: snp.val().nombre,
                  address: snp.val().direccion[0],
                  id: snp.val().id
                });
              }
            });
          });
        }
        
      });
      //this.Opinions = universities;
      
    });
    
  }

  deleteFav(id){
    this.afDatabase.object('/Usuarios/' + this.uuid+'/favs/'+id).remove();
  }

  goToUniversity(id){
    this.navCtrl.push(SingleUniversityPage, {id_university : id });
  }
}
