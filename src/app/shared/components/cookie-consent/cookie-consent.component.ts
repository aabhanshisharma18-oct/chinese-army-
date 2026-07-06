import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent {
  visible = signal(true);
  
  acceptCookies(): void {
    this.visible.set(false);
    localStorage.setItem('cookieConsent', 'accepted');
  }
  
  ngOnInit(): void {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      this.visible.set(false);
    }
  }
}
