import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss'
})
export class JobForm {
  form = { title: '', description: '', budget: null as number | null, category: '' };
  categories = ['Design', 'Development', 'Marketing', 'Writing', 'Data', 'Video', 'Audio', 'Other'];
  error = '';
  loading = false;

  constructor(private jobService: JobService, private router: Router) {}

  onSubmit(): void {
    const { title, description, budget, category } = this.form;
    if (!title || !description || !budget || !category) {
      this.error = 'All fields are required';
      return;
    }
    this.loading = true;
    this.error = '';
    this.jobService.createJob({ title, description, budget: budget!, category }).subscribe({
      next: (job: any) => this.router.navigate(['/jobs', job.id || job.job?.id]),
      error: err => { this.error = err.error?.error || 'Failed to create job'; this.loading = false; }
    });
  }
}