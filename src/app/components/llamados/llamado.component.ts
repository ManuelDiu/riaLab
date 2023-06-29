import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Area } from 'src/app/models/area/area';
import { Llamado } from 'src/app/models/llamado/llamado';
import { AreaService } from 'src/app/services/areas/area.service';
import { LlamadoService } from 'src/app/services/llamado/llamado.service';

let timeoutInterval: any = null;
@Component({
  selector: 'app-llamado',
  templateUrl: './llamado.component.html',
  styleUrls: ['./llamado.component.scss'],
  providers: [MessageService, ConfirmationService],
  host: { class: 'w-full' },
})
export class LlamadoComponent implements OnInit {
  llamadosArr: Llamado[] = [];
  llamado: Llamado = {};
  visible: boolean = false;
  submitted: boolean = false;
  areaModal: boolean = false;
  isModifying: boolean = false;

  selectedLlamados: Llamado[] = [];
  openLlamadosModal: boolean = false;
  openMiembrosTribunalModal: boolean = false;
  selectedLlamadoItem?: Llamado = undefined;
  
  selectedArea?: any;
  areas: Area[] = [];

  // Estados de Services
  isLoading: boolean = false;
  public query: string = '';

  // Paginación
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  constructor(
    public llamadoService: LlamadoService,
    public areaService: AreaService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {}

  public handleLoad = (query: string = '') => {
    this.isLoading = true;
    this.llamadoService
      .getLlamadosPaged(this.currentRows, this.first, query)
      .subscribe((data: any) => {
        this.llamadosArr = data.list;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      });
  };

  public handleLoadAreas = () => {
    this.isLoading = true;
    this.areaService
      .getAreasPaged(1000, 0, "")
      .subscribe((data: any) => {
        this.areas = data.list;
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.handleLoad('');
    this.handleLoadAreas();
  }

  openNew() {
    this.llamado = {};
    this.submitted = false;
    this.areaModal = true;
  }

  public handleChangeEstado(event: any) {
    if (this.llamado) {
      this.llamado.activo = event?.checked;
    }
  }

  deleteselectedLlamados() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar las áreas seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedLlamados.forEach((llamado: Llamado) => {
          this.llamadoService
            .deleteLlamado(llamado.id as number)
            .subscribe((data) => {
              this.messageService.add({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'Llamado "' + llamado.nombre + '" eliminada',
                life: 2000,
              });
              // this.areasArr = this.areasArr.filter(
              //   (val) => val.id !== area.id
              // );
              // this.totalCount -= 1;
              this.refreshTable();
            });
        });
        this.llamado = {};
        this.selectedLlamados = [];
      },
    });
  }

  editLlamado(llamado: Llamado) {
    this.isModifying = true;
    this.llamado = { ...llamado };
    this.selectedArea = llamado.areaId;
    this.areaModal = true;
  }

  toggleLlamadosModal(llamado?: Llamado) {
    this.openLlamadosModal = !this.openLlamadosModal;
    this.selectedLlamadoItem = llamado;
  }

  toggleTribunalesModal(llamado?: Llamado) {
    this.openMiembrosTribunalModal = !this.openMiembrosTribunalModal;
    this.selectedLlamadoItem = llamado;
  }

  deleteLlamado(llamado: Llamado) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar el área ' + llamado.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.llamadoService
          .deleteLlamado(llamado.id as number)
          .subscribe((data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Área "' + llamado.nombre + '" eliminada',
              life: 2000,
            });
            // this.areasArr = this.areasArr.filter((val) => val.id !== area.id);
            // this.totalCount -= 1;
            this.refreshTable();
          });
        this.llamado = {};
        this.selectedLlamados = [];
      },
    });
  }

  hideDialog() {
    this.areaModal = false;
    this.submitted = false;
  }

  refreshTable() {
    this.isLoading = true;
    this.llamadoService
      .getLlamadosPaged(this.currentRows, this.first)
      .subscribe((data: any) => {
        this.llamadosArr = data?.list;
        this.totalCount = data?.totalCount;
        this.isLoading = false;
      });
  }

  saveLlamado() {
    this.submitted = true;
    const areaInfo = this.areas?.find((item: Area) => item.id === this.selectedArea)
    if (!areaInfo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Selecciona un llamado para continuar',
        life: 4000,
      });
      return;
    }
    this.llamado.areaId = areaInfo?.id;
    this.llamado.area = areaInfo;  
    if (this.isModifying) {
      if (this.llamado?.nombre) {
        this.llamadoService
          .updateLlamado(this.llamado.id as number, this.llamado)
          .subscribe(
            (data) => {
              this.refreshTable();
              this.messageService.add({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'Llamado Actualizado',
                life: 2000,
              });
              this.isModifying = false;
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al modificar el Llamado ' + this.llamado.nombre,
                life: 4000,
              });
              console.log(error);
              this.isModifying = false;
            }
          );
        this.areaModal = false;
        this.llamado = {};
      }
    } else {
      if (this.llamado?.nombre) {
        this.llamadoService.createLlamado(this.llamado).subscribe(
          (data) => {
            this.refreshTable();
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Área creada',
              life: 2000,
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el Llamado ' + this.llamado.nombre,
              life: 4000,
            });
            console.log(error);
          }
        );
        // if (this.totalCount < 5) {
        //   this.areasArr.push(this.area);
        // }
        // this.totalCount += 1;
        this.areaModal = false;
        this.llamado = {};
      }
    }
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.llamadoService
      .getLlamadosPaged(event.rows, event.first)
      .subscribe((data: any) => {
        this.llamadosArr = data.list;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      });
    this.first = event.first;
    this.currentRows = event.rows;
  }

  public handleSearch = (event: any) => {
    const text = event?.target?.value;
    this.query = text;
    clearTimeout(timeoutInterval);
    timeoutInterval = setTimeout(() => {
      this.handleLoad(text);
    }, 1000);
  };

  showDialog() {
    this.visible = true;
  }
}


