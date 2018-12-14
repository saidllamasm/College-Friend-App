import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Alert } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook'
import { AngularFireAuth } from 'angularfire2/auth';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import { auth } from 'firebase';

import { environment } from '../../environments/environment';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  users: AngularFireList<any>;

  formGroup : FormGroup;
  formGroupLogin : FormGroup;

  email : string ;
  password : string ;
  email_r : string ;
  phone : string ;
  name : string ;
  password_r : string ;
  login : boolean = true;
  
  // for validations


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebook: Facebook,
    public twitterConnect: TwitterConnect,
    public afAuth: AngularFireAuth,
    private platform: Platform,
    database: AngularFireDatabase,
    public afDatabase: AngularFireDatabase,
    public formBuilder: FormBuilder
  ) {
    this.users = database.list('Usuarios');

    let PASSPATTERN = /^[A-Za-z0-9\s]+$/g;
    let PHONEPATTERN = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.formGroupLogin = new FormGroup({
      mailAddressLogin :  new FormControl('', [Validators.required, Validators.pattern( EMAILPATTERN )]),
      passwordValLogin :new FormControl('', [Validators.required, Validators.pattern(PASSPATTERN), Validators.minLength(7)])
   });

    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ÑñáéíóúÁÉÍÓÚ]*'), Validators.minLength(7), Validators.maxLength(35)]),
      phoneNmber : new FormControl('', [Validators.required, Validators.pattern(PHONEPATTERN), Validators.maxLength(10)]),
      mailAddress :  new FormControl('', [Validators.required, Validators.pattern( EMAILPATTERN )]),
      passwordVal :new FormControl('', [Validators.required, Validators.pattern(PASSPATTERN), Validators.minLength(7)])
   });
  }

  // login with email and password
  procesarLogin(){
    let credentials = {
			email: this.email,
			password: this.password
    };
      this.afAuth.auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      ).then(
        () => this.navCtrl.setRoot(TabsPage),
        error =>  alert(error.message)
      );
  }

  // register new user with email and password
  procesarRegistro(){
    if (this.formGroup.valid) {
        // Save your values, using this.form.get('myField').value;
        //alert('validate success');
        let credentials = {
          email: this.email_r,
          password: this.password_r
        };
          this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
          .then( (firebaseUser) =>  {
            //alert(firebaseUser.user.uid);
            this.saveUserFirebase(firebaseUser.user.uid ,credentials.email, this.name, this.phone, 'email');
            this.navCtrl.setRoot(TabsPage);
          }).catch(function(error) {
            console.error("Error: ", error);
            alert(error);
        });
    }else{
      //alert(this.formGroup.errors);
    }
  }

  // login with Faceboook
  procesarFacebook(): Promise<any> {
    AngularFireModule.initializeApp(environment.firebase);
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const fbCredential = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.afAuth.auth.signInWithCredential(fbCredential).then(user => {
          console.log(JSON.stringify(user));
          this.saveUserFirebase(user.uid, user.email, user.displayName, user.phoneNumber, 'Facebook');
          this.navCtrl.setRoot(TabsPage);
        }).catch(error => {
         console.log(JSON.stringify(error));
         alert(JSON.stringify(error));
        });
      });
  }
  // login with Twiter
  procesarTwitter(){
    if (this.platform.is('cordova')) {
      this.twitterConnect.login().then(res => {
        const twitterCredential = auth.TwitterAuthProvider.credential(res.token, res.secret);
        this.afAuth.auth.signInWithCredential(twitterCredential).then(user => {
          this.saveUserFirebase(user.uid,user.email, user.displayName, user.phoneNumber, 'Twitter');
          console.log(JSON.stringify(user));
          this.navCtrl.setRoot(TabsPage)
        }).catch(error => {
          console.log(JSON.stringify(error));
          alert(JSON.stringify(error));
        });
      }).catch((error) => {
        alert(JSON.stringify(error));
      });
    } else {
      this.afAuth.auth
        .signInWithPopup(new auth.TwitterAuthProvider())
        .then((res) => {
          this.saveUserFirebase(res.user.uid, res.user.email, res.user.displayName, res.user.phoneNumber, 'Twitter');
          console.log(JSON.stringify(res));
          this.navCtrl.setRoot(TabsPage)
        }).catch(error => {
          alert(JSON.stringify(error));
      });
    }
  }

  // save user data to firebase 
  saveUserFirebase(uid, email, nombre, telefono, metodo){
    this.afDatabase.database.ref('/Usuarios/'+uid+'/').once('value').then( (snapshot) => {
      if(snapshot.val() != null){
        console.log('login success');
      }else{
        let newUser = {
          key : uid,
          email : email,
          nombre : nombre,
          telefono : telefono,
          reputacion: 'novato',//
          rol :'usuario',
          metodo: metodo, 
          estado :'pendiente',
          configuracion : {
            buscando : true, //
            notificaciones : true //
          }
        };
        this.users.update(uid, newUser);
        //alert('acount created sucess');
      }
      
    });
  }


  //for ui controls
  activeFormRegistro(){
    this.login = true;
  }
  disactiveFormRegistro(){
    this.login = false;
  }

}
