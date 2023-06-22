import { Injectable } from "@angular/core";
import { Area } from "src/app/models/area/area";
import { Observable } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AreaResponse } from "src/app/types/AreaResponse";
import { environment } from "src/utils/environment";

@Injectable({
  providedIn: "root",
})
export class AreaService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || "";

  constructor(private http: HttpClient) {}

  createArea(area: Area): Observable<any> {
    const headers = { "content-type": "application/json" };
    // console.log("areea: " + area);
    const body = JSON.stringify(area);
    return this.http.post(this.baseURL + "Areas", body, { headers: headers });
  }

  getAreasPaged(limit: number, offset: number): Observable<AreaResponse> {
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

    return this.http.post<AreaResponse>(this.baseURL + "Areas/Paged", bodyFormatted, {
      headers: headers,
    });
  }

  updateArea(id: number, area: Area): Observable<any> {
    const headers = { "content-type": "application/json" };
    const body = JSON.stringify(area);
    return this.http.put(this.baseURL + "Areas/" + id, body, { headers: headers });
  }

  deleteArea(id: number): Observable<any> {
    console.log("id que llega al delete: " + id)
    const header = { "content-type": "application/json" };
    return this.http.delete(this.baseURL + "Areas/" + id, { headers: header });
  }

}
