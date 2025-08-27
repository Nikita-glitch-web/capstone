import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ListComponent } from '../components/list/list.component';
import { ItemsService, Product } from '../services/items';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, ListComponent],
  template: `
    <h1>List</h1>
    <app-list></app-list>
  `
})
export class ListPage {
  items: Product[] = [];

  constructor(private itemsService: ItemsService) {
    this.loadProducts();
  }

  loadProducts() {
    this.itemsService.getProducts(20, 0).subscribe({
      next: (res: any) => this.items = res.products,
      error: (err) => console.error(err)
    });
  }
}
