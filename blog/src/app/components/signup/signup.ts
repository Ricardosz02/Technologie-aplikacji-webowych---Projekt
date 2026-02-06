import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    name: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) { }

  create() {
    if (this.signupForm.invalid) return;

    this.authService.createOrUpdate(this.signupForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error(err)
    });
  }
}