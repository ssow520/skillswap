import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  role: UserRole = 'freelancer';
  form = { name: '', username: '', email: '', password: '', bio: '', skills: [] as string[] };
  skillInput = '';
  error = '';
  suggestedUsername = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  selectRole(r: UserRole): void {
    this.role = r;
  }

  addSkill(): void {
    const s = this.skillInput.trim();
    if (s && !this.form.skills.includes(s)) {
      this.form.skills.push(s);
    }
    this.skillInput = '';
  }

  removeSkill(skill: string): void {
    this.form.skills = this.form.skills.filter(s => s !== skill);
  }

  onSubmit(): void {
    const { name, username, email, password, bio, skills } = this.form;
    if (!name || !username || !email || !password || !bio || skills.length === 0) {
      this.error = 'All fields are required, including at least one skill';
      return;
    }
    this.loading = true;
    this.error = '';
    this.suggestedUsername = '';

    this.authService.register(this.form).subscribe({
      next: () => {
        this.authService.login(email, password, this.role).subscribe({
          next: () => {
            if (this.role === 'client') {
              this.router.navigate(['/jobs/new']);
            } else {
              this.router.navigate(['/jobs']);
            }
          },
          error: () => this.router.navigate(['/login'])
        });
      },
      error: err => {
        const body = err.error;
        this.error = body?.error || 'Registration failed';
        if (body?.suggested_username) {
          this.suggestedUsername = body.suggested_username;
        }
        this.loading = false;
      }
    });
  }

  useSuggested(): void {
    this.form.username = this.suggestedUsername;
    this.suggestedUsername = '';
  }
}