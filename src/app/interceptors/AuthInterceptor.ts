import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { getToken } from '../utils/tokenUtils';

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
      return next.handle(httpRequest);
    } catch (error) {
      window.location.pathname = '/auth/login';
      return next.handle(httpRequest);
    }
  }
}
