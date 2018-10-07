import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpinionsPage } from './opinions';
// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    OpinionsPage,
  ],
  imports: [
    IonicPageModule.forChild(OpinionsPage),
    Ionic2RatingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
})
export class OpinionsPageModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};