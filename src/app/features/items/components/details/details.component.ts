import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of, catchError, switchMap } from 'rxjs';
import { ItemsService, Product } from '../../services/items';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
})
export class DetailsComponent implements OnInit {
  product$!: Observable<Product | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (!id) return of(null);
        return this.itemsService.getProduct(+id).pipe(
          catchError((err) => {
            console.error('Помилка завантаження продукту', err);
            return of(null);
          })
        );
      })
    );
  }

  back() {
    this.router.navigate(['/items/list']);
  }
}
