import { Injectable } from "@angular/core";
import { Persona } from "src/app/types/Persona";
import { Observable } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PersonasPagedResponse } from "src/app/types/PersonaResponse";
import { environment } from "src/utils/environment";

@Injectable({
  providedIn: "root",
})
export class PersonaService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || "";

  constructor(private http: HttpClient) {}

  getPersonasPaged(limit: number, offset: number): Observable<PersonasPagedResponse> {
    // term = term.trim();
    const headers = { "content-type": "application/json" };
    let body = {
      limit: limit,
      offset: offset,
      id: 0,
      filters: {
        activo: null,
        nombre: "",
      },
      orders: [""],
    };

    const bodyFormatted = JSON.stringify(body);

    return this.http.post<PersonasPagedResponse>(this.baseURL + "Personas/Paged", bodyFormatted, {
      headers: headers,
    });
  }

  getPersonaByDocumento(tipoDocumento: number, documento: string): Observable<Persona> {
    const headers = { "content-type": "application/json" };
    return this.http.get<Persona>(this.baseURL + `Personas/${tipoDocumento}/${documento}` , {
      headers: headers,
    });
  }

  createPersona(persona: Persona): Observable<Persona> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(persona);
    return this.http.post<Persona>(this.baseURL + 'Personas', body, {
      headers: headers,
    });
  }

  updatePersona(id: number, persona: Persona): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(persona);
    return this.http.put(this.baseURL + "Personas/" + id, body, { headers: headers });
  }

  deletePersona(id: number): Observable<any> {
    const header = { "content-type": "application/json" };
    return this.http.delete(this.baseURL + "Personas/" + id, { headers: header });
  }

}
