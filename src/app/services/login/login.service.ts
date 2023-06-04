import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HandleLoginData, Usuario } from 'src/app/types/Usuario';
import { environment } from 'src/utils/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = environment.BACKEND_DOMAIN_APP || '';

  constructor(private http: HttpClient) {}

  public handleLogin(data: HandleLoginData): Observable<HttpResponse<Usuario>> {
    const url = `${this.baseUrl}api/Auth/Login`;
    const response = this.http.post<Usuario>(url, data, {
      observe: 'response',
    });
    return response;
  }
}
