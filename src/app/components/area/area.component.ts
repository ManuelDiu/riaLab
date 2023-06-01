import { Component, OnInit } from "@angular/core";
import { Area } from "src/app/models/area";
import { AreaService } from "src/app/services/area.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AreaResponse } from "src/app/types/AreaResponse";

@Component({
  selector: "app-area",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
  providers: [MessageService, ConfirmationService],
})
export class AreaComponent implements OnInit {
  listaAreas: Area[] = [];
  area: Area = {};
  visible: boolean = false;
  submitted: boolean = false;
  areaModal: boolean = false;
  isModifying: boolean = false;

  selectedAreas: Area[] = [];

  // Estados de Services
  isLoading: boolean = false;

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

  ngOnInit() {
    this.isLoading = true;
    this.areaService
      .getAreasPaged(this.currentRows, this.first)
      .subscribe((data: AreaResponse) => {
        this.listaAreas = data.list;
        this.totalCount = data.totalCount;
        console.log("data del get:", data);
        this.isLoading = false;
      });
    console.log("cant areas: ", this.listaAreas.length == 0);
  }

  openNew() {
    console.log("current areas: ", this.listaAreas);
    this.area = {};
    this.submitted = false;
    this.areaModal = true;
  }

  deleteSelectedAreas() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected products?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log(this.selectedAreas);
        this.selectedAreas.forEach((area: Area) => {
          this.areaService.deleteArea(area.id as number).subscribe((data) => {
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Area Eliminada",
              life: 2000,
            });
            // this.listaAreas = this.listaAreas.filter(
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
      message: "Are you sure you want to delete " + area.nombre + "?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log(this.selectedAreas);
        this.areaService.deleteArea(area.id as number).subscribe((data) => {
          this.messageService.add({
            severity: "success",
            summary: "¡Éxito!",
            detail: "Area Eliminada",
            life: 2000,
          });
          // this.listaAreas = this.listaAreas.filter((val) => val.id !== area.id);
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
        this.listaAreas = data.list;
        this.totalCount = data.totalCount;
        console.log("data del get:", data);
        this.isLoading = false;
      });
  }

  saveArea() {
    this.submitted = true;
    this.area.activo = true;
    if (this.isModifying) {
      if (this.area?.nombre) {
        this.areaService.updateArea(this.area.id as number, this.area).subscribe(
          (data) => {
            this.refreshTable();
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Area Actualizada",
              life: 2000,
            });
            this.isModifying = false;
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error al crear el Area " + this.area.nombre,
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
              severity: "success",
              summary: "¡Éxito!",
              detail: "Area Creada",
              life: 2000,
            });
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error al crear el Area " + this.area.nombre,
              life: 4000,
            });
            console.log(error);
          }
        );
        // if (this.totalCount < 5) {
        //   this.listaAreas.push(this.area);
        // }
        // this.totalCount += 1;
        this.areaModal = false;
        this.area = {};
      }
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.listaAreas.length; i++) {
      if (this.listaAreas[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.areaService
      .getAreasPaged(event.rows, event.first)
      .subscribe((data: AreaResponse) => {
        this.listaAreas = data.list;
        this.totalCount = data.totalCount;
        console.log("data del get:", data);
        this.isLoading = false;
      });
    this.first = event.first;
    this.currentRows = event.rows;
  }

  showDialog() {
    this.visible = true;
  }

  createArea() {
    this.areaService.createArea(this.area).subscribe((data) => {
      console.log(data);
    });
  }
}
