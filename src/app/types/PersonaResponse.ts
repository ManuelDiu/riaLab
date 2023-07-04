import { Persona } from "./Persona";
import { TipoDocumento } from "./tipoDocumento";

export type PersonasPagedResponse = {
  list: Persona[];
  currentPage: number;
  limit: number;
  offset: number;
  totalPages: number;
  totalCount: number;
};

/* export type PersonaByDocAndTypeDocResponse = {
  id: number;
  activo: boolean;
  tipoDeDocumento: TipoDocumento;
  documento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
}; */
