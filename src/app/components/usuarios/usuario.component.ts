import { Component, OnInit } from "@angular/core";
import { ConfirmationService, Message, MessageService } from "primeng/api";
import { TipoDocumentoService } from "src/app/services/TipoDocumento/tipo-documento-service";
import { RegisterService } from "src/app/services/register/register.service";
import { UsuarioService } from "src/app/services/usuarios/usuario.service";
import {
  HandleRegisterData,
  RegisterResponse,
  UsuarioInfo,
} from "src/app/types/Usuario";
import { UsuarioResponse } from "src/app/types/UsuarioResponse";
import {
  TipoDocumento,
  TipoDocumentoResponse,
} from "src/app/types/tipoDocumento";
import { Persona } from "src/app/types/Persona";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.scss"],
  providers: [TipoDocumentoService],
})
export class UsuarioComponent implements OnInit {
  // Atribs para el modal
  registerModal: boolean = false;
  documento: string = "";
  primerNombre: string = "";
  segundoNombre: string = "";
  primerApellido: string = "";
  segundoApellido: string = "";
  email: string = "";
  imagen: string = "";
  activo: boolean = true;
  alertsTypes: Message[] = [];
  tiposDocumentos: TipoDocumento[] = [];
  selectedTDoc: number | undefined = undefined;

  // Atributos para la tabla
  usuariosArr: UsuarioInfo[] = [];
  usuario: UsuarioInfo = {
    id: "",
    username: "",
    email: "",
    persona: {
      id: 0,
      activo: false,
      tipoDeDocumento: {
        id: undefined,
        activo: false,
        nombre: "",
      },
      documento: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
    },
    imagen: "",
    activo: false,
    roles: [],
  };
  selectedUsuarios: UsuarioInfo[] = [];
  visible: boolean = false;
  submitted: boolean = false;
  isModifying: boolean = false;

  // Estados de Services
  isUsuariosLoading: boolean = false;
  isTDocLoading = false;

  // Paginación
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );

  constructor(
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private registerService: RegisterService,
    private tdocservice: TipoDocumentoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.isUsuariosLoading = true;
    this.usuarioService
      .getUsuariosPaged(this.currentRows, this.first)
      .subscribe((data: UsuarioResponse) => {
        this.usuariosArr = data.list;
        this.totalCount = data.totalCount;
        this.isUsuariosLoading = false;
      });
    this.isTDocLoading = true;
    this.tdocservice.getTipoDocumentos(500, 0).subscribe({
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

  refreshTable() {
    this.isUsuariosLoading = true;
    this.usuarioService
      .getUsuariosPaged(this.currentRows, this.first)
      .subscribe((data: UsuarioResponse) => {
        this.usuariosArr = data.list;
        this.totalCount = data.totalCount;
        this.isUsuariosLoading = false;
      });
  }

  openNew() {
    this.isModifying = false;
    this.usuario = {
      id: "",
      username: "",
      email: "",
      persona: {
        id: 0,
        activo: false,
        tipoDeDocumento: {
          id: undefined,
          activo: false,
          nombre: "",
        },
        documento: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
      },
      imagen: "",
      activo: false,
      roles: [],
    };
    this.submitted = false;
    this.registerModal = true;
  }

  editUsuario(user: UsuarioInfo) {
    this.isModifying = true;
    this.usuario = { ...user };
    this.registerModal = true;
  }

  hideDialog() {
    this.registerModal = false;
    this.submitted = false;
    // this.isModifying = false;
  }

  public saveUsuario() {
    this.submitted = true;
    if (!this.isModifying) {
      if (this.selectedTDoc === undefined) {
        return;
      }
      if (this.validateFields()) {
        const dataToSend: HandleRegisterData = {
          id: "",
          tipoDocumentoId: this.selectedTDoc, // no modificable
          documento: this.usuario.persona.documento, // no modificable
          primerNombre: this.usuario.persona.primerNombre,
          segundoNombre: this.usuario.persona.segundoNombre,
          primerApellido: this.usuario.persona.primerApellido,
          segundoApellido: this.usuario.persona.segundoApellido,
          email: this.usuario.email, // no es modificable
          imagen: this.usuario.imagen,
          activo: this.usuario.activo,
        };

        this.registerService.handleRegister(dataToSend).subscribe({
          next: (response: any) => {
            const responseInfo = response?.body as RegisterResponse;
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Usuario Creado",
              life: 2000,
            });
            this.registerModal = false;
            this.selectedTDoc = undefined;
          },
          error: (response: any) => {},
        });
      }
    } else {
      if (this.usuario === undefined || this.usuario.persona === undefined) {
        this.usuario = {
          id: "",
          username: "",
          email: "",
          persona: {
            id: 0,
            activo: false,
            tipoDeDocumento: {
              id: undefined,
              activo: false,
              nombre: "",
            },
            documento: "",
            primerNombre: "",
            segundoNombre: "",
            primerApellido: "",
            segundoApellido: "",
          },
          imagen: "",
          activo: false,
          roles: [],
        };
        return;
      } else {
        if (this.validateFields()) {
          const dataToSend: HandleRegisterData = {
            id: this.usuario.id,
            tipoDocumentoId: this.usuario.persona.tipoDeDocumento.id, // no modificable
            documento: this.usuario.persona.documento, // no modificable
            primerNombre: this.usuario.persona.primerNombre,
            segundoNombre: this.usuario.persona.segundoNombre,
            primerApellido: this.usuario.persona.primerApellido,
            segundoApellido: this.usuario.persona.segundoApellido,
            email: this.usuario.email, // no es modificable
            imagen: this.usuario.imagen,
            activo: this.usuario.activo,
          };
          this.usuarioService.updateUsuario(dataToSend).subscribe(
            (data) => {
              // this.refreshTable();
              this.messageService.add({
                severity: "success",
                summary: "¡Éxito!",
                detail: "Usuario Actualizado",
                life: 2000,
              });
            },
            (error) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "Error al modificar el usuario '" +
                  this.usuario.persona.primerNombre +
                  " " +
                  this.usuario.persona.primerApellido +
                  "'",
                life: 4000,
              });
              console.log(error);
            }
          );
          this.registerModal = false;
          this.isModifying = false;
          this.selectedTDoc = undefined;
          this.usuario = {
            id: "",
            username: "",
            email: "",
            persona: {
              id: 0,
              activo: false,
              tipoDeDocumento: {
                id: undefined,
                activo: false,
                nombre: "",
              },
              documento: "",
              primerNombre: "",
              segundoNombre: "",
              primerApellido: "",
              segundoApellido: "",
            },
            imagen: "",
            activo: false,
            roles: [],
          };
        }
      }
    }
  }

  onPageChange(event: any) {
    this.isUsuariosLoading = true;
    this.usuarioService
      .getUsuariosPaged(event.rows, event.first)
      .subscribe((data: UsuarioResponse) => {
        this.usuariosArr = data.list;
        this.totalCount = data.totalCount;
        this.isUsuariosLoading = false;
      });
    this.first = event.first;
    this.currentRows = event.rows;
  }

  validateFields(): boolean {
    if (
      !this.selectedTDoc ||
      !this.usuario.persona.documento ||
      !this.usuario.persona.primerNombre ||
      !this.usuario.persona.primerApellido ||
      !this.usuario.email
    ) {
      return false;
    } else {
      if (!this.emailRegex.test(this.usuario.email) && !this.isModifying) {
        this.alertsTypes = [
          {
            severity: "error",
            summary: "Error",
            detail: "Formato de email incorrecto.",
          },
        ];
        return false;
      }
      return true;
    }
  }

  showDialog() {
    this.visible = true;
  }
}
