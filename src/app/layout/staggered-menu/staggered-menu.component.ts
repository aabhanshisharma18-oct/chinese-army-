import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-staggered-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staggered-menu.component.html',
  styleUrls: ['./staggered-menu.component.scss'],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        query('.menu-item', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('50ms', [
            animate('0.4s ease', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ]),
      transition(':leave', [
        query('.menu-item', [
          stagger('-50ms', [
            animate('0.3s ease', style({ opacity: 0, transform: 'translateX(-20px)' }))
          ])
        ])
      ])
    ])
  ]
})
export class StaggeredMenuComponent {
  @Output() close = new EventEmitter<void>();
  
  menuItems = [
    { label: 'THEATER COMMANDS', action: 'theater-commands' },
    { label: 'FORMATIONS', action: 'formations' },
    { label: 'EQUIPMENT', action: 'equipment' },
    { label: 'SOURCES', action: 'sources' },
    { label: 'ABOUT', action: 'about' }
  ];
  
  onClose(): void {
    this.close.emit();
  }
  
  onMenuItemClick(action: string): void {
    // Handle menu item click - would emit to parent or navigate
    this.close.emit();
  }
}
