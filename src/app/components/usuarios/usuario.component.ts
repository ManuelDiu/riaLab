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
import { RoleService } from "src/app/services/roles/role.service";

let intervalSearch: any = null;

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.scss"],
  providers: [TipoDocumentoService],
  host: { class: "w-full" },
})
export class UsuarioComponent implements OnInit {
  // Atribs para el modal de registrar/editar user
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

  defaultImage: string | "" = "";

  // Mantenimiento de roles de usuario
  roleModal: boolean = false;
  rolesArr: string[] = []; // todos los roles de la base.
  selectedRole: string = "";

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
  isRolesLoading = false;

  // Paginación
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];
  public query: string = "";

  emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );

  constructor(
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private registerService: RegisterService,
    private tdocservice: TipoDocumentoService,
    private usuarioService: UsuarioService,
    private roleService: RoleService
  ) {}

  public handleLoadData = (query: string = "") => {
    this.isUsuariosLoading = true;
    this.usuarioService
      .getUsuariosPaged(this.currentRows, this.first, query)
      .subscribe((data: UsuarioResponse) => {
        this.usuariosArr = data.list;
        console.log("RESSS", data.list[0].imagen);
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
    this.isRolesLoading = true;
    this.roleService.getRoles().subscribe({
      next: (response) => {
        const data = response || [];
        this.rolesArr = data;
      },
      error: () => {
        console.log("error loading ");
      },
      complete: () => {
        this.isRolesLoading = false;
      },
    });
  };

  ngOnInit() {
    this.getBase64FromUrl(
      "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"
    );
    this.handleLoadData("");
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
      imagen: this.defaultImage,
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

  addRole() {
    this.roleService.addRole(this.usuario.id, this.selectedRole).subscribe({
      next: (response) => {
        this.usuario.roles.push(this.selectedRole);
        this.messageService.add({
          severity: "success",
          summary: "¡Éxito!",
          detail: "¡Rol agregado!",
          life: 2000,
        });
      },
      error: () => {
        console.log(this.usuario.id, this.selectedRole);
      },
    });
  }

  deleteRole(nombre: string) {
    this.roleService.deleteRole(this.usuario.id, nombre).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: "success",
          summary: "¡Éxito!",
          detail: "¡Rol Eliminado!",
          life: 2000,
        });
        let refresh = this.usuario.roles.filter((rol) => rol !== nombre);
        console.log(refresh);
        this.usuario.roles = refresh;
      },
      error: () => {
        console.log(this.usuario.id, this.selectedRole);
      },
    });
    // this.rolesArr = rolesSinSeleccionar;
    // this.roleModal = true;
  }

  editRoles(user: UsuarioInfo) {
    this.usuario = { ...user };
    let rolesSinSeleccionar = this.rolesArr.filter(
      (role) => !user.roles.includes(role)
    );
    this.rolesArr = rolesSinSeleccionar;
    this.roleModal = true;
  }

  hideDialog() {
    this.registerModal = false;
    this.submitted = false;
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
          complete: () => {
            this.handleLoadData("");
          }
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
        let defaultImage: any = this.getBase64FromUrl(
          "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"
        );
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
            imagen: this.usuario.imagen ? this.usuario.imagen : defaultImage,
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
            },
            () => {
            this.handleLoadData("");
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

  imageToBase64(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.usuario.imagen = reader.result as string;
      // console.log(reader.result);
    };
  }

  getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    }).then((response) => (this.defaultImage = response as string));
  };

  public handleSearch = (event: any) => {
    const text = event?.target?.value;
    this.query = text;
    clearTimeout(intervalSearch);
    intervalSearch = setTimeout(() => {
      this.handleLoadData(text);
    }, 1000);
  };
}
