import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
//import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
//TODO: Remove SchedulePage
//import { SchedulePage } from '../pages/schedule/schedule';
import { QuotePage } from '../pages/quote/quote';
import { MeetupPage } from '../pages/meetup/meetup';

//import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { MotivationSpeakerListPage } from '../pages/motivation-speaker-list/motivation-speaker-list';
import { SupportPage } from '../pages/support/support';

import { ConferenceData } from '../providers/conference-data';
import { QuoteData } from '../providers/quote-data';
import { MotivationSpeakerData } from '../providers/motivation-speaker-data';
import { SupportData } from '../providers/support-data';
import { FavoriteData } from '../providers/favorite-data';
import { UserData } from '../providers/user-data';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Quote', name: 'TabsPage', component: TabsPage, tabComponent: QuotePage, index: 0, icon: 'quote' },
    { title: 'Speakers', name: 'TabsPage', component: TabsPage, tabComponent: MotivationSpeakerListPage, index: 1, icon: 'contacts' },
    { title: 'Meetup', name: 'TabsPage', component: TabsPage, tabComponent: MeetupPage, index: 2, icon: 'calendar' },
    { title: 'About', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public quoteData: QuoteData,
    public motivationSpeakerData: MotivationSpeakerData,
    public supportData: SupportData,
    public favoriteData: FavoriteData,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public push: Push,
    public alertController: AlertController
  ) {

    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = TutorialPage;
        }
        this.platformReady()
      });

    // load the conference data
    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();

    this.pushSetup();
  }

  pushSetup(){
    const options: PushOptions = {
      android: {
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
   };
   
   const pushObject: PushObject = this.push.init(options);
   
   pushObject.on('notification').subscribe((notification: any) => {
     if(notification.additionalData.foreground){
       let youralert = this.alertController.create({
         title: "Weekly Motivation",
         message: notification.message,
         buttons: ['Dismiss']
       });
       youralert.present();
     }
   });
   
   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered '+ registration));
   
   pushObject.on('error').subscribe(error => console.log('Error with Push plugin '+ error));
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    // Set the root of the nav with params if it's a tab index
  } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
