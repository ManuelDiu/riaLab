import { LlamadoEstadoPosible } from "../models/llamadoEP/estadoPosible";
import { Persona } from "./Persona";
import { TipoIntegrante } from "./tipoIntegrante";

export interface MiembroTribunal {
  id: number;
  activo: boolean;
  orden: number,
  renuncia: boolean;
  motivoRenuncia: string;
  llamadoId: number;
  personaId: number;
  persona: Persona,
  tipoDeIntegranteId: number;
  tipoDeIntegrante: TipoIntegrante,
}