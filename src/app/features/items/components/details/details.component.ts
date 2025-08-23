import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ItemsService, Product } from '../../services/items';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule]
})
export class DetailsComponent implements OnInit {
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.itemsService.getProduct(+id).subscribe((p) => (this.product = p));
    }
  }

  back() {
    this.router.navigate(['/app/products']);
  }
}
