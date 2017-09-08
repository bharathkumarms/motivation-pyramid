import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { QuoteData } from '../../providers/quote-data';

@IonicPage({
  segment: 'quote/:quoteId'
})
@Component({
  selector: 'page-quote-detail',
  templateUrl: 'quote-detail.html'
})
export class QuoteDetailPage {
  quote:any;

  constructor(
    public quoteData: QuoteData,
    public navParams: NavParams
  ) {}

  ionViewWillEnter() {
    this.quoteData.getQuotes().subscribe((data) => {
       this.quote = data[0];
      });
  }
}
