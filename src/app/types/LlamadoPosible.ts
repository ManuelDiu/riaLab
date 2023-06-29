import { LlamadoEstadoPosible } from "../models/llamadoEP/estadoPosible";

export interface LlamadoEstado {
  id: number;
  activo: boolean;
  fechaHora: string;
  usuarioTransicion: string;
  observacion: string;
  llamadoId: number;
  llamadoEstadoPosibleId: number;
  llamadoEstadoPosible: LlamadoEstadoPosible;
}
