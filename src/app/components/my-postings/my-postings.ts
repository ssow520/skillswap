import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job';

@Component({
  selector: 'app-my-postings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-postings.html',
  styleUrl: './my-postings.scss'
})
export class MyPostings implements OnInit {
  jobs: Job[] = [];
  loading = true;
  error = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getMyPostings().subscribe({
      next: jobs => { this.jobs = jobs; this.loading = false; },
      error: err => { this.error = err.error?.error || 'Failed to load postings'; this.loading = false; }
    });
  }
}