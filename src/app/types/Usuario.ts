import { TipoDocumento } from './tipoDocumento';

export interface Usuario {
  statusOk: boolean;
  statusMessage: string;
  idUsuario: string;
  token: string;
  expiration: string;
  expirationMinutes: number;
  nombre: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  imagen: string;
  email: string;
  roles: string[];
}

export interface HandleLoginData {
  username: string;
  password: string,
}