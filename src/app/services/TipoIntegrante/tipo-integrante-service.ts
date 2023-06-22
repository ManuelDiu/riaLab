import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RemoveTipoIntegranteResponse,
  TipoIntegrante,
  TipoIntegranteResponse,
} from 'src/app/types/tipoIntegrante';
import { environment } from 'src/utils/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoIntegranteService {
  baseUrl = environment.BACKEND_DOMAIN_APP || "";
  public tipoIntegrantes: TipoIntegrante[] = [
    {
      id: 1,
      nombre: 'Cedula',
      activo: true,
      orden: 0,
    },
    {
      id: 2,
      nombre: 'Pasaporte',
      activo: true,
      orden: 0,
    },
  ];

  constructor(private http: HttpClient) {}

  getTipoIntegrantes(limit: number, offset:number, query: string = ""): Observable<HttpResponse<TipoIntegranteResponse>> {
    const response = this.http.post<TipoIntegranteResponse>(
      `${this.baseUrl}api/TiposDeIntegrantes/Paged`,
      {
        limit: limit,
        offset: offset,
        id: 0,
        filters: {
          activo: true,
          nombre: query,
        },
        orders: [''],
      },
      { observe: 'response' }
    );
    return response;
  }

  createTipoIntegrante(
    nombre: string,
    activo: boolean,
    orden: number,
    estado: boolean,
  ): Observable<HttpResponse<TipoIntegrante>> {
    const response = this.http.post<TipoIntegrante>(
      `${this.baseUrl}api/TiposDeIntegrantes`,
      {
        id: 0,
        activo: activo,
        nombre: nombre,
        orden: orden,
        estado: estado,
      },
      { observe: 'response' }
    );
    return response;
  }

  deleteTipoIntegrante(
    id: number
  ): Observable<HttpResponse<RemoveTipoIntegranteResponse>> {
    const response = this.http.delete<RemoveTipoIntegranteResponse>(
      `${this.baseUrl}api/TiposDeIntegrantes/${id}`,
      { observe: 'response' }
    );
    return response;
  }

  updateTipoIntegrante(
    datos: TipoIntegrante
  ): Observable<HttpResponse<TipoIntegrante>> {
    const response = this.http.put<TipoIntegrante>(
      `${this.baseUrl}api/TiposDeIntegrantes/${datos.id}`,
      {
        ...datos,
      },
      { observe: 'response' }
    );
    return response;
  }
}
