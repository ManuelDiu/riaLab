import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/utils/environment";
import { UsuarioResponse } from "src/app/types/UsuarioResponse";
import { HandleRegisterData, UsuarioInfo } from "src/app/types/Usuario";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || "";

  constructor(private http: HttpClient) {}

  getUsuariosPaged(limit: number, offset: number): Observable<UsuarioResponse> {
    // term = term.trim();
    const headers = { "content-type": "application/json" };
    let body = {
      limit: limit,
      offset: offset,
      id: 0,
      filters: {
        activo: true,
        nombre: "",
        idUsuario: "",
        username: "",
        email: "",
        documento: "",
      },
      orders: [""],
    };

    const bodyFormatted = JSON.stringify(body);

    return this.http.post<UsuarioResponse>(this.baseURL + "Auth/Users", bodyFormatted, {
      headers: headers,
    });
  }

  updateUsuario(usuario: HandleRegisterData): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(usuario);
    return this.http.put(this.baseURL + "Auth/Users/", body, { headers: headers });
  }

  // Users no tiene endpoint de delete.
  /* deleteUsuario(id: number): Observable<any> {
    const header = { "content-type": "application/json" };
    return this.http.delete(this.baseURL + "Auth/Users/" + id, { headers: header });
  } */
}
