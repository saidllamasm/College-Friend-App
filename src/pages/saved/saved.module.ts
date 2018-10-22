import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedPage } from './saved';
import { Ionic2RatingModule } from 'ionic2-rating';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    SavedPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedPage),
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
export class SavedPageModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};