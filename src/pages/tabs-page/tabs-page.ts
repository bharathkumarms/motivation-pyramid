import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
//import { MapPage } from '../map/map';
import { MeetupPage } from '../meetup/meetup';
//TODO: Remove SchedulePage
//import { SchedulePage } from '../schedule/schedule';
import { QuotePage } from '../quote/quote';
//import { SpeakerListPage } from '../speaker-list/speaker-list';
import { MotivationSpeakerListPage } from '../motivation-speaker-list/motivation-speaker-list';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
 //  tab1Root: any = SchedulePage;
  tab1Root: any = QuotePage;
  tab2Root: any = MotivationSpeakerListPage;
  tab3Root: any = MeetupPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
