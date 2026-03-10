import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService, Job } from '../../services/job';
import { ProposalService, Proposal } from '../../services/proposal';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss'
})
export class JobDetail implements OnInit {
  job: Job | null = null;
  proposals: Proposal[] = [];
  currentUser: User | null = null;
  loading = true;
  error = '';
  successMsg = '';

  proposalForm = { price: null as number | null, cover_letter: '' };
  proposalError = '';
  proposalLoading = false;
  showProposalForm = false;

  reviewForm = { target_id: null as number | null, rating: 0, comment: '' };
  reviewError = '';
  reviewSuccess = '';
  showReviewForm = false;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private proposalService: ProposalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadJob(id);
  }

  loadJob(id: number): void {
    this.jobService.getJob(id).subscribe({
      next: job => {
        this.job = job;
        this.loading = false;
        if (this.isOwner) this.loadProposals();
      },
      error: err => { this.error = err.error?.error || 'Job not found'; this.loading = false; }
    });
  }

  loadProposals(): void {
    this.jobService.getProposals(this.job!.id).subscribe({
      next: p => this.proposals = p,
      error: () => {}
    });
  }

  get isOwner(): boolean {
    return !!this.currentUser && !!this.job && this.currentUser.id === this.job.owner_id;
  }

  get isFreelance(): boolean {
    return !!this.currentUser && !!this.job && this.currentUser.id === this.job.freelance_id;
  }

  get canPropose(): boolean {
    return !!this.currentUser && !!this.job && !this.isOwner && this.job.status === 'open';
  }

  get canComplete(): boolean {
    return !!this.job && this.job.status === 'in_progress' && (this.isOwner || this.isFreelance);
  }

  get canReview(): boolean {
    return !!this.job && this.job.status === 'completed' && (this.isOwner || this.isFreelance);
  }

  submitProposal(): void {
    if (!this.proposalForm.price || !this.proposalForm.cover_letter) {
      this.proposalError = 'Price and cover letter are required';
      return;
    }
    this.proposalLoading = true;
    this.proposalError = '';
    this.jobService.submitProposal(this.job!.id, {
      price: this.proposalForm.price!,
      cover_letter: this.proposalForm.cover_letter
    }).subscribe({
      next: () => {
        this.successMsg = 'Proposal submitted successfully!';
        this.showProposalForm = false;
        this.proposalLoading = false;
      },
      error: err => {
        this.proposalError = err.error?.error || 'Failed to submit proposal';
        this.proposalLoading = false;
      }
    });
  }

  acceptProposal(proposalId: number): void {
    this.proposalService.acceptProposal(proposalId).subscribe({
      next: () => {
        this.successMsg = 'Proposal accepted! Job is now in progress.';
        this.loadJob(this.job!.id);
      },
      error: err => this.error = err.error?.error || 'Failed to accept proposal'
    });
  }

  completeJob(): void {
    this.jobService.completeJob(this.job!.id).subscribe({
      next: () => {
        this.successMsg = 'Job marked as completed!';
        this.loadJob(this.job!.id);
      },
      error: err => this.error = err.error?.error || 'Failed to complete job'
    });
  }

  setReviewTarget(isOwner: boolean): void {
    if (!this.job) return;
    this.reviewForm.target_id = isOwner ? this.job.owner_id : this.job.freelance_id!;
    this.showReviewForm = true;
  }

  submitReview(): void {
    if (!this.reviewForm.target_id || !this.reviewForm.rating) {
      this.reviewError = 'Target and rating are required';
      return;
    }
    this.jobService.submitReview(this.job!.id, {
      target_id: this.reviewForm.target_id!,
      rating: this.reviewForm.rating,
      comment: this.reviewForm.comment
    }).subscribe({
      next: () => { this.reviewSuccess = 'Review submitted!'; this.showReviewForm = false; },
      error: err => this.reviewError = err.error?.error || 'Failed to submit review'
    });
  }

  setRating(r: number): void {
    this.reviewForm.rating = r;
  }
}