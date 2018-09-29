import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { OpinionsPage } from '../opinions/opinions';
import { SavedPage } from '../saved/saved';
import { InboxPage } from '../inbox/inbox';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = OpinionsPage;
  tab3Root = SavedPage;
  tab4Root = InboxPage;
  tab5Root = ProfilePage;

  constructor() {

  }
}
