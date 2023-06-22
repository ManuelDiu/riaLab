import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RemoveTIpoDocumentoResponse,
  TipoDocumento,
  TipoDocumentoResponse,
} from 'src/app/types/tipoDocumento';
import { environment } from 'src/utils/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  baseUrl = environment.BACKEND_DOMAIN_APP || "";
  public tipoDocumentos: TipoDocumento[] = [
    {
      id: 1,
      nombre: 'Cedula',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Pasaporte',
      activo: true,
    },
  ];

  constructor(private http: HttpClient) {}

  getTipoDocumentos(limit: number, offset: number, query: string = ""): Observable<HttpResponse<TipoDocumentoResponse>> {
    const response = this.http.post<TipoDocumentoResponse>(
      `${this.baseUrl}api/TiposDeDocumentos/Paged`,
      {
        limit: limit,
        offset: offset,
        id: 0,
        filters: {
          activo: null,
          nombre: query,
        },
        orders: [''],
      },
      { observe: 'response' }
    );
    return response;
  }

  createTipoDocumento(
    nombre: string,
    activo: boolean
  ): Observable<HttpResponse<TipoDocumento>> {
    const response = this.http.post<TipoDocumento>(
      `${this.baseUrl}api/TiposDeDocumentos`,
      {
        id: 0,
        activo: activo,
        nombre: nombre,
      },
      { observe: 'response' }
    );
    return response;
  }

  deleteTipoDocumento(
    id: number
  ): Observable<HttpResponse<RemoveTIpoDocumentoResponse>> {
    const response = this.http.delete<RemoveTIpoDocumentoResponse>(
      `${this.baseUrl}api/TiposDeDocumentos/${id}`,
      { observe: 'response' }
    );
    return response;
  }

  updateTipoDocumento(
    datos: TipoDocumento,
  ): Observable<HttpResponse<TipoDocumento>> {
    const response = this.http.put<TipoDocumento>(
      `${this.baseUrl}api/TiposDeDocumentos/${datos.id}`,
      {
        ...datos,
      },
      { observe: 'response' }
    );
    return response;
  }
}
