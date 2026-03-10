import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proposal {
  id: number;
  job_id: number;
  freelance_id: number;
  price: number;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  job?: any;
  freelance?: any;
}

@Injectable({ providedIn: 'root' })
export class ProposalService {
  private baseUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private http: HttpClient) {}

  acceptProposal(proposalId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/proposals/${proposalId}/accept`, {});
  }

  getMyBids(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.baseUrl}/proposals/my-bids`);
  }

  deleteProposal(proposalId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/proposals/${proposalId}`);
  }
}