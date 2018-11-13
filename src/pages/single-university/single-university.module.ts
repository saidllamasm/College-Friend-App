import { ComponentsModule } from './../../components/components.module';
import { HeaderResizeComponent } from './../../components/header-resize/header-resize';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleUniversityPage } from './single-university';

import { Ionic2RatingModule } from 'ionic2-rating';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    SingleUniversityPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleUniversityPage),
    Ionic2RatingModule,
    //HeaderResizeComponent,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
})

export class SingleUniversityPageModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};