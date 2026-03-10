import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss'
})
export class Jobs implements OnInit {
  jobs: Job[] = [];
  loading = false;
  error = '';
  filters = { category: '', status: 'open', min_budget: null as number | null };
  categories = ['Design', 'Development', 'Marketing', 'Writing', 'Data', 'Video', 'Audio', 'Other'];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.error = '';
    const payload: any = {};
    if (this.filters.category) payload.category = this.filters.category;
    if (this.filters.status) payload.status = this.filters.status;
    if (this.filters.min_budget) payload.min_budget = this.filters.min_budget;

    this.jobService.searchJobs(payload).subscribe({
      next: jobs => { this.jobs = jobs; this.loading = false; },
      error: err => { this.error = err.error?.error || 'Failed to load jobs'; this.loading = false; }
    });
  }

  resetFilters(): void {
    this.filters = { category: '', status: 'open', min_budget: null };
    this.search();
  }
}