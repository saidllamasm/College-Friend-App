import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUniversityPage } from './create-university';

@NgModule({
  declarations: [
    CreateUniversityPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUniversityPage),
  ],
})
export class CreateUniversityPageModule {}
