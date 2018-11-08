import { Component,ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImagePlaceholderComponent } from '../../components/image-placeholder/image-placeholder';
import { AngularFireAuth } from 'angularfire2/auth';
import md5 from 'crypto-md5';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { database} from 'firebase';

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
    public afDatabase: AngularFireDatabase,
    private componentFactoryResolver: ComponentFactoryResolver,
    public afAuth: AngularFireAuth,
  ) {

    this.id_university = this.navParams.get('id_university');
    this.universityName = this.navParams.get('name_university');
    this.dateToday =''+ new Date().toISOString();
    this.afAuth.authState.subscribe(user => {
      this.userUID = user.uid;
      this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
      this.username = user.displayName;
    });
    
  }

  addPicture(){
    
    const childComponent_var = this.componentFactoryResolver.resolveComponentFactory(ImagePlaceholderComponent);    
    this.menucontainer.createComponent(childComponent_var);
  }

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


  }
}
