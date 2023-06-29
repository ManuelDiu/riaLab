import { LlamadoEstado } from 'src/app/types/LlamadoPosible';
import { Area } from '../area/area';
import { MiembroTribunal } from 'src/app/types/MiembroTribunal';
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
  public llamadoEstados?: LlamadoEstado[];
  public ultimoEstado?: LlamadoEstado;
  public miembrosTribunal?: MiembroTribunal[];

}
