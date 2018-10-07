import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpinionsPage } from './opinions';
// Import ionic2-rating module
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    OpinionsPage,
  ],
  imports: [
    IonicPageModule.forChild(OpinionsPage),
    Ionic2RatingModule
  ],
})
export class OpinionsPageModule {}
