import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { getToken } from '../utils/tokenUtils';
import { request } from 'http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
      const token = getToken();

      if (token == null && !httpRequest.url.includes('Auth')) {
        window.location.pathname = '/auth/login';
      }

      httpRequest = httpRequest.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next.handle(httpRequest).pipe(
        catchError(
          (err) =>
            new Observable<HttpEvent<any>>((observer) => {
              if (err instanceof HttpErrorResponse) {
                const errResp = <HttpErrorResponse>err;
                if (errResp.status === 401 || err.status === 403) {
                  window.location.pathname = '/auth/login';
                }
              }
              observer.error(err);
              observer.complete();
            })
        )
      );
    } catch (error) {
      window.location.pathname = '/auth/login';
      return next.handle(httpRequest);
    }
  }
}
