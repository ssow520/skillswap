import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  role: UserRole = 'freelancer';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  selectRole(r: UserRole): void {
    this.role = r;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password, this.role).subscribe({
      next: () => {
        if (this.role === 'client') {
          this.router.navigate(['/my-postings']);
        } else {
          this.router.navigate(['/jobs']);
        }
      },
      error: err => {
        this.error = err.error?.error || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}