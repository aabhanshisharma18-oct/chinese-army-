import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-platform-access',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platform-access.component.html',
  styleUrls: ['./platform-access.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class PlatformAccessComponent {
  @Output() close = new EventEmitter<void>();
  
  accessLevels = [
    {
      name: 'Theater Overview',
      price: 'Basic',
      description: 'Essential theater command structure and major formation listings',
      features: [
        '5 Theater Command Profiles',
        'Basic Formation Data',
        'Area of Responsibility Maps',
        'Command Structure Overview'
      ]
    },
    {
      name: 'Formation Detail',
      price: 'Professional',
      description: 'Detailed formation profiles with equipment and readiness data',
      features: [
        'Complete Formation Profiles',
        'Equipment Inventories',
        'Readiness Indicators',
        'Subordinate Unit Data',
        'Analyst Notes Access'
      ]
    },
    {
      name: 'Full Intelligence Layer',
      price: 'Enterprise',
      description: 'Comprehensive intelligence with deployment tracking and source references',
      features: [
        'All Professional Features',
        'Deployment Tracking',
        'Modernization Indicators',
        'Source References',
        'API Access',
        'Custom Reports'
      ]
    }
  ];
  
  onClose(): void {
    this.close.emit();
  }
}
