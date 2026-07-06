import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { PlaDataService } from '../../../core/services/pla-data.service';
import { PlaUnit, PlaType, PlaCategory, PlaWeapon, PlaResource } from '../../../core/models/pla-data.models';

@Component({
  selector: 'app-pla-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pla-detail-drawer.component.html',
  styleUrls: ['./pla-detail-drawer.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.35s cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.25s cubic-bezier(0.7, 0, 0.84, 0)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.15s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PlaDetailDrawerComponent implements OnChanges {
  @Input() itemId: string | null = null;
  @Input() itemType: 'unit' | 'type' | 'category' | 'weapon' | 'resource' | null = null;
  @Output() close = new EventEmitter<void>();

  unitData = signal<PlaUnit | null>(null);
  typeData = signal<PlaType | null>(null);
  categoryData = signal<PlaCategory | null>(null);
  weaponData = signal<PlaWeapon | null>(null);
  resourceData = signal<PlaResource | null>(null);
  loading = signal(false);

  constructor(private dataService: PlaDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['itemId'] || changes['itemType']) && this.itemId && this.itemType) {
      this.loadItemDetails();
    }
  }

  private resetSignals(): void {
    this.unitData.set(null);
    this.typeData.set(null);
    this.categoryData.set(null);
    this.weaponData.set(null);
    this.resourceData.set(null);
  }

  loadItemDetails(): void {
    if (!this.itemId || !this.itemType) return;
    
    this.loading.set(true);
    this.resetSignals();

    // Small timeout to simulate intelligence decrypt loading sweep
    setTimeout(() => {
      const id = this.itemId!;
      switch (this.itemType) {
        case 'unit':
          this.dataService.getUnits().subscribe(units => {
            const found = units.find(u => u.id === id || u.id === `unit-${id.replace('etc-', '')}` || u.id === `unit-${id}`);
            this.unitData.set(found || null);
            this.loading.set(false);
          });
          break;
        case 'type':
          this.dataService.getTypes().subscribe(types => {
            const found = types.find(t => t.id === id);
            this.typeData.set(found || null);
            this.loading.set(false);
          });
          break;
        case 'category':
          this.dataService.getCategories().subscribe(cats => {
            const found = cats.find(c => c.id === id);
            this.categoryData.set(found || null);
            this.loading.set(false);
          });
          break;
        case 'weapon':
          this.dataService.getWeapons().subscribe(weps => {
            const found = weps.find(w => w.id === id);
            this.weaponData.set(found || null);
            this.loading.set(false);
          });
          break;
        case 'resource':
          this.dataService.getResources().subscribe(res => {
            const found = res.find(r => r.id === id);
            this.resourceData.set(found || null);
            this.loading.set(false);
          });
          break;
        default:
          this.loading.set(false);
      }
    }, 250);
  }

  onClose(): void {
    this.close.emit();
  }
}
