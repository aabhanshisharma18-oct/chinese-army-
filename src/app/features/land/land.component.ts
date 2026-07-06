import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaDataService } from '../../core/services/pla-data.service';
import { PlaUnit, PlaType, PlaCategory, PlaWeapon, PlaResource } from '../../core/models/pla-data.models';
import { PlaDetailDrawerComponent } from '../../shared/components/pla-detail-drawer/pla-detail-drawer.component';

type SubcategoryType = 'unit' | 'type' | 'category' | 'weapon' | 'resource';

@Component({
  selector: 'app-land',
  standalone: true,
  imports: [CommonModule, FormsModule, PlaDetailDrawerComponent],
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss']
})
export class LandComponent implements OnInit {
  // Tab mapping
  activeTab = signal<SubcategoryType>('unit');
  tabs: { label: string; value: SubcategoryType }[] = [
    { label: 'Land Units', value: 'unit' },
    { label: 'Type', value: 'type' },
    { label: 'Category', value: 'category' },
    { label: 'Weapon / Sensor', value: 'weapon' },
    { label: 'Land Unit Resources', value: 'resource' }
  ];

  // Raw datasets
  unitsList = signal<PlaUnit[]>([]);
  typesList = signal<PlaType[]>([]);
  categoriesList = signal<PlaCategory[]>([]);
  weaponsList = signal<PlaWeapon[]>([]);
  resourcesList = signal<PlaResource[]>([]);

  // Filter criteria
  searchQuery = signal<string>('');
  theaterFilter = signal<string>('ALL');
  mobilityFilter = signal<string>('ALL');
  weaponCategoryFilter = signal<string>('ALL');
  resourceTypeFilter = signal<string>('ALL');

  // Detail drawer triggers
  drawerItemId = signal<string | null>(null);
  drawerItemType = signal<SubcategoryType | null>(null);

  // Computed filtered list
  filteredItems = computed<any[]>(() => {
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();

    switch (tab) {
      case 'unit': {
        let list = this.unitsList();
        
        // Filter by Theater Command
        const theater = this.theaterFilter();
        if (theater !== 'ALL') {
          list = list.filter(u => u.theaterCommand === theater);
        }
        
        // Filter by Search Query
        if (query) {
          list = list.filter(u => 
            u.name.toLowerCase().includes(query) ||
            u.headquarters.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query) ||
            u.commander.toLowerCase().includes(query) ||
            u.notes.toLowerCase().includes(query)
          );
        }
        return list;
      }
      
      case 'type': {
        let list = this.typesList();
        
        // Filter by Mobility
        const mobility = this.mobilityFilter();
        if (mobility !== 'ALL') {
          list = list.filter(t => t.mobility === mobility);
        }
        
        // Filter by Search Query
        if (query) {
          list = list.filter(t => 
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.tacticalMobility.toLowerCase().includes(query)
          );
        }
        return list;
      }
      
      case 'category': {
        let list = this.categoriesList();
        
        // Filter by Search Query
        if (query) {
          list = list.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.echelon.toLowerCase().includes(query)
          );
        }
        return list;
      }
      
      case 'weapon': {
        let list = this.weaponsList();
        
        // Filter by Weapon Functional Category
        const wepCat = this.weaponCategoryFilter();
        if (wepCat !== 'ALL') {
          list = list.filter(w => w.functionalCategory === wepCat);
        }
        
        // Filter by Search Query
        if (query) {
          list = list.filter(w => 
            w.name.toLowerCase().includes(query) ||
            w.description.toLowerCase().includes(query) ||
            w.armament.toLowerCase().includes(query) ||
            w.type.toLowerCase().includes(query)
          );
        }
        return list;
      }
      
      case 'resource': {
        let list = this.resourcesList();
        
        // Filter by Resource Type
        const resType = this.resourceTypeFilter();
        if (resType !== 'ALL') {
          list = list.filter(r => r.resourceType === resType);
        }
        
        // Filter by Search Query
        if (query) {
          list = list.filter(r => 
            r.name.toLowerCase().includes(query) ||
            r.description.toLowerCase().includes(query) ||
            r.location.toLowerCase().includes(query) ||
            r.strategicFunction.toLowerCase().includes(query)
          );
        }
        return list;
      }
    }
  });

  constructor(private dataService: PlaDataService) {}

  ngOnInit(): void {
    this.dataService.getUnits().subscribe(data => this.unitsList.set(data));
    this.dataService.getTypes().subscribe(data => this.typesList.set(data));
    this.dataService.getCategories().subscribe(data => this.categoriesList.set(data));
    this.dataService.getWeapons().subscribe(data => this.weaponsList.set(data));
    this.dataService.getResources().subscribe(data => this.resourcesList.set(data));
  }

  setTab(tab: SubcategoryType): void {
    this.activeTab.set(tab);
    this.resetFilters();
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.theaterFilter.set('ALL');
    this.mobilityFilter.set('ALL');
    this.weaponCategoryFilter.set('ALL');
    this.resourceTypeFilter.set('ALL');
  }

  openDossier(itemId: string): void {
    this.drawerItemId.set(itemId);
    this.drawerItemType.set(this.activeTab());
  }

  closeDossier(): void {
    this.drawerItemId.set(null);
    this.drawerItemType.set(null);
  }
}
