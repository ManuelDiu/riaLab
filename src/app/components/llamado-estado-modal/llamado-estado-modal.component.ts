import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Llamado } from 'src/app/models/llamado/llamado';
import { LlamadoEstado } from 'src/app/types/LlamadoPosible';
import { LlamadoEstadoPosible } from '../../models/llamadoEP/estadoPosible';
import { LlamadoEPService } from 'src/app/services/llamadosEP/llamadoEP.service';
import { EstadoPosibleResponse } from 'src/app/types/LlamadoEPResponse';
import { LoggedUserService } from 'src/app/services/usuario/loggedUserService';
import { LlamadoService } from 'src/app/services/llamado/llamado.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-llamado-estado-modal',
  templateUrl: './llamado-estado-modal.component.html',
  styleUrls: ['./llamado-estado-modal.component.scss']
})
export class LlamadoEstadoModalComponent {
  @Input() llamadoInfo: Llamado | any = null;
  @Input() openModal: boolean = false;
  @Output() toggleOpen = new EventEmitter();
  public llamadoEstadoNuevo: LlamadoEstado | any = {};
  public selectedLlamadoEstados: LlamadoEstado[] = []
  openNewModal: boolean = false;
  allEstadosPosibles: LlamadoEstadoPosible[] = [];
  selectedLlamadoEstadoPosible: LlamadoEstadoPosible | any = null;
  submitted = false;
  isCordinador = false;

  constructor(
    public llamadoEPService: LlamadoEPService,
    public messageService: MessageService,
    public llamadoService: LlamadoService,
  ) {}



  ngOnInit(){
    const userInfo = LoggedUserService.userInfo;
    const isAdmin = LoggedUserService.isAdmin(userInfo);
    const isCordinador = LoggedUserService.isCordinador(userInfo);
    const isTribunal = LoggedUserService.isTribunal(userInfo);
    this.isCordinador = isCordinador;

    this.llamadoEPService
    .getEstadosPosiblesPaged(500, 0 , "")
    .subscribe((data: EstadoPosibleResponse) => {
      if (isAdmin) {
        this.allEstadosPosibles = data.list?.filter((item: any) => {
          return item?.id !== 3 && item?.id !== 2;
        })
        return;
      }
      if (isTribunal) {
        this.allEstadosPosibles = data.list?.filter((item: any) => {
          return item?.id === 3 || item?.id === 2;
        })
        return;
      }
      this.allEstadosPosibles = data.list;
    });
  }

  hideDialog() {
    this.openNewModal = false;
  }

  handleCloseModal(){
    if (this.toggleOpen) {
      this.toggleOpen.emit(null);
    }
  }

  handleSubmit() {
    this.submitted = true;
    const lus = new LoggedUserService();
    lus.handleLoadUserInfo();
    const userInfo = LoggedUserService.userInfo;

    const llamadoEstadoPosibleInfo = this.allEstadosPosibles?.find((item) => item.id = this.selectedLlamadoEstadoPosible)

    if (llamadoEstadoPosibleInfo) {
      this.llamadoEstadoNuevo.activo = true;
      this.llamadoEstadoNuevo.llamadoEstadoPosible = llamadoEstadoPosibleInfo;
      this.llamadoEstadoNuevo.llamadoEstadoPosibleId = llamadoEstadoPosibleInfo.id;
      this.llamadoEstadoNuevo.llamadoId = this.llamadoInfo.id;
      this.llamadoEstadoNuevo.usuarioTransicion = userInfo?.email;
      
      this.llamadoService.createEstadoLlamado(this.llamadoEstadoNuevo).subscribe({
        next: () => {
          this.llamadoInfo.llamadoEstados?.push(this.llamadoEstadoNuevo);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: '¡Error!',
            detail: "Error agergando al historial de estados",
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
  }
}
