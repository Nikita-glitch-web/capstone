import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItemsService, Product, ProductListResponse } from '../../services/items';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import { EditComponent } from '../edit/edit.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm/confirm-dialog.component';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['thumbnail', 'title', 'category', 'price', 'rating', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  total = 0;
  pageSize = 10;
  pageIndex = 0;

  searchTerm: string = '';
  searchControl = new FormControl<string>('');

  categories: string[] = [];
  selectedCategory: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private itemsService: ItemsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.itemsService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        if (this.selectedCategory && !cats.includes(this.selectedCategory)) {
          this.selectedCategory = null;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load categories failed:', err);
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.searchTerm = value ?? '';
        this.pageIndex = 0;
        this.loadData();
      });

    this.loadData();
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  loadData() {
    if (this.selectedCategory) {
      this.itemsService.getProductsByCategory(
        this.selectedCategory,
        this.pageSize,
        this.pageIndex * this.pageSize
      ).subscribe({
        next: (res: ProductListResponse) => {
          if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            const filtered = res.products.filter(p =>
              (p.title && p.title.toLowerCase().includes(searchLower)) ||
              (p.category && p.category.toLowerCase().includes(searchLower)) ||
              (p.description && p.description.toLowerCase().includes(searchLower))
            );
            this.dataSource.data = filtered;
            this.total = filtered.length;
          } else {
            this.dataSource.data = res.products;
            this.total = res.total;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Load products by category failed:', err);
        }
      });
      return;
    }

    this.itemsService.getProducts(
      this.pageSize,
      this.pageIndex * this.pageSize,
      this.searchTerm || undefined
    ).subscribe({
      next: (res: ProductListResponse) => {
        this.dataSource.data = res.products;
        this.total = res.total;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load products failed:', err);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.pageIndex = 0;
    this.loadData();
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemsService.deleteProduct(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
            this.total = Math.max(0, this.total - 1);
            this.snackBar.open('Product deleted', 'Close', { duration: 2000 });
            this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;

      if (typeof result === 'object' && result.id !== undefined) {
        const saved: Product = result as Product;

        const matchesCategory = !this.selectedCategory || this.selectedCategory === saved.category;
        const searchLower = (this.searchTerm || '').toLowerCase();
        const matchesSearch =
          !searchLower ||
          (saved.title && saved.title.toLowerCase().includes(searchLower)) ||
          (saved.category && saved.category.toLowerCase().includes(searchLower));

        if (matchesCategory && matchesSearch) {
          const idx = this.dataSource.data.findIndex(p => p.id === saved.id);
          if (idx > -1) {
            const copy = [...this.dataSource.data];
            copy[idx] = saved;
            this.dataSource.data = copy;
          } else {
            this.dataSource.data = [saved, ...this.dataSource.data];
            this.total++;
          }
        } else {
          this.total++;
        }

        this.cdr.detectChanges();
        this.snackBar.open('Product saved', 'Close', { duration: 2000 });
      } else if (result === true) {
        this.loadData();
        this.snackBar.open('Product added', 'Close', { duration: 2000 });
      }
    });
  }
}
