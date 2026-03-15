import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProposalService, Proposal } from '../../services/proposal';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bids.html',
  styleUrl: './my-bids.scss'
})
export class MyBids implements OnInit {
  proposals: Proposal[] = [];
  loading = true;
  error = '';
  successMsg = '';

  constructor(private proposalService: ProposalService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.proposalService.getMyBids().subscribe({
      next: p => { this.proposals = p; this.loading = false; },
      error: err => { this.error = err.error?.error || 'Failed to load bids'; this.loading = false; }
    });
  }

  deleteProposal(id: string): void {
    this.proposalService.deleteProposal(id).subscribe({
      next: () => {
        this.successMsg = 'Proposal withdrawn.';
        this.proposals = this.proposals.filter(p => p.id !== id);
      },
      error: err => this.error = err.error?.error || 'Failed to delete proposal'
    });
  }
}