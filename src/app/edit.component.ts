import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
  url: string = 'http://localhost:3000/api/saveNote';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  note: Note;

  constructor(
    private mainService: MainService,
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.note = new Note();
    this.note.title = "";
    this.note.content = "";
  }

  //on init get Param
  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.mainService.getNote(+params.get('id')))
      .subscribe(n => this.note = n);
  }

  //tell server to save the file
  onSaveClick() {
    console.log("Save clicked.");
    this.saved = true;
    if (this.note.title.trim() != "" && this.note.content.trim() != "") {
      let body = JSON.stringify({ id: this.note.id || -1, title: this.note.title, content: this.note.content });
      console.log("Request send to save: " + body);
      this.http
        .post(this.url, body, { headers: this.headers })
        .toPromise()
        .then(res => res.json().successfull ? this.toastr.success('Note saved') : this.toastr.error('Something went wrong by saving your note', 'Ups! Sorry'))
        .catch(this.handleError);
    } else {
      this.toastr.warning('Pls Choose a Title and a Content for your note') //toast
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
    let delUrl = 'http://localhost:3000/api/deleteNote/' + this.note.id;
    this.http.delete(delUrl, { headers: this.headers })
      .toPromise()
      .then(res => res.json().successfull ? this.toastr.success('Note deleted') : this.toastr.error('Note could not be deleted.', 'Ups! Sorry'))
      .catch(this.handleError);
    this.note.content = "";
    this.note.title = "";
  }

  onDashboardClick() {
    this.router.navigate(['/overview'])
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    this.toastr.error('Something went wrong', 'Sorry')
    return Promise.reject(error.message || error);
  }
}
