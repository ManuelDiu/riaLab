import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Llamado } from 'src/app/models/llamado/llamado';
import { LlamadoEstado } from 'src/app/types/LlamadoPosible';
import { LlamadoEstadoPosible } from '../../models/llamadoEP/estadoPosible';
import { LlamadoEPService } from 'src/app/services/llamadosEP/llamadoEP.service';
import { LlamadoService } from 'src/app/services/llamado/llamado.service';
import { MessageService } from 'primeng/api';
import { MiembroTribunal } from 'src/app/types/MiembroTribunal';
import { Persona } from 'src/app/types/Persona';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { TipoDocumentoService } from 'src/app/services/TipoDocumento/tipo-documento-service';
import { TipoDocumento } from 'src/app/types/tipoDocumento';
import { Postulante } from 'src/app/types/Postulante';
import { LoggedUserService } from 'src/app/services/usuario/loggedUserService';

let timeoutInterval: any = null;
@Component({
  selector: 'llamado-postulantes-modal',
  templateUrl: './llamado-postulantes-modal.html',
  styleUrls: ['./llamado-postulantes-modal.scss'],
})
export class LlamadoPostulantesModal {
  @Input() llamadoInfo: Llamado | any = null;
  @Input() openModal: boolean = false;
  @Output() toggleOpen = new EventEmitter();
  query = '';
  isAdmin = false;
  isTribunal = false;

  public postulanteNuevo: Postulante | any = {
    id: 0,
    activo: false,
    fechaHoraEntrevista: '',
    estudioMeritosRealizado: false,
    entrevistaRealizada: false,
    llamadoId: this.llamadoInfo?.id,
    personaId: 0,
    persona: undefined,
  };
  selectPostulantes: Postulante[] = [];
  openNewModal: boolean = false;
  allPostulantes: Postulante[] = [];
  personaFound: Persona | any = null;
  allTipoDocumento: TipoDocumento[] = [];

  selectedTipoDocumento: TipoDocumento | any = null;
  selectedLlamadoEstadoPosible: LlamadoEstadoPosible | any = null;
  submitted = false;
  isModifying = false;

  constructor(
    public llamadoEPService: LlamadoEPService,
    public messageService: MessageService,
    public llamadoService: LlamadoService,
    public personasService: PersonaService,
    public tipoDocumentoService: TipoDocumentoService
  ) {}

  public handleLoad = (query: string = '') => {
    this.llamadoService.getPostulantesPaged(500, 0).subscribe({
      next: (data: any) => {
        this.allPostulantes = data?.list?.map((item: Postulante) => {
          return {
            ...item,
            completeNombre: `${item.persona?.primerNombre} ${item.persona?.primerApellido} -  ${item.persona?.documento}`,
          };
        });
      },
      complete: () => {},
    });
  };

  public handleSearchPersona = (
    tipoDocumento: number,
    documento: string = ''
  ) => {
    if (
      this.selectedTipoDocumento &&
      this.postulanteNuevo.persona.documento !== ''
    ) {
      this.personasService
        .getPersonaByDocumento(tipoDocumento, documento)
        .subscribe({
          next: (data: any) => {
            this.personaFound = data;
            data !== null
              ? (this.postulanteNuevo.persona = data)
              : (this.postulanteNuevo.persona = {
                  id: 0,
                  activo: true,
                  tipoDeDocumento: this.selectedTipoDocumento,
                  documento: this.postulanteNuevo.persona.documento,
                  primerNombre: '',
                  segundoNombre: '',
                  primerApellido: '',
                  segundoApellido: '',
                });
          },
          complete: () => {},
        });
      /* this.tipoDocumentoService.getTipoDocumentos(500, 0, "").subscribe({
        next: (data: any) => {
          this.allTipoDocumento = data.body?.list;
        },
        complete: () => {},
      }); */
    } else if (this.postulanteNuevo.persona.documento === '') {
      this.postulanteNuevo.persona = {
        id: 0,
        activo: true,
        tipoDeDocumento: this.selectedTipoDocumento,
        documento: this.postulanteNuevo.persona.documento,
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
      };
      this.personaFound = null;
    }
  };

  ngOnInit() {
    const userInfo = LoggedUserService.userInfo;
    this.isAdmin = LoggedUserService.isAdmin(userInfo);
    this.isTribunal = LoggedUserService.isTribunal(userInfo);
    this.handleLoad('');
    this.tipoDocumentoService.getTipoDocumentos(500, 0, '').subscribe({
      next: (data: any) => {
        this.allTipoDocumento = data.body?.list;
      },
      complete: () => {},
    });
  }

  hideDialog() {
    this.openNewModal = false;
  }

  handleCloseModal() {
    if (this.toggleOpen) {
      this.toggleOpen.emit(null);
    }
  }

  validateFields(): boolean {
    console.log( (this.postulanteNuevo.entrevistaRealizada &&
      this.postulanteNuevo.fechaHoraEntrevista === ''))
    if (
      !this.postulanteNuevo ||
      !this.selectedTipoDocumento ||
      !this.postulanteNuevo.persona.documento ||
      !this.postulanteNuevo.persona.primerNombre ||
      !this.postulanteNuevo.persona.primerApellido ||
      (this.postulanteNuevo.entrevistaRealizada &&
        this.postulanteNuevo.fechaHoraEntrevista === '')
    ) {
      return false;
    } else {
      return true;
    }
  }

