import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  description?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private readonly baseUrl = 'https://dummyjson.com/products';

  private getAuthHeadersOrError(): HttpHeaders | Observable<never> {
    const token = this.auth.getToken();
    if (!token) {
      return null as any;
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProducts(limit: number = 10, skip: number = 0, q?: string): Observable<ProductListResponse> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));

    let params = new HttpParams()
      .set('limit', String(limit))
      .set('skip', String(skip));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    if (q) {
      params = params.set('q', q);
      return this.http
        .get<ProductListResponse>(`${this.baseUrl}/search`, { params, headers })
        .pipe(catchError(err => throwError(() => err)));
    }

    return this.http
      .get<ProductListResponse>(this.baseUrl, { params, headers })
      .pipe(catchError(err => throwError(() => err)));
  }
  getProduct(id: number): Observable<Product> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<Product>(`${this.baseUrl}/${id}`, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post<Product>(`${this.baseUrl}/add`, product, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .put<Product>(`${this.baseUrl}/${id}`, product, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  deleteProduct(id: number): Observable<void> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  getCategories(): Observable<string[]> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<string[]>(`${this.baseUrl}/categories`, { headers })
      .pipe(catchError(err => throwError(() => err)));
  }

  getProductsByCategory(category: string, limit: number = 10, skip: number = 0): Observable<ProductListResponse> {
    const token = this.auth.getToken();
    if (!token) return throwError(() => new Error('Not authenticated'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const params = new HttpParams()
      .set('limit', String(limit))
      .set('skip', String(skip));

    return this.http
      .get<ProductListResponse>(`${this.baseUrl}/category/${encodeURIComponent(category)}`, { params, headers })
      .pipe(catchError(err => throwError(() => err)));
  }
}
