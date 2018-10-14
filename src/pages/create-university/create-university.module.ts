import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUniversityPage } from './create-university';

/*import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';*/
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  declarations: [
    CreateUniversityPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUniversityPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
})
export class CreateUniversityPageModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};