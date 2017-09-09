import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SupportData {
   constructor(private _af: AngularFireDatabase) {}

   public addSupportMessage(message:any): any{
        return this._af.list('/support/').push(message);
    }
}