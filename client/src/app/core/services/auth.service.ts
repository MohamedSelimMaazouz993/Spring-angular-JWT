import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  roles?: string[];
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);

  // Public observables
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        this.currentUserSubject.next({
          id: decoded.sub,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles || [],
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE_URL}/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            localStorage.setItem('access_token', response.token);
            this.currentUserSubject.next({
              id: response.id,
              username: response.username,
              email: response.email,
              roles: response.roles,
            });
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Login error:', error);
            this.clearAuth();
          },
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE_URL}/register`, userData)
      .pipe(
        tap({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('access_token', response.token);
              this.currentUserSubject.next({
                id: response.id,
                username: response.username,
                email: response.email,
                roles: response.roles || ['USER'], // Default role
              });
            }
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.clearAuth();
          },
        })
      );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private clearAuth(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }

  // Helper method to check if current user is admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes('ADMIN') || false;
  }

  // Refresh user data (call after user profile updates)
  refreshUserData(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        this.currentUserSubject.next({
          id: decoded.sub,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles || [],
        });
      } catch (error) {
        console.error('Error refreshing user data:', error);
        this.clearAuth();
      }
    }
  }
}
