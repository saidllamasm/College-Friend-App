import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { AngularFireAuth } from 'angularfire2/auth';

import { TabsPage } from '../pages/tabs/tabs';
import { SlidesPage } from './../pages/slides/slides';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any;

  constructor(
    public platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    translate: TranslateService,
    private globalization: Globalization,
    private storage: Storage,
    public afAuth: AngularFireAuth
  ) {
    platform.ready().then(() => {

      this.globalization.getPreferredLanguage()
        .then(res => {
          if(
            res.value == "es" || 
            res.value == "es-AR" || 
            res.value == "es-BO" ||
            res.value == "es-CL" ||
            res.value == "es-CO" ||
            res.value == "es-CR" ||
            res.value == "es-DO" ||
            res.value == "es-EC" ||
            res.value == "es-ES" ||
            res.value == "es-GT" ||
            res.value == "es-HN" ||
            res.value == "es-MX" ||
            res.value == "es-NI" ||
            res.value == "es-PA" ||
            res.value == "es-PE" ||
            res.value == "es-PR" ||
            res.value == "es-PY" ||
            res.value == "es-SV" ||
            res.value == "es-UY" ||
            res.value == "es-VE" 
          ){
            translate.setDefaultLang("es");  
          } else if(
            res.value == "fr" || 
            res.value == "fr-BE" || 
            res.value == "fr-CA" || 
            res.value == "fr-CH" || 
            res.value == "fr-FR" || 
            res.value == "fr-LU" || 
            res.value == "fr-MC"
          ){
            translate.setDefaultLang("fr");  
          } else if(
            res.value == "pt" || 
            res.value == "pt-BR" || 
            res.value == "pt-PT" || 
            res.value == "pt-CH"
          ){ 
            translate.setDefaultLang("pt");
          } else {
            translate.setDefaultLang("en");
          }
        } 
      )
      .catch(e => {
        translate.setDefaultLang("en");
        console.log("error detected lang "+e)
      });
      if (this.platform.is('android')) {
        statusBar.backgroundColorByHexString('#0055CB');
      }
      this.afAuth.authState.subscribe(user => {
        if(user){
          this.rootPage = TabsPage;
        }else{
          this.rootPage = SlidesPage;  
        }
      });
      
      statusBar.styleLightContent();
      splashScreen.hide();
      
    });
  }
}
