import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  // Clone the request and add the authorization header
  const authReq = addAuthHeader(req, authService);

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized responses
      if (error.status === 401) {
        handleUnauthorizedError(authService, router);
      }
      // Handle 403 Forbidden responses
      else if (error.status === 403) {
        handleForbiddenError(router);
      }
      // For other errors, show a generic error message
      else {
        showErrorDialog(error.message || 'An unknown error occurred', dialog);
      }

      return throwError(() => error);
    })
  );
}

function addAuthHeader(request: HttpRequest<unknown>, authService: AuthService): HttpRequest<unknown> {
  const token = authService.getToken();

  if (token && !isAuthRequest(request.url)) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return request;
}

function isAuthRequest(url: string): boolean {
  return url.includes('/auth/login') || url.includes('/auth/register');
}

function handleUnauthorizedError(authService: AuthService, router: Router): void {
  authService.logout();
  router.navigate(['/login'], {
    queryParams: { sessionExpired: true }
  });
}

function handleForbiddenError(router: Router): void {
  router.navigate(['/forbidden']);
}

function showErrorDialog(message: string, dialog: MatDialog): void {
  dialog.open(ErrorDialogComponent, {
    data: { message },
    width: '400px'
  });
}
