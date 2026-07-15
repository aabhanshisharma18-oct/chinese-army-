import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

import { PlaDataService } from '../../../core/services/pla-data.service';
import {
  PlaUnit,
  PlaType,
  PlaCategory,
  PlaWeapon,
  PlaResource
} from '../../../core/models/pla-data.models';

@Component({
  selector: 'app-pla-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pla-detail-drawer.component.html',
  styleUrls: ['./pla-detail-drawer.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate(
          '0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          style({
            transform: 'translateX(0)',
            opacity: 1
          })
        )
      ]),
      transition(':leave', [
        animate(
          '0.25s cubic-bezier(0.7, 0, 0.84, 0)',
          style({
            transform: 'translateX(100%)',
            opacity: 0
          })
        )
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '0.2s ease-out',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate(
          '0.15s ease-in',
          style({ opacity: 0 })
        )
      ])
    ])
  ]
})
export class PlaDetailDrawerComponent implements OnChanges {
  @Input() itemId: string | null = null;

  @Input()
  itemType:
    | 'unit'
    | 'type'
    | 'category'
    | 'weapon'
    | 'resource'
    | null = null;

  @Output() close = new EventEmitter<void>();

  unitData: PlaUnit | null = null;
  typeData: PlaType | null = null;
  categoryData: PlaCategory | null = null;
  weaponData: PlaWeapon | null = null;
  resourceData: PlaResource | null = null;

  loading = false;

  constructor(
    private readonly dataService: PlaDataService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const itemChanged =
      changes['itemId'] || changes['itemType'];

    if (
      itemChanged &&
      this.itemId &&
      this.itemType
    ) {
      this.loadItemDetails();
    }
  }

  loadItemDetails(): void {
    if (!this.itemId || !this.itemType) {
      return;
    }

    this.loading = true;
    this.resetData();

    setTimeout(() => {
      const id = this.itemId as string;

      switch (this.itemType) {
        case 'unit':
          this.dataService
            .getUnits()
            .subscribe(units => {
              const found = units.find(unit =>
                unit.id === id ||
                unit.id ===
                  `unit-${id.replace('etc-', '')}` ||
                unit.id === `unit-${id}`
              );

              this.unitData = found || null;
              this.loading = false;
            });
          break;

        case 'type':
          this.dataService
            .getTypes()
            .subscribe(types => {
              const found = types.find(
                type => type.id === id
              );

              this.typeData = found || null;
              this.loading = false;
            });
          break;

        case 'category':
          this.dataService
            .getCategories()
            .subscribe(categories => {
              const found = categories.find(
                category => category.id === id
              );

              this.categoryData = found || null;
              this.loading = false;
            });
          break;

        case 'weapon':
          this.dataService
            .getWeapons()
            .subscribe(weapons => {
              const found = weapons.find(
                weapon => weapon.id === id
              );

              this.weaponData = found || null;
              this.loading = false;
            });
          break;

        case 'resource':
          this.dataService
            .getResources()
            .subscribe(resources => {
              const found = resources.find(
                resource => resource.id === id
              );

              this.resourceData = found || null;
              this.loading = false;
            });
          break;

        default:
          this.loading = false;
      }
    }, 250);
  }

  onClose(): void {
    this.close.emit();
  }

  private resetData(): void {
    this.unitData = null;
    this.typeData = null;
    this.categoryData = null;
    this.weaponData = null;
    this.resourceData = null;
  }
}
