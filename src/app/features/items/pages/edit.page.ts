import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EditComponent } from '../components/edit/edit.component';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, EditComponent],
  template: `
    <mat-card>
      <h1>Edit</h1>
      <app-edit></app-edit>
      <div class="actions">
        <button mat-stroked-button color="primary" routerLink="/app/products">Back</button>
      </div>
    </mat-card>
  `,
  styles: [`
    mat-card {
      padding: 1rem;
      margin: 1rem auto;
      max-width: 600px;
    }
    .actions {
      margin-top: 1rem;
    }
  `]
})
export class EditPage {}