  handleSubmit() {
    this.submitted = true;

    if (!this.validateFields()) {
      return;
    }

    if (this.isModifying) {
      this.llamadoService.updatePostulante(this.postulanteNuevo).subscribe({
        next: (resp) => {
          this.llamadoInfo.postulantes = this.llamadoInfo.postulantes.map(
            (item: Postulante) => {
              if (item.id === resp?.id) {
                return resp;
              }
              return item;
            }
          );
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail:
              'Postulante "' +
              this.postulanteNuevo?.persona?.primerNombre +
              '" actualizado',
            life: 3000,
          });
        },
        complete: () => {
          this.hideDialog();
        },
      });
      return;
    }

    if (this.postulanteNuevo.fechaHoraEntrevista === "") {
      this.postulanteNuevo.fechaHoraEntrevista = null;
    }

    if (this.personaFound) {
      // Ingresó un documento existente para una persona X, solo la agregamos como postulante.
      this.postulanteNuevo.personaId = this.postulanteNuevo.persona.id;

      const personaAlreadyExists = this.llamadoInfo?.postulantes?.find(
        (item: Postulante) => {
          return item?.personaId === this.postulanteNuevo?.persona?.id;
        }
      );

      if (personaAlreadyExists) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail:
            'La persona "' +
            this.postulanteNuevo?.persona?.primerNombre +
            '" ya es un postulante para este llamado.',
          life: 5000,
        });
        return;
      }

      // this.postulanteNuevo.id = 0;
      this.llamadoService
        .createPostulante(this.postulanteNuevo as Postulante)
        .subscribe({
          next: (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Agegado!',
              detail: 'Postulante agregado correctamente',
              life: 3000,
            });
            this.llamadoInfo.postulantes.push({
              ...data,
              completeNombre: `${data.persona?.primerNombre} ${data.persona?.primerApellido} -  ${data.persona?.documento}`,
            });
          },
          error: (err) => {
            console.log('Error al crear el postulante: ', err);
          },
          complete: () => {
            this.hideDialog();
          },
        });

      this.submitted = false;
    } else {
      // NO ingresó un documento existente de una persona, primero la creamos y luego la añadimos como postulante.
      this.personasService
        .createPersona(this.postulanteNuevo.persona as Persona)
        .subscribe({
          next: (data: any) => {
            this.postulanteNuevo.personaId = data?.id;
            this.postulanteNuevo.persona.id = data?.id;
            this.llamadoService
              .createPostulante(this.postulanteNuevo as Postulante)
              .subscribe({
                next: (data: any) => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Agegado!',
                    detail: 'Postulante agregado correctamente',
                    life: 3000,
                  });
                  this.llamadoInfo.postulantes.push({
                    ...data,
                    completeNombre: `${data.persona?.primerNombre} ${data.persona?.primerApellido} -  ${data.persona?.documento}`,
                  });
                },
                error: (err) => {
                  console.log('Error al crear el postulante: ', err);
                },
                complete: () => {
                  this.hideDialog();
                },
              });

            this.allPostulantes = data?.list?.map((item: Postulante) => {
              return {
                ...item,
                completeNombre: `${item.persona?.primerNombre} ${item.persona?.primerApellido} -  ${item.persona?.documento}`,
              };
            });
          },
          error: (err) => {
            console.log('Error al crear la persona ', err);
          },
          complete: () => {},
        });

      this.submitted = false;
    }
  }

  public handleSearch = (event: any) => {
    const doc = event?.target?.value;
    clearTimeout(timeoutInterval);
    timeoutInterval = setTimeout(() => {
      this.handleSearchPersona(this.selectedTipoDocumento.id, doc);
    }, 1000);
  };

  public handleSearchPostulante = (event: any) => {
    const doc = event?.target?.value;
    this.query = doc;
    clearTimeout(timeoutInterval);
    timeoutInterval = setTimeout(() => {
      this.llamadoService.getPostulantesPaged(500, 0, this.query).subscribe({
        next: (data: any) => {
          this.allPostulantes = data?.list?.map((item: Postulante) => {
            return {
              ...item,
              completeNombre: `${item.persona?.primerNombre} ${item.persona?.primerApellido} -  ${item.persona?.documento}`,
            };
          });
        },
        complete: () => {},
      });
    }, 1000);
  };

  openNew() {
    this.openNewModal = true;
    this.postulanteNuevo = {
      id: 0,
      activo: false,
      fechaHoraEntrevista: '',
      estudioMeritosRealizado: false,
      entrevistaRealizada: false,
      llamadoId: this.llamadoInfo?.id,
      personaId: 0,
      persona: {
        id: 0,
        activo: true,
        tipoDeDocumento: {
          id: 0,
          activo: true,
          nombre: '',
        },
        documento: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
      },
    };
    this.selectedTipoDocumento = null;
    this.isModifying = false;
    this.submitted = false;
  }

  handleEdit(post: Postulante) {
    this.openNewModal = true;
    this.isModifying = true;
    this.postulanteNuevo = { ...post };
    this.postulanteNuevo.fechaHoraEntrevista = new Date(
      post.fechaHoraEntrevista
    );
    this.selectedTipoDocumento = post.persona?.tipoDeDocumento;
    this.submitted = false;
  }

  deleteMiembroTribunal(postul: Postulante) {
    this.llamadoService.deletePostulante(postul.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado!',
          detail: 'Postulante eliminado correctamente',
          life: 2000,
        });
        this.llamadoInfo.postulantes = this.llamadoInfo.postulantes?.filter(
          (item: Postulante) => {
            return item?.id !== postul?.id;
          }
        );
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Error al borrar este usuario del tribunal',
          life: 2000,
        });
      },
    });
  }
}
