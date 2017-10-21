import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AddMeetupPage } from '../meetup/add-meetup';

@Component({
  selector: 'page-meetup',
  templateUrl: 'meetup.html'
})
export class MeetupPage {
  meetupList: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public af: AngularFireDatabase, public loadingCtrl: LoadingController, public params: NavParams) {
    let loading = this.loadingCtrl.create({
      content: "Load Data...",
      duration: 3000,
      dismissOnPageChange: true
    });
    loading.present();
    this.meetupList = af.list('/meetups');
  }

  addMeetup() {
    this.navCtrl.push(AddMeetupPage);
  }

  editMeetup(meetup: any) {
    this.navCtrl.push(AddMeetupPage, {
      key: meetup.$key,
      name: meetup.name,
      address: meetup.address,
      phone: meetup.phone,
      city: meetup.city
    });
  }

  deleteMeetup(meetup: any) {
    this.meetupList.remove(meetup);
  }
}