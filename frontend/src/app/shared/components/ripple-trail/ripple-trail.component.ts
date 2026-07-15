import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ripple-trail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ripple-trail.component.html',
  styleUrls: ['./ripple-trail.component.scss']
})
export class RippleTrailComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  ngAfterViewInit(): void {
    this.initRippleEffect();
  }
  
  private initRippleEffect(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ripples: { x: number; y: number; radius: number; alpha: number }[] = [];
    
    const createRipple = (x: number, y: number) => {
      ripples.push({ x, y, radius: 0, alpha: 1 });
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 2;
        ripple.alpha -= 0.01;
        
        if (ripple.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196, 30, 58, ${ripple.alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Create ripples on mouse move
    let lastRippleTime = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastRippleTime > 100) {
        createRipple(e.clientX, e.clientY);
        lastRippleTime = now;
      }
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
}
