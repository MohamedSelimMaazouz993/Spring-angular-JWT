import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserDto } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`
      );
      // Extract backend error message if available
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }
    return throwError(errorMessage);
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.BASE_URL)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.BASE_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createUser(user: UserDto): Observable<User> {
    // Ensure roles is an array if it's not already
    const payload = {
      ...user,
      roles: Array.isArray(user.roles) ? user.roles : [user.roles],
    };
    return this.http
      .post<User>(this.BASE_URL, payload)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, user: UserDto): Observable<User> {
    // Ensure roles is properly formatted
    const payload = {
      ...user,
      roles: Array.isArray(user.roles) ? user.roles : [user.roles],
    };
    return this.http
      .put<User>(`${this.BASE_URL}/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }
}
