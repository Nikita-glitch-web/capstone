import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsService, Product } from './items';
import { AuthService } from '../../auth/services/auth.service';
import { of } from 'rxjs';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpMock: HttpTestingController;
  let authServiceSpy: any;

  beforeEach(() => {
    authServiceSpy = { getToken: jest.fn(() => 'fake-token') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemsService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(ItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a product by id', () => {
    const mockProduct: Product = { id: 1, title: 'Test', price: 100, rating: 4.5, stock: 10, category: 'cat', thumbnail: 'img.jpg' };

    service.getProduct(1).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('https://dummyjson.com/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should return error if not authenticated', () => {
    authServiceSpy.getToken = jest.fn(() => null);
    service.getProduct(1).subscribe({
      next: () => fail('should have failed'),
      error: (err) => expect(err.message).toBe('Not authenticated'),
    });
  });

  it('should fetch products list', () => {
    const mockResponse = { products: [{ id: 1, title: 'Test', price: 100, rating: 4.5, stock: 10, category: 'cat', thumbnail: 'img.jpg' }], total: 1, skip: 0, limit: 10 };

    service.getProducts().subscribe((res) => {
      expect(res.products.length).toBe(1);
      expect(res.products[0].title).toBe('Test');
    });

    const req = httpMock.expectOne('https://dummyjson.com/products?limit=10&skip=0');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
