import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpinionSinglePage } from './opinion-single';

@NgModule({
  declarations: [
    OpinionSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(OpinionSinglePage),
  ],
})
export class OpinionSinglePageModule {}
