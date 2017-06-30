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
  noteTitle: string;

  constructor(private http: Http) {
  }

  //tell server to save the file
  onSaveClick() {
    console.log("Save clicked.");
    this.saved = true;
    if (this.noteTitle.trim() != "" && this.noteText.trim() != "") {
      let body = JSON.stringify({ title: this.noteTitle, data: this.noteText });
      console.log("Request send to save: " + body);
      this.http
        .post(this.url, body, { headers: this.headers })
        .toPromise()
        .then(res => res.json().data)
        .catch(this.handleError);
    } else {
      console.log("Pls Choose a Title and a Content")
    }

  }

  //clear textarea
  onClearClick() {
    console.log("Clear clicked.");
    this.noteText = "";
  }

  //tell server to delete the file
  onDeleteClick() {
    console.log("Deleted clicked.");
    this.noteText = "";
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
