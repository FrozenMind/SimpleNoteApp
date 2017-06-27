import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'edit-note',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent {
  saved = false;  //used to follow if theres an unsaved change
  url: string = 'http://localhost:3000/api/writeFile';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  noteText: string;
  constructor(private http: Http) {
  }

  onSaveClick() {
    console.log("Save clicked.");
    this.saved = true;
    let body = JSON.stringify({ data: this.noteText });
    console.log(body);
    return this.http
      .post(this.url, body, { headers: this.headers })
      .toPromise()
      .then(res => res.json().data as string)
      .catch(this.handleError);
  }
  getSth() {
    return this.http.get('http://localhost:3000/api/users')
      .toPromise()
      .then(response => console.log(response.json().data))
      .catch(this.handleError);

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


  onDeleteClick() {
    console.log("Deleted clicked.");
  }
}
