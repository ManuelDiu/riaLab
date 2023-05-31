import { TipoDocumento } from 'src/models/tipoDocumento';

export class TipoDocumentoService {
  public tipoDocumentos: TipoDocumento[] = [
    {
      id: 1,
      nombre: 'Cedula',
      activo: true,
    },
  ];
}
