import { Responsabilidad } from "./Responsabilidad"

export type ResponsabilidadResponse = {
  list: Responsabilidad[],
  currentPage: number,
  limit: number,
  offset: number,
  totalPages: number,
  totalCount: number,
}
