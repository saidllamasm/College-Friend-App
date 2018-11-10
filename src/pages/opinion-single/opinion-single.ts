import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImagePicker } from '@ionic-native/image-picker';
import { database, storage } from 'firebase';
import md5 from 'crypto-md5';
/**
 * Generated class for the OpinionSinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opinion-single',
  templateUrl: 'opinion-single.html',
})
export class OpinionSinglePage {
  public userUID = '';
  images: any = [];

  public universityName = '';
  public id_university = '';
  public username = '';
  public dateToday = '';
  public userPicture = '';

  public rateInstalaciones = 0;
  public rateProfesores = 0;
  public rateUbicacion = 0;
  public rateActividades = 0;
  public rateBecas = 0;
  public opinionContent = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public afDatabase: AngularFireDatabase,
    public imagePicker: ImagePicker,
  ) {
    this.id_university = this.navParams.get('id_review');
    this.afDatabase.database.ref('Universidades/'+this.id_university).once('value').then( (snapshot) => {
      this.universityName = snapshot.val().nombre;
    });
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var tod = new Date();
    this.dateToday =''+ tod.getDay()+' '+ months[tod.getMonth()] +' '+tod.getFullYear();

    //this.universityName = this.navParams.get('name');
    this.afAuth.authState.subscribe(user => {
      this.userUID = user.uid;
      this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
      this.username = user.displayName;
      this.afDatabase.database.ref('Universidades/'+this.id_university+'/reviews/'+user.uid).once('value').then( (snapshot) => {
        this.rateActividades = snapshot.val().scores.actividades;
        this.rateProfesores = snapshot.val().scores.profesores;
        this.rateInstalaciones = snapshot.val().scores.instalaciones;
        this.rateUbicacion = snapshot.val().scores.ubicacion;
        this.rateBecas = snapshot.val().scores.becas;
        this.opinionContent = snapshot.val().opinion;
      });
    });
    
  }

  saveReview(){
    this.afDatabase.object('/Universidades/' + this.id_university+'/reviews/'+this.userUID+'/').update(
      {
        estado : 'pendiente',
        interacciones: {
          likes : 0, 
          dislikes : 0
        },
        scores : {
          actividades : this.rateActividades,
          becas : this.rateBecas,
          instalaciones : this.rateInstalaciones,
          profesores : this.rateProfesores,
          ubicacion : this.rateProfesores
        },
        opinion :  this.opinionContent,
        timestamp: database.ServerValue.TIMESTAMP
      }
    );

    /*for (var i = 0; i < this.images.length; i++) {
      let id = ''+new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '_' + new Date().getMilliseconds() + '_' + new Date().getSeconds() + '_' + new Date().getMinutes() + '_' + new Date().getHours();
      this.uploadPics(this.images[i] , id, this.userUID);
    }*/
  }

  uploadPics( image , name, tokenReview){
    const img = 'data:image/jpeg;base64,' + image; 
    const pics = storage().ref('universidades/'+name); // test1, test2, ..., testX
    pics.putString(img, 'data_url').then(res =>{
      const items = this.afDatabase.list('Imagenes/Opiniones/'+tokenReview+'/');
      items.push({}).set({
        name : ''+res.metadata.name + '',
        path : ''+ res.metadata.fullPath + '',
        hash : ''+res.metadata.md5Hash+'',
        content_type : ''+res.metadata.contentType+'',
        estado : 'pendiente'
      }).then( () =>{
        let toast = this.toastCtrl.create({
          message: 'Upload success',
          duration: 1000,
          position: 'bottom'
        }).present();
      });
    }).catch(err =>{
      console.log(JSON.stringify(err));
      alert(err);
    });
  }

}
