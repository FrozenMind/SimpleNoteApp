import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

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
    private router: Router) { }

  ngOnInit(): void {
    console.log("Overview ngOnInit")
    this.mainService.getNotes()
      .then(notes => this.notes = notes);
  }

  gotoEdit(note): void {
    this.router.navigate(['/edit', note.id])
  }

  newNote(): void {
    this.router.navigate(['/edit', 0])
  }
}
