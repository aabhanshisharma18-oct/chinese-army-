import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService } from '../../services/excel-data.service';

interface LandUnit {
  side: string;
  formationUnitName: string;
  formationUnitType: string;
  formationUnitParentName: string;
  standardUnitFormation: string;
  unitPotential: string;
  locationName: string;
  latitude: string;
  longitude: string;
}

interface HierarchyNode {
  id: string;
  label: string;
  type: string;
  parentId?: string;
  details?: {
    headquarters?: string;
    commander?: string;
    role?: string;
    status?: string;
    unitType?: string;
    unitPotential?: string;
    location?: string;
    coordinates?: string;
  };
  children?: HierarchyNode[];
}

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
  hierarchyRoot = signal<HierarchyNode | null>(null);
  expandedNodes = signal<Set<string>>(new Set(['CHINA', 'PLA']));
  selectedNode = signal<HierarchyNode | null>(null);
  
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadHierarchyData();
  }

  loadHierarchyData(): void {
    this.excelDataService.getSheet('assets/data/raw/1_Land_Units.json').subscribe({
      next: (data: unknown) => {
        const hierarchy = this.buildHierarchyFromExcel(data);
        this.hierarchyRoot.set(hierarchy);
        this.selectedNode.set(hierarchy);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load hierarchy data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private buildHierarchyFromExcel(data: unknown): HierarchyNode {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) {
      return this.createFallbackHierarchy();
    }

    const units = this.parseLandUnits(rows);
    return this.buildTreeFromUnits(units);
  }

  private parseLandUnits(rows: unknown[][]): LandUnit[] {
    const units: LandUnit[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const unit: LandUnit = {
        side: this.getCellValue(row, 0) || '',
        formationUnitName: this.getCellValue(row, 1) || '',
        formationUnitType: this.getCellValue(row, 2) || '',
        formationUnitParentName: this.getCellValue(row, 3) || '',
        standardUnitFormation: this.getCellValue(row, 4) || '',
        unitPotential: this.getCellValue(row, 5) || '',
        locationName: this.getCellValue(row, 6) || '',
        latitude: this.getCellValue(row, 7) || '',
        longitude: this.getCellValue(row, 8) || ''
      };

      if (unit.formationUnitName) {
        units.push(unit);
      }
    }
    return units;
  }

  private buildTreeFromUnits(units: LandUnit[]): HierarchyNode {
    const nodeMap = new Map<string, HierarchyNode>();
    const rootId = 'CHINA';
    
    // Create root node
    const rootNode: HierarchyNode = {
      id: rootId,
      label: 'China',
      type: 'country',
      details: {
        headquarters: 'Beijing',
        role: 'National Command Authority',
        status: 'ACTIVE'
      },
      children: []
    };
    nodeMap.set(rootId, rootNode);

    // Create PLA node
    const plaNode: HierarchyNode = {
      id: 'PLA',
      label: 'People\'s Liberation Army',
      type: 'armed-forces',
      parentId: rootId,
      details: {
        headquarters: 'Beijing',
        role: 'All Armed Forces',
        status: 'ACTIVE'
      },
      children: []
    };
    nodeMap.set('PLA', plaNode);
    rootNode.children?.push(plaNode);

    // Create PLAGF node
    const plagfNode: HierarchyNode = {
      id: 'PLAGF',
      label: 'PLA Ground Force',
      type: 'branch',
      parentId: 'PLA',
      details: {
        headquarters: 'Beijing',
        role: 'Ground Forces',
        unitPotential: '960,000 active',
        status: 'ACTIVE'
      },
      children: []
    };
    nodeMap.set('PLAGF', plagfNode);
    plaNode.children?.push(plagfNode);

    // Process units
    units.forEach(unit => {
      const nodeId = this.generateNodeId(unit);
      const parentNodeId = this.findParentNodeId(unit, nodeMap);
      
      const node: HierarchyNode = {
        id: nodeId,
        label: unit.formationUnitName,
        type: this.mapTypeToHierarchyType(unit.formationUnitType),
        parentId: parentNodeId,
        details: {
          headquarters: unit.locationName,
          unitType: unit.formationUnitType,
          unitPotential: unit.unitPotential,
          location: unit.locationName,
          coordinates: `${unit.latitude}, ${unit.longitude}`,
          role: unit.standardUnitFormation,
          status: 'ACTIVE'
        },
        children: []
      };

      nodeMap.set(nodeId, node);

      // Add to parent's children
      const parentNode = nodeMap.get(parentNodeId);
      if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(node);
      }
    });

    return rootNode;
  }

  private generateNodeId(unit: LandUnit): string {
    return unit.formationUnitName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private findParentNodeId(unit: LandUnit, nodeMap: Map<string, HierarchyNode>): string {
    if (!unit.formationUnitParentName) return 'PLAGF';
    
    // Try to find existing parent by name
    for (const [id, node] of nodeMap.entries()) {
      if (node.label === unit.formationUnitParentName) {
        return id;
      }
    }
    
    // Default to PLAGF if parent not found
    return 'PLAGF';
  }

  private mapTypeToHierarchyType(unitType: string): string {
    const typeMap: Record<string, string> = {
      'Theater Command': 'theater',
      'Group Army': 'group-army',
      'Combined Arms Brigade': 'brigade',
      'Heavy Combined Arms Brigade': 'brigade',
      'Medium Combined Arms Brigade': 'brigade',
      'Light Combined Arms Brigade': 'brigade',
      'Amphibious Combined Arms Brigade': 'brigade',
      'Mountain Combined Arms Brigade': 'brigade',
      'Air Assault Brigade': 'brigade',
      'Special Operations Brigade': 'brigade',
      'Artillery Brigade': 'brigade',
      'Air Defence Brigade': 'brigade',
      'Army Aviation Brigade': 'brigade',
      'Military District': 'district',
      'Training Base': 'base'
    };
    
    return typeMap[unitType] || 'unit';
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  private createFallbackHierarchy(): HierarchyNode {
    return {
      id: 'CHINA',
      label: 'China',
      type: 'country',
      details: {
        headquarters: 'Beijing',
        role: 'National Command Authority',
        status: 'ACTIVE'
      },
      children: [
        {
          id: 'PLA',
          label: 'People\'s Liberation Army',
          type: 'armed-forces',
          parentId: 'CHINA',
          details: {
            headquarters: 'Beijing',
            role: 'All Armed Forces',
            status: 'ACTIVE'
          },
          children: []
        }
      ]
    };
  }

  toggleNode(nodeId: string, event: MouseEvent): void {
    event.stopPropagation();
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
    return node.type === 'group-army' || node.type === 'brigade';
  }

  retry(): void {
    this.loadHierarchyData();
  }
}
