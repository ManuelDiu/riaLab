import { UsuarioInfo } from "./Usuario"

export type UsuarioResponse = {
  list: UsuarioInfo[],
  totalCount: number,
  totalPages: number,
  currentPage: number,
  offset: number,
  limit: number,
}
