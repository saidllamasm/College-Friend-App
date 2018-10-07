import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InboxSinglePage } from './inbox-single';

@NgModule({
  declarations: [
    InboxSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(InboxSinglePage),
  ],
})
export class InboxSinglePageModule {}
