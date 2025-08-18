import { Component } from '@angular/core';
import { LoginComponent } from '../components/login.component';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {}
