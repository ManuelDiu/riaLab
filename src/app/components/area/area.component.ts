import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area/area';
import { AreaService } from 'src/app/services/areas/area.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AreaResponse } from 'src/app/types/AreaResponse';

let timeoutInterval: any = null;
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  providers: [MessageService, ConfirmationService],
  host: { class: 'w-full' },
})
export class AreaComponent implements OnInit {
  areasArr: Area[] = [];
  area: Area = {};
  visible: boolean = false;
  submitted: boolean = false;
  areaModal: boolean = false;
  isModifying: boolean = false;

  selectedAreas: Area[] = [];

  // Estados de Services
  isLoading: boolean = false;
  public query: string = '';

  // Paginación
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  constructor(
    public areaService: AreaService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {}

  public handleLoad = (query: string = '') => {
    this.isLoading = true;
    this.areaService
      .getAreasPaged(this.currentRows, this.first, query)
      .subscribe((data: AreaResponse) => {
        this.areasArr = data.list;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.handleLoad('');
  }

  openNew() {
    this.area = {};
    this.submitted = false;
    this.areaModal = true;
  }

  public handleChangeEstado(event: any) {
    if (this.area) {
      this.area.activo = event?.checked;
    }
  }

  deleteSelectedAreas() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar las áreas seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedAreas.forEach((area: Area) => {
          this.areaService.deleteArea(area.id as number).subscribe((data) => {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Área "' + area.nombre + '" eliminada',
              life: 2000,
            });
            // this.areasArr = this.areasArr.filter(
            //   (val) => val.id !== area.id
            // );
            // this.totalCount -= 1;
            this.refreshTable();
          });
        });
        this.area = {};
        this.selectedAreas = [];
      },
    });
  }

  editArea(area: Area) {
    this.isModifying = true;
    this.area = { ...area };
    this.areaModal = true;
  }

  deleteArea(area: Area) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar el área ' + area.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.areaService.deleteArea(area.id as number).subscribe((data) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Área "' + area.nombre + '" eliminada',
            life: 2000,
          });
          // this.areasArr = this.areasArr.filter((val) => val.id !== area.id);
          // this.totalCount -= 1;
          this.refreshTable();
        });
        this.area = {};
        this.selectedAreas = [];
      },
    });
  }

  hideDialog() {
    this.areaModal = false;
    this.submitted = false;
  }

  refreshTable() {
    this.isLoading = true;
    this.areaService
      .getAreasPaged(this.currentRows, this.first)
      .subscribe((data: AreaResponse) => {
        this.areasArr = data.list;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      });
  }

  saveArea() {
    this.submitted = true;
    if (this.isModifying) {
      if (this.area?.nombre) {
        this.areaService
          .updateArea(this.area.id as number, this.area)
          .subscribe(
            (data) => {
              this.refreshTable();
              this.messageService.add({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'Area Actualizada',
                life: 2000,
              });
              this.isModifying = false;
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al modificar el Area ' + this.area.nombre,
                life: 4000,
              });
              console.log(error);
              this.isModifying = false;
            }
          );
        this.areaModal = false;
        this.area = {};
      }
    } else {
      if (this.area?.nombre) {
        this.areaService.createArea(this.area).subscribe(
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
              detail: 'Error al crear el Área ' + this.area.nombre,
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
        this.area = {};
      }
    }
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.areaService
      .getAreasPaged(event.rows, event.first)
      .subscribe((data: AreaResponse) => {
        this.areasArr = data.list;
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
