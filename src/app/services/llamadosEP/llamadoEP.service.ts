import { Injectable } from "@angular/core";
import { LlamadoEstadoPosible } from "src/app/models/llamadoEP/estadoPosible";
import { Observable } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EstadoPosibleResponse } from "src/app/types/LlamadoEPResponse";
import { environment } from "src/utils/environment";

@Injectable({
  providedIn: "root",
})
export class LlamadoEPService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || "";

  constructor(private http: HttpClient) {}

  createEstadoPosible(estadoP: LlamadoEstadoPosible): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(estadoP);
    return this.http.post(this.baseURL + "LlamadosEstadosPosibles", body, {
      headers: headers,
    });
  }

  getEstadosPosiblesPaged(
    limit: number,
    offset: number
  ): Observable<EstadoPosibleResponse> {
    const headers = { "content-type": "application/json" };
    let body = {
      limit: limit,
      offset: offset,
      id: 0,
      filters: {
        activo: true,
        nombre: "",
      },
      orders: [""],
    };

    const bodyFormatted = JSON.stringify(body);

    return this.http.post<EstadoPosibleResponse>(
      this.baseURL + "LlamadosEstadosPosibles/Paged",
      bodyFormatted,
      {
        headers: headers,
      }
    );
  }

  updateEstadoPosible(
    id: number,
    estadoP: LlamadoEstadoPosible
  ): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(estadoP);
    return this.http.put(this.baseURL + "LlamadosEstadosPosibles/" + id, body, {
      headers: headers,
    });
  }

  deleteEstadoPosible(id: number): Observable<any> {
    console.log("id que llega al delete: " + id);
    const header = { "content-type": "application/json" };
    return this.http.delete(this.baseURL + "LlamadosEstadosPosibles/" + id, {
      headers: header,
    });
  }
}
