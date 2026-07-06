import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intelligence-query-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intelligence-query-form.component.html',
  styleUrls: ['./intelligence-query-form.component.scss']
})
export class IntelligenceQueryFormComponent {
  formData = {
    name: '',
    organization: '',
    subject: '',
    unit: '',
    theaterCommand: '',
    query: ''
  };
  
  onSubmit(): void {
    console.log('Form submitted:', this.formData);
    // Handle form submission
  }
}
