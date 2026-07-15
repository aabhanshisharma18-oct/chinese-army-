import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-formation-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation-overlay.component.html',
  styleUrls: ['./formation-overlay.component.scss'],
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FormationOverlayComponent {
  @Output() close = new EventEmitter<void>();
  
  onClose(): void {
    this.close.emit();
  }
}
