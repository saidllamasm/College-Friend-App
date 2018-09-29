import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpinionsPage } from './opinions';

@NgModule({
  declarations: [
    OpinionsPage,
  ],
  imports: [
    IonicPageModule.forChild(OpinionsPage),
  ],
})
export class OpinionsPageModule {}
