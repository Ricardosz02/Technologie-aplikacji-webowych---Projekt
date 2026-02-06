import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  loginError = false;

  constructor(private authService: AuthService, private router: Router) { }

  signIn() {
    if (this.loginForm.invalid) return;

    this.loginError = false;
    const credentials = this.loginForm.value;

    this.authService.authenticate(credentials).subscribe({
      next: (result) => {
        if (result) this.router.navigate(['/']);
        else this.loginError = true;
      },
      error: () => this.loginError = true
    });
  }
}