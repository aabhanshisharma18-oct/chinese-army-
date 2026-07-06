import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaDataService } from '../../core/services/pla-data.service';
import { HierarchyNode } from '../../core/models/pla-data.models';
import { PlaDetailDrawerComponent } from '../../shared/components/pla-detail-drawer/pla-detail-drawer.component';

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [CommonModule, PlaDetailDrawerComponent],
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
  hierarchyRoot = signal<HierarchyNode | null>(null);
  expandedNodes = signal<Set<string>>(new Set(['cmc', 'plagf-hq']));
  selectedNode = signal<HierarchyNode | null>(null);

  // Detail drawer triggers
  drawerItemId = signal<string | null>(null);
  drawerItemType = signal<'unit' | 'type' | 'category' | 'weapon' | 'resource' | null>(null);

  constructor(private dataService: PlaDataService) {}

  ngOnInit(): void {
    this.dataService.getHierarchy().subscribe(node => {
      this.hierarchyRoot.set(node);
      // Select the root node by default
      this.selectedNode.set(node);
    });
  }

  toggleNode(nodeId: string, event: MouseEvent): void {
    event.stopPropagation(); // Avoid triggering selectNode when clicking expand/collapse
    this.expandedNodes.update(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }

  isExpanded(nodeId: string): boolean {
    return this.expandedNodes().has(nodeId);
  }

  selectNode(node: HierarchyNode): void {
    this.selectedNode.set(node);
  }

  hasChildren(node: HierarchyNode): boolean {
    return !!node.children && node.children.length > 0;
  }

  canInspectDetails(node: HierarchyNode): boolean {
    // Only Group Armies and Brigades have full dossier profiles in our system
    return node.type === 'group-army' || node.type === 'brigade';
  }

  inspectDossier(node: HierarchyNode): void {
    if (!this.canInspectDetails(node)) return;

    let itemId = node.id;
    // Map node id format to unit id format if needed
    if (node.type === 'group-army') {
      // e.g., 'etc-71' -> 'unit-71'
      const numPart = node.id.split('-')[1];
      itemId = `unit-${numPart}`;
    } else if (node.type === 'brigade') {
      // Brigades can fall back to showing the parent Group Army or have a general layout
      // In this case, we'll open the parent unit's dossier to show the subordinate units
      if (node.parentId) {
        const numPart = node.parentId.split('-')[1];
        itemId = `unit-${numPart}`;
      }
    }

    this.drawerItemId.set(itemId);
    this.drawerItemType.set('unit');
  }

  closeDrawer(): void {
    this.drawerItemId.set(null);
    this.drawerItemType.set(null);
  }
}
