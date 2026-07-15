import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DashboardModule {
  index: string;
  title: string;
  description: string;
  route: string;
  tone: 'red' | 'blue' | 'neutral';
  count?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly modules: DashboardModule[] = [
    { index: '01', title: 'Land Units', description: 'Unit hierarchy, formations, locations and troop potential', route: '/land', tone: 'red', count: '9 DATASETS' },
    { index: '02', title: 'Arm Types', description: 'Combat arms, mobility, roles and terrain classification', route: '/land', tone: 'red', count: '14 TYPES' },
    { index: '03', title: 'Unit Resources', description: 'Equipment, personnel, speeds, frontage and force potential', route: '/land', tone: 'neutral', count: '5 SHEETS' },
    { index: '04', title: 'Weapons & Sensors', description: 'Weapons, sensor systems, ranges and guidance data', route: '/land', tone: 'blue', count: '80+ SYSTEMS' },
    { index: '05', title: 'Ranks', description: 'Officer and enlisted personnel structure', route: '/ranks', tone: 'neutral', count: 'SHEET 10' },
    { index: '06', title: 'India vs China', description: 'Bilateral force-structure intelligence comparison', route: '/india-china', tone: 'red', count: 'SHEET 11' },
    { index: '07', title: 'Theater Capabilities', description: 'Commands, group armies, operational focus and responsibility', route: '/theater-capabilities', tone: 'blue', count: 'SHEET 12' },
    { index: '08', title: 'Unit Categories', description: 'Training, readiness, manning and deployment classifications', route: '/unit-categories', tone: 'neutral', count: 'SHEET 13' },
    { index: '09', title: 'Advanced Technology', description: 'Emerging systems, capabilities and operational status', route: '/advanced-technology', tone: 'red', count: 'SHEET 14' },
    { index: '10', title: 'Aviation Detailed', description: 'Helicopter variants, performance and armament specifications', route: '/aviation-detailed', tone: 'blue', count: 'SHEET 16' },
    { index: '11', title: 'Air Defence Detailed', description: 'SAM, radar, engagement and mobility specifications', route: '/air-defence-detailed', tone: 'blue', count: 'SHEET 17' },
    { index: '12', title: 'Raw Data Viewer', description: 'Inspect the source-aligned workbook datasets', route: '/data', tone: 'neutral', count: '16 TABLES' }
  ];
}
