import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class MotivationSpeakerData {
   constructor(private _af: AngularFireDatabase) {}

   public getSpeakers(): FirebaseListObservable<any[]>{
       var speakers = this._af.list('speaker', {
        query: {
            orderByChild: 'createdDate'
        }
      });
      return speakers;
   }
}