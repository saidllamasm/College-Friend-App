import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SingleUniversityPage } from '../single-university/single-university';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCustom } from '../../model/user/user.model';
import { Storage } from '@ionic/storage';

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
  uuid : string ;
  public Favorites  = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase,
    private storage: Storage
  ) {
    statusBar.backgroundColorByHexString('#0055CB');

    this.afAuth.authState.subscribe(user => {
      this.afDatabase.list<UserCustom>('/Usuarios/').valueChanges().subscribe((res: UserCustom[]) => { 
        this.uuid = user.uid;
        res.forEach((item) => {
            if(item.key == user.uid){
              for(var i in item.favs) {
                this.afDatabase.list<University>('/Universidades/'+i+'/').valueChanges().subscribe((university : any[]) => {
                  //alert(university[6]+university[7]);

                  //load image
                  this.afDatabase.object('Imagenes/Universidad/' + i).valueChanges().subscribe((images : ImageUniversity ) =>{
                    let key = Object.keys(images)[0];
                    let nombre = images[key].name;
                    this.Favorites.push({
                      imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
                      name: university[7],
                      address: university[1],
                      id: university[6]
                    });
                  });
                  //end load image
                });
              }
              //console.log(univers[0].token_university);
            } 
        });
      },(err)=>{
         console.log("problem : ", err)
         alert(err);
      });
    })
    //this.loadFakeData();
  }

  deleteFav(id){
    this.afDatabase.object('/Usuarios/' + this.uuid+'/favs/'+id).remove();
  }

  goToUniversity(id){
    this.navCtrl.push(SingleUniversityPage, {id_university : id });
  }
}
