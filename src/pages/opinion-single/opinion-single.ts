import { environment } from './../../environments/environment';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';

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
  public imagesTmp = [];
  newimages: any = [];
  public bs64Pics = [];

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
    private alertCtrl: AlertController
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
      this.getPicsReview();
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

    //// IMPORTANTE
    // antes de enviar a guardar eliminar todas las imagenes que ya se tienen registradas
    ///imagenes/opiniones/tokenusuario/tokenuniversidad/tokenupload/tokenimg/-children-{name}=id
    //let bd = '/Imagenes/Opiniones/' + this.userUID + '/' +this.id_university+'/';
    //this.afDatabase.object(bd).remove();
      /*alert(this.bs64Pics.length+ ' pics');*/
    for (var i = 0; i < this.newimages.length; i++) {
      let id = ''+new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '_' + new Date().getMilliseconds() + '_' + new Date().getSeconds() + '_' + new Date().getMinutes() + '_' + new Date().getHours();
      this.uploadPics(this.newimages[i] , id, this.userUID, this.id_university);
    }


    this.clearAll();
  }

  clearAll(){
    //limpiar formularios,desaparecer imagenes
    this.navCtrl.pop();
  }

  getPicsReview(){
    this.afAuth.authState.subscribe(user => {
      this.afDatabase.database.ref('Imagenes/Opiniones/' +user.uid+'/'+this.id_university+'/').once('value').then( (snpImg) => {
        "use strict";
        for(var ip in snpImg.val()){
          var nm = 'https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F'+snpImg.val()[ip].name+'?alt=media';
          this.imagesTmp.push(nm);
        }
      });

    });
    
  }

  removePic(id){
    //
    //id = id.replace('https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%','');
    //id = id.replace('?alt=media','');
    var name = id.replace('https://firebasestorage.googleapis.com/v0/b/college-friend-app.appspot.com/o/universidades%2F','');
    name = name.replace('?alt=media','');
    this.alertCtrl.create({
      title: 'Eliminar',
      message: '¿Seguro que desea borrarla?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            let token;
            this.afDatabase.database.ref('Imagenes/Opiniones/'+this.userUID+'/'+this.id_university).once('value').then( (snapshot) => {
              snapshot.forEach((data) =>{
                if(data.val().name == name){
                  //alert(data.key);
                  token = data.key;
                  this.deleteinFirebase(token);
                  //object('/Imagenes/Opiniones/' + this.userUID + '/' +this.id_university+'/'+data.key+'/').remove();
                }
              });
            });
            for(var i = 0; i < this.imagesTmp.length; i++ ){
              console.log('-'+this.imagesTmp[i]+'-');
              if(this.imagesTmp[i] == id){
                delete this.imagesTmp[i];
                this.toastCtrl.create({
                  message: 'Eliminada correctamente',
                  duration: 1000,
                  position: 'bottom'
                }).present();
                // eliminar enlace
                //this.afDatabase.object('/Universidades/' + this.id_university+'/reviews/'+this.userUID+'/').update(0);
                
              }
            }
          }
        }
      ]
    }).present();

  }

  public deleteinFirebase(token){
    this.afDatabase.object('/Imagenes/Opiniones/' + this.userUID + '/' +this.id_university+'/'+token+'/').remove();
  }

  // para agregar una imagen mas a las que ya se tiene
  addPicture(){
    //crear arreglo temporal para ahi almacenar las nuevas imagenes
    // solicitar las nuevas imagenes y guardarl en el arreglo anterior
    this.imagePicker.hasReadPermission().then(
      (result) => { // sin permisos
        if(result == false){
          // solicitar permiso para acceder a galeria
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){ // con permiso
          this.imagePicker.getPictures({
            quality: 50,
            width: 512,
            height: 512,
            maximumImagesCount : 1,
            outputType: 1 // retornar en base64
          }).then(
            (results) => {
              // recorrer todas las imagenes selecccionadas
              this.newimages = results;
              for (var i = 0; i < this.newimages.length; i++) {
                this.bs64Pics.push('data:image/jpeg;base64,' + this.newimages[i]); 
              }
              this.imagesTmp.push(this.bs64Pics);
            }, (err) => {
              console.log(err);
              alert(JSON.stringify(err));
            }
          );
        }
      }, (err) => {
        console.log(err);
        alert(err);
      });
    
  }

  uploadPics( image , name, tokenReview,tokenun){
    const img = 'data:image/jpeg;base64,' + image; 
    const pics = storage().ref('universidades/'+name); // test1, test2, ..., testX
    pics.putString(img, 'data_url').then(res =>{
      const items = this.afDatabase.list('Imagenes/Opiniones/'+tokenReview+'/'+tokenun+'/');
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
