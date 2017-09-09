import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class QuoteData {
   constructor(private _af: AngularFireDatabase) {}

   public getQuotes(): FirebaseListObservable<any[]>{
       var quotes = this._af.list('quote', {
        query: {
            orderByChild: 'title'
        }
      });
      return quotes;
   }

   public getQuote(id:any): FirebaseListObservable<any[]>{
    var quote = this._af.list('quote', {
        query: {
        orderByChild: 'id',
        equalTo: id
        }
    });
    return quote;
    }
}