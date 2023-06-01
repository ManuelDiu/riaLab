import { Area } from "../models/area/area"

export type AreaResponse = {
  list: Area[],
  currentPage: number,
  limit: number,
  offset: number,
  totalPages: number,
  totalCount: number,
}
