import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RemoveTipoIntegranteResponse,
  TipoIntegrante,
  TipoIntegranteResponse,
} from 'src/models/tipoIntegrante';

@Injectable({
  providedIn: 'root',
})
export class TipoIntegranteService {
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

  getTipoIntegrantes(): Observable<HttpResponse<TipoIntegranteResponse>> {
    const response = this.http.post<TipoIntegranteResponse>(
      `http://localhost:60720/api/TiposDeIntegrantes/Paged`,
      {
        limit: 500,
        offset: 0,
        id: 0,
        filters: {
          activo: true,
          nombre: '',
        },
        orders: ['string'],
      },
      { observe: 'response' }
    );
    return response;
  }

  createTipoIntegrante(
    nombre: string,
    activo: boolean,
    orden: number,
  ): Observable<HttpResponse<TipoIntegrante>> {
    const response = this.http.post<TipoIntegrante>(
      `http://localhost:60720/api/TiposDeIntegrantes`,
      {
        id: 0,
        activo: activo,
        nombre: nombre,
        orden: orden,
      },
      { observe: 'response' }
    );
    return response;
  }

  deleteTipoIntegrante(
    id: number
  ): Observable<HttpResponse<RemoveTipoIntegranteResponse>> {
    const response = this.http.delete<RemoveTipoIntegranteResponse>(
      `http://localhost:60720/api/TiposDeIntegrantes/${id}`,
      { observe: 'response' }
    );
    return response;
  }

  updateTipoIntegrante(
    datos: TipoIntegrante
  ): Observable<HttpResponse<TipoIntegrante>> {
    const response = this.http.put<TipoIntegrante>(
      `http://localhost:60720/api/TiposDeIntegrantes/${datos.id}`,
      {
        ...datos,
      },
      { observe: 'response' }
    );
    return response;
  }
}
