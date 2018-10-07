import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { OpinionsPage } from '../opinions/opinions';
import { SavedPage } from '../saved/saved';
import { ProfilePage } from '../profile/profile';
import { ChatPage } from '../chat/chat';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = OpinionsPage;
  tab3Root = SavedPage;
  tab4Root = ChatPage;
  tab5Root = ProfilePage;

  constructor() {

  }
}
