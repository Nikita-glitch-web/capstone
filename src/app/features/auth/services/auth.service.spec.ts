import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token after successful login', () => {
    const mockResponse = { token: 'fake-token' };

    service.login('user', 'pass').subscribe((res) => {
      expect(res.token).toBe('fake-token');
      expect(service.getToken()).toBe('fake-token');
    });

    const req = httpMock.expectOne('https://dummyjson.com/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should remove token on logout', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('should throw error on invalid login', () => {
    service.login('wrong', 'wrong').subscribe({
      next: () => fail('should have failed'),
      error: (err) => expect(err.status).toBe(401),
    });

    const req = httpMock.expectOne('https://dummyjson.com/auth/login');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });
});
