import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Note } from './notes';

@Injectable()
export class MainService {
  url: string = 'http://localhost:3000/api/getNotes';
  /* you can place service methods here
  like getNotes() */

  constructor(private http: Http) { }

  getNotes(): Promise<Note[]> {
    return this.http
      .get(this.url)
      .toPromise()
      .then(res => res.json() as Note[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
