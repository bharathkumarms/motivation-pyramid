import { Component } from '@angular/core';
import {
  //ActionSheet,
  ActionSheetController,
  //ActionSheetOptions,
  Config,
  NavController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MotivationSpeakerData } from '../../providers/motivation-speaker-data';

@Component({
  selector: 'page-motivation-speaker-list',
  templateUrl: 'motivation-speaker-list.html',
})
export class MotivationSpeakerListPage {
  speakers:any[]=[];
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public motivationSpeakerData: MotivationSpeakerData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) {}

  ionViewDidLoad() {
    this.motivationSpeakerData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }

}
