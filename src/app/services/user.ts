import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${username}`);
  }

  getReviews(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reviews/user/${userId}`);
  }

  getPlatformStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/platform/stats`);
  }
}