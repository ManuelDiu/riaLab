import { LlamadoEstadoPosible } from "../models/llamadoEP/estadoPosible"

export type EstadoPosibleResponse = {
  list: LlamadoEstadoPosible[],
  currentPage: number,
  limit: number,
  offset: number,
  totalPages: number,
  totalCount: number,
}
