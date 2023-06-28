import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/utils/environment";
import { Responsabilidad } from "src/app/types/Responsabilidad";
import { ResponsabilidadResponse } from "src/app/types/ResponsabilidadResponse";

@Injectable({
  providedIn: "root",
})
export class ResponsabilidadService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || "";

  constructor(private http: HttpClient) {}

  createResponsabilidad(resp: Responsabilidad): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(resp);
    return this.http.post(`${this.baseURL}Responsabilidades`, body, {
      headers: headers,
    });
  }

  getResponsabilidadesPaged(
    limit: number,
    offset: number,
    query: string = ""
  ): Observable<ResponsabilidadResponse> {
    const headers = { "content-type": "application/json" };
    let body = {
      limit: limit,
      offset: offset,
      id: 0,
      filters: {
        activo: null,
        nombre: query,
      },
      orders: [""],
    };

    const bodyFormatted = JSON.stringify(body);

    return this.http.post<ResponsabilidadResponse>(
      `${this.baseURL}Responsabilidades/Paged`,
      bodyFormatted,
      {
        headers: headers,
      }
    );
  }

  getResponsabilidadById(id: number): Observable<Responsabilidad> {
    const headers = { "content-type": "application/json" };

    return this.http.get<Responsabilidad>(
      `${this.baseURL}Responsabilidades/${id}`,
      {
        headers: headers,
      }
    );
  }

  updateResponsabilidad(id: number, resp: Responsabilidad): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(resp);
    return this.http.put(`${this.baseURL}Responsabilidades/${id}`, body, {
      headers: headers,
    });
  }

  deleteResponsabilidad(id: number): Observable<any> {
    const header = { "content-type": "application/json" };
    return this.http.delete(`${this.baseURL}Responsabilidades/${id}`, {
      headers: header,
    });
  }
}
