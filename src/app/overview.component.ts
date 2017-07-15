import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router }            from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Note } from './notes';
import { MainService } from './main.service';

@Component({
  selector: 'overview-notes',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  title: string = "Overview of your notes";
  notes: Note[];

  constructor(
    private mainService: MainService,
    private router: Router,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.toastr.info('This is your dashboard', 'Welcome back!');
  }

  ngOnInit(): void {
    console.log("Overview ngOnInit")
    this.mainService.getNotes()
      .then(notes => this.notes = notes);
  }

  gotoEdit(note): void {
    this.router.navigate(['/edit', note.id])
  }

  newNote(): void {
    this.router.navigate(['/edit', -1])
  }
}
