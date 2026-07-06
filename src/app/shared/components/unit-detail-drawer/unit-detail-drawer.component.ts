import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Formation } from '../../../core/models/formation.model';

@Component({
  selector: 'app-unit-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unit-detail-drawer.component.html',
  styleUrls: ['./unit-detail-drawer.component.scss'],
  animations: [
    trigger('drawerAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.4s ease', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class UnitDetailDrawerComponent {
  @Input() formation: Formation | null = null;
  @Output() close = new EventEmitter<void>();
  
  onClose(): void {
    this.close.emit();
  }
}
