import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export type UserRole = 'client' | 'freelancer';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  skills: string[];
  rating_avg: number;
  completed_jobs: number;
  role?: UserRole;
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

  login(email: string, password: string, role: UserRole): Observable<any> {
    return this.http.post<{ token: string; user: User }>(
      `${this.baseUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', role);
        const userWithRole = { ...res.user, role };
        this.currentUserSubject.next(userWithRole);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): UserRole | null {
    return localStorage.getItem('userRole') as UserRole | null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isClient(): boolean {
    return this.getRole() === 'client';
  }

  isFreelancer(): boolean {
    return this.getRole() === 'freelancer';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`).pipe(
      tap(user => {
        const role = this.getRole();
        this.currentUserSubject.next({ ...user, role: role ?? undefined });
      })
    );
  }
}