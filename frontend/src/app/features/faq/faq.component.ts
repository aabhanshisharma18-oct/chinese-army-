import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqs = [
    {
      question: 'What is the scope of PLA Command Atlas data?',
      answer: 'PLA Command Atlas provides comprehensive data on Chinese Army theater commands, formations, equipment inventories, and strategic analysis. Coverage includes all five theater commands with detailed formation profiles and equipment specifications.'
    },
    {
      question: 'How frequently is the data updated?',
      answer: 'Data is updated quarterly with major equipment changes and formation reorganizations. Analyst notes and strategic assessments are updated monthly based on latest open-source intelligence and official publications.'
    },
    {
      question: 'What sources are used for the data?',
      answer: 'Data is compiled from official PLA publications, defense ministry reports, international defense analysis organizations (IISS, RAND, SIPRI), satellite imagery analysis, and verified open-source intelligence.'
    },
    {
      question: 'Can I access specific formation details?',
      answer: 'Yes, detailed formation profiles are available for all major units including group armies, combined arms brigades, and specialized units across all theater commands.'
    },
    {
      question: 'Is equipment data included?',
      answer: 'Comprehensive equipment data includes main battle tanks, armored vehicles, artillery systems, air defense assets, aircraft, and naval assets organized by formation and theater command.'
    }
  ];
  
  expandedIndex: number | null = null;
  
  toggleFaq(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
