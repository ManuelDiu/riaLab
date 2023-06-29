import { Area } from "../models/area/area";

export interface Responsabilidad {
  id: number;
  activo: boolean;
  nombre: string;
  descripcion: string;
  area: Area | undefined;
  areaId: number;
}
