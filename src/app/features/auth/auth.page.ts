import { Component } from '@angular/core';
import { LoginPage } from "./pages/login.page";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [LoginPage],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})

export class AuthPage {
  constructor(private auth: AuthService) {}
}
