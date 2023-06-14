import { Component, OnInit } from "@angular/core";
import { Message } from "primeng/api";
import { TipoDocumentoService } from "src/app/services/TipoDocumento/tipo-documento-service";
import { RegisterService } from "src/app/services/register/register.service";
import {
  HandleRegisterData,
  RegisterResponse,
  Usuario,
} from "src/app/types/Usuario";
import {
  TipoDocumento,
  TipoDocumentoResponse,
} from "src/app/types/tipoDocumento";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  providers: [TipoDocumentoService],
})
export class RegisterComponent implements OnInit {
  public documento: string = "";
  public primerNombre: string = "";
  public segundoNombre: string = "";
  public primerApellido: string = "";
  public segundoApellido: string = "";
  public email: string = "";
  public imagen: string = "";
  public activo: boolean = true;
  public alertsTypes: Message[] = [];
  public tiposDocumentos: TipoDocumento[] = [];
  public selectedTDoc: number | undefined = undefined;
  public isTDocLoading = false;

  constructor(
    private registerService: RegisterService,
    private tdocservice: TipoDocumentoService
  ) {}

  ngOnInit() {
    this.isTDocLoading = true;
    this.tdocservice.getTipoDocumentos().subscribe({
      next: (response) => {
        const data = response.body?.list || [];
        this.tiposDocumentos = data;
      },
      error: () => {
        console.log("error loading ");
      },
      complete: () => {
        this.isTDocLoading = false;
      },
    });
  }

  public handleRegister() {
    console.log(this.selectedTDoc);
    if(this.selectedTDoc === undefined){
      return;
    }
    // if (this.email.trim() != '' && this.password.trim() != '') {
    const dataToSend: HandleRegisterData = {
      id: '',
      tipoDocumentoId: this.selectedTDoc,
      documento: this.documento,
      primerNombre: this.primerNombre,
      segundoNombre: this.segundoNombre,
      primerApellido: this.primerApellido,
      segundoApellido: this.segundoApellido,
      email: this.email,
      imagen: this.imagen,
      activo: this.activo,
    };
    console.log('data to send: ', dataToSend)
    this.registerService.handleRegister(dataToSend).subscribe({
      next: (response: any) => {
        const responseInfo = response?.body as RegisterResponse;
        console.log(responseInfo);
      },
      error: (response: any) => {
        if (response?.error) {
          this.alertsTypes = [
            {
              severity: "error",
              summary: "Error",
              detail: "Credenciales incorrectas",
            },
          ];
        }
      },
    });
    //call to endpoint
    /* } else {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Rellena los campos antes de continuar',
        },
      ];
    } */
  }
}
