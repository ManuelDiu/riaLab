import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/utils/environment';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || '';

  constructor(private http: HttpClient) {}

  public handleForgotPassword(email: string): Observable<HttpResponse<any>> {
    return this.http.post(
      `${this.baseURL}Auth/ForgotPassword`,
      {
        email: email,
      },
      {
        observe: 'response',
      }
    );
  }

  public handleResetPassword(email: string, password: string, token: string): Observable<HttpResponse<any>> {
    return this.http.post(
      `${this.baseURL}Auth/ResetPassword`,
      {
        email: email,
        password: password,
        token: token,
        confirmPassword: password,
      },
      {
        observe: 'response',
      }
    );
  }
}
