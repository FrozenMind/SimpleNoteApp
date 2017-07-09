import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';

import { MainService } from './main.service';
import { Note } from './notes';

@Component({
  selector: 'edit-note',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  saved = false;  //used to follow if theres an unsaved change
  url: string = 'http://localhost:3000/api/writeFile';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  note: Note;

  constructor(
    private mainService: MainService,
    private http: Http,
    private router: Router,
    private route: ActivatedRoute
  ) { this.note = new Note() }

  //on init get Param
  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.mainService.getNote(+params.get('id')))
      .subscribe(n => this.note = n[0]);
  }

  //tell server to save the file
  onSaveClick() {
    console.log("Save clicked.");
    this.saved = true;
    if (this.note.title.trim() != "" && this.note.content.trim() != "") {
      let body = JSON.stringify({ id: this.note.id, title: this.note.title, data: this.note.content });
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
    this.note.content = "";
  }

  //tell server to delete the file
  onDeleteClick() {
    console.log("Deleted clicked.");
    this.note.content = "";
  }

  onDashboardClick() {
    this.router.navigate(['/overview'])
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
