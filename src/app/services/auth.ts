import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  skills: string[];
  rating_avg: number;
  completed_jobs: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.loadCurrentUser().subscribe({ error: () => this.logout() });
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }
}