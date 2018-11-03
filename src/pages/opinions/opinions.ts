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
      this.afDatabase.list<UserCustom>('/Usuarios/').valueChanges().subscribe((res: UserCustom[]) => { 
        this.uuid = user.uid;
        this.username = user.displayName ;
        this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
        this.numberOpinions = 10;
        res.forEach((item) => {
            if(item.key == user.uid){
              for(var i in item.reviews) {
                this.afDatabase.list<University>('/Universidades/'+i+'/').valueChanges().subscribe((university : any[]) => {
                  //alert(university[6]+university[7]);

                  //load image
                  this.afDatabase.object('Imagenes/Universidad/' + i).valueChanges().subscribe((images : ImageUniversity ) =>{
                    let key = Object.keys(images)[0];
                    let nombre = images[key].name;
                    this.Opinions.push({
                      imgsrc : 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+nombre+'?alt=media',
                      name: university[7],
                      rating: '0',
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

  loadFakeData(){
    this.Opinions = [
      {
        imgsrc : 'https://latam.businesschief.com/public/uploads/large/large_10_UAEM.jpg',
        name :'ITAM',
        rating : '3',
        id : '-LPExtFttoD2K0tPYZeC'

      }
    ]
  }

  openOpinionSinglePage(id){
    //this.navCtrl.setRoot(OpinionSinglePage);
    this.navCtrl.push(OpinionSinglePage,{id_review : id });
  }
}
