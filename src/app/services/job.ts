import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'in_progress' | 'completed';
  owner_id: string;
  freelance_id?: string;
  freelancer_id?: string;
  created_at: string;
  owner?: any;
  freelance?: any;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private baseUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private http: HttpClient) {}

  searchJobs(filters: { category?: string; status?: string; min_budget?: number } = {}): Observable<Job[]> {
    return this.http.post<Job[]>(`${this.baseUrl}/jobs/search`, filters);
  }

  createJob(data: { title: string; description: string; budget: number; category: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/jobs`, data);
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${id}`);
  }

  updateJob(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/jobs/${id}`, data);
  }

  completeJob(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/jobs/${id}/complete`, {});
  }

  getMyPostings(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/jobs/my-postings`);
  }

  getProposals(jobId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/jobs/${jobId}/proposals`);
  }

  submitProposal(jobId: string, data: { price: number; cover_letter: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/jobs/${jobId}/proposals`, data);
  }

  submitReview(jobId: string, data: { target_id: string; rating: number; comment?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/jobs/${jobId}/reviews`, data);
  }
}