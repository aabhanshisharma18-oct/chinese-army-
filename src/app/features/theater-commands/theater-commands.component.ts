import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-theater-commands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theater-commands.component.html',
  styleUrls: ['./theater-commands.component.scss'],
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
export class TheaterCommandsComponent {
  @Output() close = new EventEmitter<void>();
  
  theaters = [
    {
      name: 'Eastern Theater Command',
      headquarters: 'Nanjing',
      area: 'East China Sea, Taiwan Strait',
      focus: 'Taiwan contingency operations',
      color: '#c41e3a'
    },
    {
      name: 'Southern Theater Command',
      headquarters: 'Guangzhou',
      area: 'South China Sea, Southeast Asia',
      focus: 'Maritime claims enforcement',
      color: '#2a4a6a'
    },
    {
      name: 'Western Theater Command',
      headquarters: 'Chengdu',
      area: 'Himalayan border, Central Asia',
      focus: 'High-altitude warfare',
      color: '#4a5a4a'
    },
    {
      name: 'Northern Theater Command',
      headquarters: 'Shenyang',
      area: 'Korean peninsula, Russian Far East',
      focus: 'Border defense',
      color: '#6a4a4a'
    },
    {
      name: 'Central Theater Command',
      headquarters: 'Beijing',
      area: 'Capital region, strategic reserve',
      focus: 'Capital defense, strategic reserve',
      color: '#4a4a6a'
    }
  ];
  
  onClose(): void {
    this.close.emit();
  }
}
