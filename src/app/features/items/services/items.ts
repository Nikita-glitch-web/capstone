import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(limit: number = 10, skip: number = 0, q?: string): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    if (q) {
      params = params.set('q', q);
      return this.http.get<ProductListResponse>(`${this.baseUrl}/search`, { params });
    }

    return this.http.get<ProductListResponse>(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  getProductsByCategory(category: string, limit: number = 10, skip: number = 0, q?: string): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<ProductListResponse>(`${this.baseUrl}/category/${category}${q ? '/search' : ''}`, { params });
  }
}
