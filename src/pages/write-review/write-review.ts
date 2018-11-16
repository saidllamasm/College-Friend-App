import { Component,ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
//import { ImagePlaceholderComponent } from '../../components/image-placeholder/image-placeholder';
import { AngularFireAuth } from 'angularfire2/auth';
import md5 from 'crypto-md5';
import { AngularFireDatabase } from 'angularfire2/database';
import { database, storage } from 'firebase';
import { ImagePicker } from '@ionic-native/image-picker';

/**
 * Generated class for the WriteReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-write-review',
  templateUrl: 'write-review.html',
})
export class WriteReviewPage {
  images: any = [];
  imagesTmp : any[];
  public userUID = '';
  public id_university = ''; 
  public universityName = '';
  public username = '';
  public dateToday = '';
  public userPicture = '';

  public opinionContent = '';

  public rateInstalaciones = '0';
  public rateProfesores = '0'; 
  public rateUbicacion = '0';
  public rateActividades = '0';
  public rateBecas = '0';
  public rateGeneral = '0.0';
  
  @ViewChild('menucontainer', {read: ViewContainerRef}) menucontainer: ViewContainerRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public afDatabase: AngularFireDatabase,
    public imagePicker: ImagePicker,
    //private componentFactoryResolver: ComponentFactoryResolver,
    public afAuth: AngularFireAuth,
  ) {

    this.imagesTmp= [];
    this.id_university = this.navParams.get('id_university');
    this.universityName = this.navParams.get('name_university');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var tod = new Date();
    this.dateToday =''+ tod.getDay()+' '+ months[tod.getMonth()] +' '+tod.getFullYear();
    this.afAuth.authState.subscribe(user => {
      this.userUID = user.uid;
      this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
      this.username = user.displayName;
    });
    
  }
  
  addPicture(){
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
            outputType: 1 // retornar en base64
          }).then(
            (results) => {
              // recorrer todas las imagenes selecccionadas
              this.images = results;
              for (var i = 0; i < this.images.length; i++) {
                this.imagesTmp.push('data:image/jpeg;base64,' + this.images[i]); 
              }
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


  /*addPicture(){
    const childComponent_var = this.componentFactoryResolver.resolveComponentFactory(ImagePlaceholderComponent);    
    this.menucontainer.createComponent(childComponent_var);
  }*/

  // ratings

  //rate events
  onModelInstalaciones($event){
    this.rateInstalaciones = $event;
  }
  onModelProfesores($event){
    this.rateProfesores = $event;
  }
  onModelUbicacion($event){
    this.rateUbicacion = $event;
  }
  onModelActividades($event){
    this.rateActividades = $event;
  }
  onModelBecas($event){
    this.rateBecas = $event;
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

    for (var i = 0; i < this.images.length; i++) {
      let id = ''+new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '_' + new Date().getMilliseconds() + '_' + new Date().getSeconds() + '_' + new Date().getMinutes() + '_' + new Date().getHours();
      this.uploadPics(this.images[i] , id, this.userUID, this.id_university);
    }

    // save for user
    let univ = {};
    univ[this.id_university] = true;
    this.afDatabase.list('/Usuarios/' + this.userUID +'').update('reviews', univ);


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
