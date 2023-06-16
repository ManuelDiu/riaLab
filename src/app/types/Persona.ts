import { TipoDocumento } from "./tipoDocumento";

export interface Persona {
  id: number;
  activo: boolean;
  tipoDeDocumento: TipoDocumento;
  documento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
}
