import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class FavoriteData {
   constructor(private af: AngularFireDatabase) {}

   getFavorite(username: string): Observable<any> {
    return this.af.list('/favorite', {query: {}})
      .map(favorites => favorites.filter((favorite:any) => favorite.username == username));
  }
}