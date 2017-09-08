import { Component/*, ViewChild*/ } from '@angular/core';

import { IonicPage, AlertController, App, ItemSliding, FabContainer, /*List,*/ ModalController, NavController, NavParams, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { QuoteData } from '../../providers/quote-data';
import { FavoriteData } from '../../providers/favorite-data';
import { UserData } from '../../providers/user-data';

import { SocialSharing } from '@ionic-native/social-sharing'; 

//import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage {

  quotes:any[];
  favorite:any;
  segment = 'all';
  loader:any;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public quoteData: QuoteData,
    public favoriteData:FavoriteData,
    public user: UserData,
    public socialSharing: SocialSharing
  ) {
    this.updateQuote(); 
    this.getFavorites();
  }
  /*ionViewDidLoad() {
    this.app.setTitle('Quote');
    this.updateQuote();
  }*/
  getFavorites() {
    this.user.getUsername().then((username) => {
      this.favoriteData.getFavorite(username).subscribe((data) => {
       this.favorite = data;
      });
    });
  }
   updateQuote() {
    this.loader = this.loadingCtrl.create({
      content: 'Getting latest entries...'});

    this.loader.present().then(() => {
      this.quoteData.getQuotes().subscribe((data) => {
       this.quotes = data;
       
        if(this.segment == 'favorites'){
         this.favorite.forEach(function(value:any){
            //TODO: Loop favorites and retain quotes
            console.log(value);
         })
        }

      });
      this.loader.dismiss();
    });
   }

  //Start: Add/Remove Favorites


  addFavorite(slidingItem: ItemSliding, quoteData: any) {

    if (this.user.hasFavorite(quoteData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, quoteData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(quoteData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, quoteData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(quoteData.name);
            this.updateQuote();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
  //End: Add/Remove Favorites

  //Start: Refresh

  doRefresh(refresher: Refresher) {
    
    this.quoteData.getQuotes().subscribe((data: any) => {
      this.quotes = data;
      refresher.complete();
      const toast = this.toastCtrl.create({
          message: 'Quotes have been updated.',
          duration: 3000
        });
        toast.present();
    });
  }


  openSocial(network: string, fab: FabContainer) {
    if(network=="Twitter"){
      this.socialSharing.shareViaTwitter("Download Motivation Pyramid to View Add Share motivational speakers, videos and quotes.", undefined, undefined);
    }else if(network=="Facebook"){
      this.socialSharing.shareViaFacebook("Download Motivation Pyramid to View Add Share motivational speakers, videos and quotes.", undefined, undefined);
    }

    fab.close();
    /*let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();*/
  }

  goToQuoteDetail(quoteData: any) {
    // go to the session detail page
    // and pass in the session data
    console.log(quoteData)
    //this.navCtrl.push(SessionDetailPage, { sessionId: sessionData.id, name: sessionData.name });
  }

  //End: Refresh
}
