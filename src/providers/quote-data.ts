import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class QuoteData {
   constructor(private _af: AngularFireDatabase) {}

   public getQuotes(): FirebaseListObservable<any[]>{
      return this._af.list('/quote');
   }
}