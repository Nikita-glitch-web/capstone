import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ItemsService, Product } from '../../services/items';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSliderModule,
    RouterModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  isEdit = false;

  categories: string[] = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'home-decoration',
    'furniture',
    'tops',
    'women-dresses',
  ];

  ratingControl = new FormControl(0, [
    Validators.required,
    Validators.min(0),
    Validators.max(5),
  ]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    @Optional() private dialogRef?: MatDialogRef<EditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data?: any
  ) {}

  ngOnInit(): void {
    this.id = this.data?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
    });

    this.form.addControl('rating', this.ratingControl);

    if (this.isEdit && this.id !== undefined) {
      this.itemsService.getProduct(this.id).subscribe({
        next: (product) => {
          this.form.patchValue(product);
          this.ratingControl.setValue(product.rating ?? 0);
        },
        error: (err) => console.error('Load product failed:', err),
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const productData: Partial<Product> = this.form.value;

    let request$: Observable<Product>;
    if (this.isEdit) {
      request$ = this.itemsService.updateProduct(this.id!, productData);
    } else {
      request$ = this.itemsService.createProduct(productData);
    }

    request$.subscribe({
      next: (saved: Product) => {
        console.log('Saved product:', saved);
        if (this.dialogRef) {
          this.dialogRef.close(saved);
        } else {
          this.router.navigate(['/app/products']);
        }
      },
      error: (err) => {
        console.error('Save failed:', err);
      },
    });
  }

  cancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(['/app/products']);
    }
  }
}
