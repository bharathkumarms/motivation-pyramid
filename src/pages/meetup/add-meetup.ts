import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
    selector: 'add-meetup',
    templateUrl: 'add-meetup.html'
})
export class AddMeetupPage {
    meetupList: FirebaseListObservable<any>;
    meetup = {
        id: '',
        name: '',
        address: '',
        phone: '',
        city: ''
    };
    constructor(public navCtrl: NavController, public af: AngularFireDatabase, public params: NavParams,
        private alertCtrl: AlertController) {
        this.meetupList = af.list('/meetups');
        this.meetup.id = this.params.get('key');
        this.meetup.name = this.params.get('name');
        this.meetup.address = this.params.get('address');
        this.meetup.phone = this.params.get('phone');
        this.meetup.city = this.params.get('city');
    }

    addMeetup(id: any, name: any, address: any, phone: any, city: any) {

        let alert = this.alertCtrl.create({
            title: 'Invalid Entry',
            subTitle: 'Please correct the data entered.',
            buttons: ['Dismiss']
        });

        if (name === undefined || address === undefined || phone === undefined || city === undefined) {
            alert.present();

        } else {
            if (id) {
                this.meetupList.update(id, {
                    name: name,
                    address: address,
                    phone: phone,
                    city: city
                }).then(newMeetup => {
                    this.navCtrl.pop();
                    console.log(newMeetup);
                }, error => {
                    console.log(error);
                });
            } else {
                this.meetupList.push({
                    name: name,
                    address: address,
                    phone: phone,
                    city: city
                }).then(newMeetup => {
                    this.navCtrl.pop();
                    console.log(newMeetup);
                }, error => {
                    console.log(error);
                });
            }
        }
    }
}