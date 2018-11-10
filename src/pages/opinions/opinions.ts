import { OpinionSinglePage } from './../opinion-single/opinion-single';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import md5 from 'crypto-md5';

import { UserCustom } from '../../model/user/user.model';
import { University } from './../../model/university/university.model';
import { ImageUniversity } from '../../model/image/image.model';
/**
 * Generated class for the OpinionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opinions',
  templateUrl: 'opinions.html',
})
export class OpinionsPage {
  uuid : string ;
  public username = '';
  public userPicture = '';
  public numberOpinions = 0;
  public Opinions = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase,
  ) {
    this.afAuth.authState.subscribe(user => {
      this.uuid = user.uid;
      this.username = user.displayName ;
      this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
      let universities = [];
      this.afDatabase.database.ref("Usuarios/"+user.uid+"/reviews/").once('value').then( (snapshot) => {
        "use strict";
        console.log(snapshot.val()); 
        for(var ip in snapshot.val()){
          this.afDatabase.database.ref("Universidades/"+ip).once('value').then( (snp) => {
            this.afDatabase.database.ref("Imagenes/Universidad/"+ip).once('value').then( (snpImg) => {
              let key = Object.keys(snpImg.val())[0];
              let nombre = snpImg.val()[key].name;
              universities.push({
                imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
                name : snp.val().nombre,
                rating : snp.val().scores.global,
                id : snp.val().id
              });
            });
          });
        }
      });
      this.Opinions = universities;
      
    });
  }

  openOpinionSinglePage(id){
    this.navCtrl.push(OpinionSinglePage,{id_review : id});
  }
}
