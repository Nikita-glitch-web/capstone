import { HttpClient } from '@angular/common/http';
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
  private baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  // Отримати продукти (список) з типізацією
  getProducts(limit: number, skip: number, q: string = ''): Observable<ProductListResponse> {
    if (q) {
      return this.http.get<ProductListResponse>(`${this.baseUrl}/search?q=${q}&limit=${limit}&skip=${skip}`);
    }
    return this.http.get<ProductListResponse>(`${this.baseUrl}?limit=${limit}&skip=${skip}`);
  }

  // Отримати один продукт
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Створити продукт
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add`, product);
  }

  // Оновити продукт
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  // Видалити продукт
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Отримати всі категорії
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  // Отримати продукти по категорії з пагінацією та пошуком
  getProductsByCategory(category: string, limit: number, skip: number, q: string = ''): Observable<ProductListResponse> {
    const searchParam = q ? `/search?q=${q}` : '';
    return this.http.get<ProductListResponse>(`${this.baseUrl}/category/${category}?limit=${limit}&skip=${skip}${searchParam}`);
  }
}
