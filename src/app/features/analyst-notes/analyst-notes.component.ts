import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AnalystNote } from '../../core/models/analyst-note.model';
import { AnalystNoteService } from '../../core/services/analyst-note.service';

@Component({
  selector: 'app-analyst-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyst-notes.component.html',
  styleUrls: ['./analyst-notes.component.scss']
})
export class AnalystNotesComponent implements OnInit {
  analystNotes$: Observable<AnalystNote[]> | null = null;
  
  constructor(private analystNoteService: AnalystNoteService) {}
  
  ngOnInit(): void {
    this.analystNotes$ = this.analystNoteService.getAnalystNotes();
  }
}
