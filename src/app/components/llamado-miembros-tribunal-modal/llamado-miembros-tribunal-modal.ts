import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Llamado } from 'src/app/models/llamado/llamado';
import { LlamadoEstado } from 'src/app/types/LlamadoPosible';
import { LlamadoEstadoPosible } from '../../models/llamadoEP/estadoPosible';
import { LlamadoEPService } from 'src/app/services/llamadosEP/llamadoEP.service';
import { EstadoPosibleResponse } from 'src/app/types/LlamadoEPResponse';
import { LoggedUserService } from 'src/app/services/usuario/loggedUserService';
import { LlamadoService } from 'src/app/services/llamado/llamado.service';
import { MessageService } from 'primeng/api';
import { MiembroTribunal } from 'src/app/types/MiembroTribunal';
import { Persona } from 'src/app/types/Persona';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { TipoIntegranteService } from 'src/app/services/TipoIntegrante/tipo-integrante-service';
import { TipoIntegrante } from 'src/app/types/tipoIntegrante';

@Component({
  selector: 'lamado-miembros-tribunal-modal',
  templateUrl: './llamado-miembros-tribunal-modal.html',
  styleUrls: ['./llamado-miembros-tribunal-modal.scss'],
})
export class LlamadoMiembroTribunalModal {
  @Input() llamadoInfo: Llamado | any = null;
  @Input() openModal: boolean = false;
  @Output() toggleOpen = new EventEmitter();
  public miembroTribunalNuevo: MiembroTribunal | any = {};
  public selectMiembrosTribunal: MiembroTribunal[] = [];
  openNewModal: boolean = false;
  allPersonas: Persona[] = [];
  allTipoIntegrante: TipoIntegrante[] = [];

  selectedPersona: Persona | any;
  selectedTipoIntegrante: TipoIntegrante | any;
  selectedLlamadoEstadoPosible: LlamadoEstadoPosible | any = null;
  submitted = false;
  isEdit = false;
  isAdmin = false;

  constructor(
    public llamadoEPService: LlamadoEPService,
    public messageService: MessageService,
    public llamadoService: LlamadoService,
    public personasService: PersonaService,
    public tipoIntegrateService: TipoIntegranteService,
  ) {}

  ngOnInit() {
    const userInfo = LoggedUserService.userInfo;
    this.isAdmin = LoggedUserService.isAdmin(userInfo);
    this.personasService.getPersonasPaged(500, 0).subscribe({
      next: (data: any) => {
        this.allPersonas = data?.list?.map((item: Persona) => {
          return {
            ...item,
            completeNombre: `${item.primerNombre} ${item.primerApellido} -  ${item.documento}`
          }
        });
      },
      complete: () => {
        
      }
    });
    this.tipoIntegrateService.getTipoIntegrantes(500, 0, "").subscribe({
      next: (data: any) => {
        this.allTipoIntegrante = data?.body?.list?.map((item: TipoIntegrante) => {
          return {
            ...item,
            completeItem: `${item.nombre} - Orden:${item.orden}`
          }
        })?.sort((itemA: TipoIntegrante, itemB: TipoIntegrante) => {
          if (itemA?.orden < itemB?.orden) {
            return -1;
          } else {
            return 1;
          }
        });
      },
      complete: () => {
        
      }
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

  handleSubmit() {
    this.submitted = true;

    const personaInfo = this.allPersonas?.find(
      (item) => (item.id = this.selectedPersona)
    );

    const tipoIntegranteInfo = this.allTipoIntegrante?.find(
      (item) => (item.id = this.selectedTipoIntegrante)
    );

    if (this.isEdit) {
      this.llamadoService.updateMiembroTribunal(this.miembroTribunalNuevo).subscribe({
        next: (resp) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Miembro "' + personaInfo?.primerNombre + '" actualizado',
            life: 2000,
          });
        },
        complete: () => {
          this.openNewModal = false;
        }
      })
      return;
    }

    if (personaInfo && tipoIntegranteInfo) {
      this.miembroTribunalNuevo.activo = true;
      this.miembroTribunalNuevo.renuncia = false;
      this.miembroTribunalNuevo.motivoRenuncia = "";
      this.miembroTribunalNuevo.llamadoId = this.llamadoInfo?.id;
      this.miembroTribunalNuevo.personaId = personaInfo?.id;
      this.miembroTribunalNuevo.persona = personaInfo;
      this.miembroTribunalNuevo.tipoDeIntegranteId = tipoIntegranteInfo?.id;
      this.miembroTribunalNuevo.tipoDeIntegrante = tipoIntegranteInfo;

      const personaAlreadyExists = this.llamadoInfo?.miembrosTribunal?.find((item: MiembroTribunal) => {
        return item?.personaId === this.selectedPersona
      })
      console.log("personaAlreadyExists", personaAlreadyExists)

      if (personaAlreadyExists) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'La persona "' + personaInfo.primerNombre + '" ya es un miembro de este tribunal',
          life: 2000,
        });
        return;

      }

      this.llamadoService.createMiembroTribunal(this.miembroTribunalNuevo).subscribe({
        next: (resp) => {
          this.llamadoInfo?.miembrosTribunal?.push(resp);
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Miembro "' + personaInfo.primerNombre + '" agregada al tribunal de este llamado',
            life: 2000,
          });
        },
        complete: () => {
          this.openNewModal = false;
        }
      })
    }
  }

  openNew() {
    this.openNewModal = true;
    this.miembroTribunalNuevo = {};
    this.selectedPersona = null;
    this.selectedTipoIntegrante = null;
    this.isEdit = false;
  }

  handleEdit(miembroTrib: MiembroTribunal) {
    this.openNewModal = true;
    this.isEdit = true;
    this.miembroTribunalNuevo = miembroTrib;
    this.selectedPersona = miembroTrib.persona?.id;
    this.selectedTipoIntegrante = miembroTrib.tipoDeIntegrante?.id;
  }

  deleteMiembroTribunal(miembroTrib: MiembroTribunal) {
    this.llamadoService.deleteMiembroTribunal(miembroTrib).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado!',
          detail: 'Miembro del tribunal eliminado correctamente',
          life: 2000,
        });
        this.llamadoInfo.miembrosTribunal = this.llamadoInfo.miembrosTribunal?.filter((item: MiembroTribunal) => {
          return item?.id !== miembroTrib?.id
        })
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Error al borrar este usuario del tribunal',
          life: 2000,
        });
      }
    })
  }
}
