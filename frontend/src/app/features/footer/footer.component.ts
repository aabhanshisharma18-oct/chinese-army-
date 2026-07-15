import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  videoSrc = 'assets/videos/closing-bg.mp4';
  
  currentYear = new Date().getFullYear();
  
  footerLinks = [
    { label: 'Theater Commands', href: '#theater-commands' },
    { label: 'Formations', href: '#formations' },
    { label: 'Equipment', href: '#equipment' },
    { label: 'Sources', href: '#sources' },
    { label: 'About', href: '#about' }
  ];
  
  legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Use', href: '#terms' },
    { label: 'Data Disclaimer', href: '#disclaimer' }
  ];
}
