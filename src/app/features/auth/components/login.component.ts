// src/app/features/auth/components/login.component.ts
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.error.set('Please fill in all fields.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { username, password } = this.loginForm.value;
    console.log('Login form values:', { username, password });

    this.auth.login(username, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/items']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 400) {
          this.error.set(
            'Invalid username or password.'
          );
        } else {
          this.error.set(err?.error?.message || 'Login failed');
        }
        console.error('Login error:', err);
      },
    });
  }
}
