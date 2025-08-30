import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = { login: jest.fn() };
    routerSpy = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should set error if form is invalid on submit', () => {
    component.submit();
    expect(component.error()).toBe('Please fill in all fields.');
    expect(component.loading()).toBe(false);
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call AuthService.login on valid form submit', () => {
    component.loginForm.controls['username'].setValue('user');
    component.loginForm.controls['password'].setValue('pass');
    authServiceSpy.login.mockReturnValue(of({ token: 'fake-token' }));

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('user', 'pass');
    expect(component.loading()).toBe(true); 
  });

  it('should navigate to /items on successful login', () => {
    component.loginForm.controls['username'].setValue('user');
    component.loginForm.controls['password'].setValue('pass');
    authServiceSpy.login.mockReturnValue(of({ token: 'fake-token' }));

    component.submit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/items']);
    expect(component.error()).toBeNull();
    expect(component.loading()).toBe(false);
  });

  it('should set error signal on login error', () => {
    component.loginForm.controls['username'].setValue('user');
    component.loginForm.controls['password'].setValue('wrong');
    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ status: 400 }))
    );

    component.submit();

    expect(component.error()).toBe('Invalid username or password.');
    expect(component.loading()).toBe(false);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should set generic error if login fails with other status', () => {
    component.loginForm.controls['username'].setValue('user');
    component.loginForm.controls['password'].setValue('pass');
    authServiceSpy.login.mockReturnValue(
      throwError(() => ({ status: 500, error: { message: 'Server down' } }))
    );

    component.submit();

    expect(component.error()).toBe('Server down');
    expect(component.loading()).toBe(false);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
