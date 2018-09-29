import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { OpinionsPage } from '../pages/opinions/opinions';
import { SavedPage } from '../pages/saved/saved';
import { InboxPage } from '../pages/inbox/inbox';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { GoogleMaps } from '@ionic-native/google-maps';

// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};

const firebaseConfig = {
  apiKey: "AIzaSyCMu3nzZSdZ0Rde7fPU5naWYkx67E4SaII",
  authDomain: "college-friend-app.firebaseapp.com",
  databaseURL: "https://college-friend-app.firebaseio.com",
  projectId: "college-friend-app",
  storageBucket: "college-friend-app.appspot.com",
  messagingSenderId: "330246446378"
};

@NgModule({
  declarations: [
    MyApp,
    OpinionsPage,
    SavedPage,
    InboxPage,
    ProfilePage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig,'demo104'),
    AngularFireDatabaseModule,
    Ionic2RatingModule // Put ionic2-rating module here
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OpinionsPage,
    SavedPage,
    InboxPage,
    ProfilePage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}