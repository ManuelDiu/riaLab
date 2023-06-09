import { Injectable } from '@angular/core';
import { Area } from 'src/app/models/area/area';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AreaResponse } from 'src/app/types/AreaResponse';
import { environment } from 'src/utils/environment';
import { Llamado } from 'src/app/models/llamado/llamado';
import { LlamadoEstado } from 'src/app/types/LlamadoPosible';
import { MiembroTribunal } from 'src/app/types/MiembroTribunal';
import { Postulante, PostulantesPagedResponse } from 'src/app/types/Postulante';

@Injectable({
  providedIn: 'root',
})
export class LlamadoService {
  baseURL: string = `${environment.BACKEND_DOMAIN_APP}api/` || '';

  constructor(private http: HttpClient) {}

  createLlamado(llamado: Llamado): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(llamado);
    return this.http.post(this.baseURL + 'Llamados', body, {
      headers: headers,
    });
  }

  createMiembroTribunal(miembroTrib: MiembroTribunal): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(miembroTrib);
    return this.http.post(this.baseURL + 'MiembrosTribunales', body, {
      headers: headers,
    });
  }

  deleteMiembroTribunal(miembroTrib: MiembroTribunal): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(miembroTrib);
    return this.http.delete(this.baseURL + 'MiembrosTribunales/' + miembroTrib.id , {
      headers: headers,
    });
  }

  updateMiembroTribunal(miembroTrib: MiembroTribunal): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(miembroTrib);
    return this.http.put(this.baseURL + 'MiembrosTribunales/' + miembroTrib.id, body , {
      headers: headers,
    });
  }

  createEstadoLlamado(llamadoEstado: LlamadoEstado): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(llamadoEstado);
    return this.http.post(this.baseURL + 'LlamadosEstados', body, {
      headers: headers,
    });
  }

  getLlamadosPaged(
    limit: number,
    offset: number,
    query: string = '',
    personaTribunalId?: any,
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    let body = {
      limit: limit,
      offset: offset,
      id: 0,
      filters: {
        activo: null,
        nombre: query,
        identificador: '',
        personaTribunalId: personaTribunalId || 0,
        estadoId: 0,
      },
      orders: [''],
    };

    const bodyFormatted = JSON.stringify(body);

    return this.http.post<any>(this.baseURL + 'Llamados/Paged', bodyFormatted, {
      headers: headers,
    });
  }

  updateLlamado(id: number, llamado: Llamado): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(llamado);
    return this.http.put(this.baseURL + 'Llamados/' + id, body, {
      headers: headers,
    });
  }

  deleteLlamado(id: number): Observable<any> {
    const header = { 'content-type': 'application/json' };
    return this.http.delete(this.baseURL + 'Llamados/' + id, {
      headers: header,
    });
  }

  // *** Postulantes ***
  createPostulante(postulante: Postulante): Observable<Postulante> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(postulante);
    return this.http.post<Postulante>(this.baseURL + 'Postulantes', body, {
      headers: headers,
    });
  }

  getPostulantesPaged(
    limit: number,
    offset: number,
    query: string = '',
  ): Observable<PostulantesPagedResponse> {
    const headers = { 'content-type': 'application/json' };
    let body = {
      limit: limit,
      offset: offset,
      id: 0,
      filters: {
        activo: null,
        nombre: query,
      },
      orders: [''],
    };

    const bodyFormatted = JSON.stringify(body);

    return this.http.post<PostulantesPagedResponse>(this.baseURL + 'Postulantes/Paged', bodyFormatted, {
      headers: headers,
    });
  }

  updatePostulante(postulante: Postulante): Observable<Postulante> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(postulante);
    return this.http.put<Postulante>(this.baseURL + 'Postulantes/' + postulante.id, body , {
      headers: headers,
    });
  }

  deletePostulante(id: number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    return this.http.delete(this.baseURL + 'Postulantes/' + id , {
      headers: headers,
    });
  }
}
