import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sources-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sources-overlay.component.html',
  styleUrls: ['./sources-overlay.component.scss'],
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
export class SourcesOverlayComponent {
  @Output() close = new EventEmitter<void>();
  
  sources = [
    {
      name: 'Department of Defense Annual Report on Military and Security Developments Involving the People\'s Republic of China',
      type: 'Official Government Report',
      description: 'Annual comprehensive assessment of PLA modernization, capabilities, and strategy.'
    },
    {
      name: 'IISS Military Balance',
      type: 'Defense Analysis Publication',
      description: 'Authoritative assessment of military capabilities and defense economics.'
    },
    {
      name: 'SIPRI Arms Transfers Database',
      type: 'Research Institute Database',
      description: 'Comprehensive data on international arms transfers and military equipment.'
    },
    {
      name: 'RAND Corporation Research Reports',
      type: 'Think Tank Analysis',
      description: 'In-depth analysis of PLA capabilities, doctrine, and modernization trends.'
    },
    {
      name: 'Jane\'s Defence Weekly',
      type: 'Defense Intelligence',
      description: 'Expert analysis of military equipment, organizations, and operations.'
    },
    {
      name: 'CSIS Asia Maritime Transparency Initiative',
      type: 'Maritime Security Research',
      description: 'Analysis of maritime developments and naval capabilities in the Asia-Pacific region.'
    }
  ];
  
  onClose(): void {
    this.close.emit();
  }
}
