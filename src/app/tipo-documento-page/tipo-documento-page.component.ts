import { Component } from '@angular/core';
import { TipoDocumentoService } from '../services/tipo-documento-service';
import { TipoDocumento } from 'src/models/tipoDocumento';

@Component({
  selector: 'app-tipo-documento-page',
  templateUrl: './tipo-documento-page.component.html',
  styleUrls: ['./tipo-documento-page.component.scss'],
  providers: [TipoDocumentoService]
})
export class TipoDocumentoPageComponent {
  public tipoDocumentos: TipoDocumento[] = [];

  constructor(private tdservice: TipoDocumentoService) {}

  ngOnInit() {
    this.tipoDocumentos = this.tdservice.tipoDocumentos;

    console.log(this.tipoDocumentos)
  }
  
}
