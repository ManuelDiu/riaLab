import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/utils/environment";
import { UsuarioResponse } from "src/app/types/UsuarioResponse";
import { HandleRegisterData, UsuarioInfo } from "src/app/types/Usuario";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || "";

  constructor(private http: HttpClient) {}

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.baseURL + "Auth/Users/Roles");
  }

  addRole(userId: string, roleId: string): Observable<any> {
    const headers = { "content-type": "application/json" };
    let body = {
      userId: userId,
      roleId: roleId,
    };
    const bodyFormatted = JSON.stringify(body);

    return this.http.post(
      this.baseURL + "Auth/Users/UserRoles",
      bodyFormatted,
      { headers: headers }
    );
  }

  deleteRole(userId: string, roleId: string): Observable<any> {
    const header = { "content-type": "application/json" };
    let body = {
      userId: userId,
      roleId: roleId,
    };
    const bodyFormatted = JSON.stringify(body);

    return this.http.delete(this.baseURL + "Auth/Users/UserRoles", {
      headers: header,
      body: bodyFormatted,
    });
  }
}
