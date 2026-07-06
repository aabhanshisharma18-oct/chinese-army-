import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  terminalLines = signal<string[]>([]);
  activeLogs = [
    'SYS: ESTABLISHING QUANTUM LINK WITH CMC DATA NODES...',
    'NET: ROUTING SECURE CHANNEL VIA BEIDOU-4 COORDINATES...',
    'SEC: KEY EXCHANGE COMPLETE // AES-512 TUNNEL INITIALIZED',
    'DB: RECOVERING LAND FORCE BRIGADE RECORDS...',
    'DB: VECTORING WEAPONS & RADAR INDEX SPECS...',
    'SYS: DECRYPTION 100% COMPLETE // ACCESS GRANTED.'
  ];
  
  decrypted = signal(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.runTerminalSequence();
  }

  runTerminalSequence(): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.activeLogs.length) {
        this.terminalLines.update(prev => [...prev, this.activeLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        this.decrypted.set(true);
      }
    }, 700);
  }

  enterWorkspace(): void {
    this.router.navigate(['/hierarchy']);
  }
}
