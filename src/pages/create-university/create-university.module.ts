import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUniversityPage } from './create-university';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';


@NgModule({
  declarations: [
    CreateUniversityPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUniversityPage),
  ],
})
export class CreateUniversityPageModule {}
