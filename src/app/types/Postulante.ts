import { Persona } from "./Persona";

export type Postulante = {
  id: number;
  activo: boolean;
  fechaHoraEntrevista: string;
  estudioMeritosRealizado: boolean;
  entrevistaRealizada: boolean;
  llamadoId: number;
  personaId?: number;
  persona?: Persona;
};

export type PostulantesPagedResponse = {
  list: Postulante[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  offset: number;
  limit: number;
};
