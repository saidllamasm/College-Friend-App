import { HeaderResizeComponent } from './../components/header-resize/header-resize';
//import { ComponentsModule } from './../components/components.module';
import { Facebook } from '@ionic-native/facebook';
import { NgModule, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { InboxSinglePage } from '../pages/inbox-single/inbox-single';
import { ChatPage } from './../pages/chat/chat';
import { CreateUniversityPage } from './../pages/create-university/create-university';
import { LoginPage } from '../pages/login/login';
import { WriteReviewPage } from '../pages/write-review/write-review';

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

import { Globalization } from '@ionic-native/globalization';

import { Camera } from '@ionic-native/camera';

import { AngularFireAuth } from 'angularfire2/auth';

import {TwitterConnect} from '@ionic-native/twitter-connect';

import { IonicStorageModule } from '@ionic/storage';

import { CallNumber } from '@ionic-native/call-number';

import { ImagePicker } from '@ionic-native/image-picker';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { IonicImageViewerModule } from 'ionic-img-viewer';

import { environment } from '../environments/environment';
//import { HeaderResizeComponent } from '../components/header-resize/header-resize';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    HeaderResizeComponent,
    //ComponentsModule
    // for debug
    WriteReviewPage,
    OpinionsPage,
    SavedPage,
    ProfilePage,
    HomePage,
    TabsPage,
    SingleUniversityPage,
    SlidesPage,
    OpinionSinglePage,
    ErrorPage,
    InboxSinglePage,
    ChatPage,
    LoginPage,
    CreateUniversityPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    Ionic2RatingModule,
    //ComponentsModule,
    IonicImageViewerModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    //ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OpinionsPage,
    SavedPage,
    //HeaderResizeComponent,
    ProfilePage,
    HomePage,
    TabsPage,
    SingleUniversityPage,
    SlidesPage,
    OpinionSinglePage,
    ErrorPage,
    InboxSinglePage,
    ChatPage,
    LoginPage,
    CreateUniversityPage,
    WriteReviewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Calendar,
    Camera,
    Globalization,
    Facebook,
    AngularFireAuth,
    TwitterConnect,
    ImagePicker,
    CallNumber,
    InAppBrowser,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};