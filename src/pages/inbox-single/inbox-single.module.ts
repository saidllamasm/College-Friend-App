import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InboxSinglePage } from './inbox-single';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    InboxSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(InboxSinglePage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
  ],
})
export class InboxSinglePageModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
};