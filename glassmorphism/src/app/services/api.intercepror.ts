// src/app/interceptors/api.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, EMPTY, throwError, Subject } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToasterService } from './toaster.service';

let refreshingAccessToken = false;
const accessTokenRefreshed = new Subject<void>();

export const apiInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const toasterService = inject(ToasterService);

  request = addAuthHeader(request, authService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return refreshAccessToken(authService).pipe(
          switchMap(() => {
            request = addAuthHeader(request, authService);
            return next(request);
          }),
          catchError(err => {
            console.error('Token refresh failed:', err);
            toasterService.error(`${error.error.message} : ${error.url}`)
            // authService.logout();
            return EMPTY;
          })
        );
      }
      return throwError(() => error);
    })
  );
};

function addAuthHeader(req: HttpRequest<any>, authService: AuthService): HttpRequest<any> {
  const token = authService.getAccessToken();
  if (token) {
    return req.clone({
      setHeaders: {
        'x-access-token': token
      }
    });
  }
  return req;
}

function refreshAccessToken(authService: AuthService): Observable<void> {
  if (refreshingAccessToken) {
    return new Observable<void>(observer => {
      accessTokenRefreshed.subscribe(() => {
        observer.next();
        observer.complete();
      });
    });
  } else {
    refreshingAccessToken = true;
    return authService.getNewAccessToken().pipe(
      tap(() => {
        console.log('Access token refreshed!');
        refreshingAccessToken = false;
        accessTokenRefreshed.next();
      }),
      map(() => { }) // cast HttpResponse to void
    );
  }
}
