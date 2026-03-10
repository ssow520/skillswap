import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  user: any = null;
  reviews: any[] = [];
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.userService.getUserProfile(username).subscribe({
      next: user => {
        this.user = user;
        this.loading = false;
        this.userService.getReviews(user.id).subscribe({
          next: reviews => this.reviews = reviews,
          error: () => {}
        });
      },
      error: err => { this.error = err.error?.error || 'User not found'; this.loading = false; }
    });
  }

  starsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}