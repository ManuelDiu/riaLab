import { Area } from '../area/area';
export class Llamado {
  public id?: number;
  public activo?: boolean;
  public identificador?: string;
  public nombre?: string;
  public linkPlanillaPuntajes?: string;
  public linkActa?: string;
  public minutosEntrevista?: number;
  public areaId?: number;
  public area?: Area;
}
