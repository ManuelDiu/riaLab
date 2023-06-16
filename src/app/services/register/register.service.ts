import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HandleRegisterData, RegisterResponse, Usuario } from 'src/app/types/Usuario';
import { environment } from 'src/utils/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  baseUrl = environment.BACKEND_DOMAIN_APP || '';

  constructor(private http: HttpClient) {}

  public handleRegister(data: HandleRegisterData): Observable<HttpResponse<RegisterResponse>> {
    const url = `${this.baseUrl}api/Auth/Register`;
    const response = this.http.post<RegisterResponse>(url, data, {
      observe: 'response',
    });
    return response;
  }
}
