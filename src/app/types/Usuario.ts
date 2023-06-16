import { Persona } from './Persona';
import { TipoDocumento } from './tipoDocumento';

export interface UsuarioInfo {
  id: string;
  username: string;
  email: string;
  persona: Persona;
  imagen: string;
  activo: boolean;
  roles: string[];
}

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

export interface HandleRegisterData {
  id: string
  tipoDocumentoId: number
  documento: string
  primerNombre: string
  segundoNombre: string
  primerApellido: string
  segundoApellido: string
  email: string
  imagen: string
  activo: boolean
}

export interface RegisterResponse {
  status: boolean
  mensaje: string
}
