import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DetailsComponent } from '../components/details/details.component';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, DetailsComponent],
  template: `
    <h1>Деталі товару</h1>
    <app-details></app-details>
    <button mat-button routerLink="/items">⬅ Назад</button>
  `
})
export class DetailsPage {}
