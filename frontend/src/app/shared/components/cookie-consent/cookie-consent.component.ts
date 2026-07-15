import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  visible = true;

  ngOnInit(): void {
    const consent = localStorage.getItem('cookieConsent');

    if (consent === 'accepted') {
      this.visible = false;
    }
  }

  acceptCookies(): void {
    this.visible = false;
    localStorage.setItem('cookieConsent', 'accepted');
  }
}
