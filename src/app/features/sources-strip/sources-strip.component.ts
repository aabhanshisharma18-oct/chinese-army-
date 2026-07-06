import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sources-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sources-strip.component.html',
  styleUrls: ['./sources-strip.component.scss']
})
export class SourcesStripComponent {
  sources = [
    { name: 'Department of Defense', type: 'Official Reports' },
    { name: 'IISS Military Balance', type: 'Defense Analysis' },
    { name: 'SIPRI Database', type: 'Research Institute' },
    { name: 'RAND Corporation', type: 'Think Tank' },
    { name: 'Jane\'s Defence', type: 'Defense Intelligence' },
    { name: 'CSIS AMTI', type: 'Maritime Security' },
    { name: 'PLA Official Publications', type: 'Primary Sources' },
    { name: 'Institute for Defense Studies', type: 'Research' }
  ];
}
