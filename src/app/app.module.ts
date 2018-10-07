import { NgModule, ErrorHandler, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SlidesPage } from '../pages/slides/slides';
import { SingleUniversityPage } from '../pages/single-university/single-university';
import { OpinionsPage } from '../pages/opinions/opinions';
import { SavedPage } from '../pages/saved/saved';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { OpinionSinglePage } from '../pages/opinion-single/opinion-single';
import { ErrorPage } from '../pages/error/error';

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

import { Calendar } from '@ionic-native/calendar';

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
    TabsPage,
    HomePage,
    OpinionsPage,
    SavedPage,
    ProfilePage,
    SingleUniversityPage,
    SlidesPage,
    OpinionSinglePage,
    ErrorPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig,'demo104'),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OpinionsPage,
    SavedPage,
    ProfilePage,
    HomePage,
    TabsPage,
    SingleUniversityPage,
    SlidesPage,
    OpinionSinglePage,
    ErrorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}