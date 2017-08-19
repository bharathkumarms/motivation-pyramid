import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from 'ionic-angular';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';

import {AngularFireAuth} from 'angularfire2/auth'

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(private angularFireAuth: AngularFireAuth, private alertCtrl: AlertController,
    public navCtrl: NavController, public userData: UserData) { }

  async onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      try{
        const result = await this.angularFireAuth.auth.signInWithEmailAndPassword(this.login.username,this.login.password)
        this.navCtrl.push(TabsPage);
        this.userData.signup(this.login.username);
        //TODO: Remove printing to console
        console.log(result);
      }catch(e){
        
        this.alertCtrl.create({
            title: 'OOPS',
            subTitle: e,
            buttons: ['Dismiss']
          }).present();

        //TODO: Remove printing to console
        console.log("Login Error: " + e)
      }
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
