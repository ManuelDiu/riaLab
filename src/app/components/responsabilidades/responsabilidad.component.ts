import { Component, OnInit } from "@angular/core";
import { Area } from "src/app/models/area/area";
import { AreaService } from "src/app/services/areas/area.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AreaResponse } from "src/app/types/AreaResponse";
import { Responsabilidad } from "src/app/types/Responsabilidad";
import { ResponsabilidadService } from "src/app/services/responsabilidades/responsabilidad.service";
import { ResponsabilidadResponse } from "src/app/types/ResponsabilidadResponse";

let timeoutInterval: any = null;
@Component({
  selector: "app-responsabilidad",
  templateUrl: "./responsabilidad.component.html",
  styleUrls: ["./responsabilidad.component.scss"],
  providers: [MessageService, ConfirmationService],
  host: { class: "w-full" },
})
export class ResponsabilidadComponent implements OnInit {
  responsabilidadesArray: Responsabilidad[] = [];
  responsabilidad: Responsabilidad = {
    id: 0,
    activo: false,
    nombre: "",
    descripcion: "",
    area: undefined,
    areaId: 0,
  };
  areasArray: Area[] = [];
  selectedArea: Area | undefined = undefined;
  visible: boolean = false;
  submitted: boolean = false;
  responsabilidadModal: boolean = false;
  isModifying: boolean = false;

  selectedResponsabilidades: Responsabilidad[] = [];

  // Estados de Services
  isLoading: boolean = false;
  isAreasLoading: boolean = false;
  query: string = "";

  // Paginación
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  constructor(
    public ResponsabilidadService: ResponsabilidadService,
    public AreaService: AreaService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
  ) {}

  public handleLoad = (query: string = "") => {
    this.isLoading = true;
    this.ResponsabilidadService.getResponsabilidadesPaged(
      this.currentRows,
      this.first,
      query
    ).subscribe((data: ResponsabilidadResponse) => {
      this.responsabilidadesArray = data.list;
      this.totalCount = data.list.length;
      this.isLoading = false;
    });

    this.isAreasLoading = true;
    this.AreaService
      .getAreasPaged(-1, 0, query)
      .subscribe((data: AreaResponse) => {
        this.areasArray = data.list;
        this.isAreasLoading = false;
      });
  };

  ngOnInit() {
    this.handleLoad("");
  }

  openNew() {
    this.responsabilidad = {
      id: 0,
      activo: false,
      nombre: "",
      descripcion: "",
      area: undefined,
      areaId: 0,
    };
    this.submitted = false;
    this.responsabilidadModal = true;
  }

  public handleChangeEstado(event: any) {
    if (this.responsabilidad) {
      this.responsabilidad.activo = event?.checked;
    }
  }

  deleteSelectedResponsabilidades() {
    this.confirmationService.confirm({
      message:
        "¿Estás seguro de que quieres eliminar las responsabilidades seleccionadas?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.selectedResponsabilidades.forEach((resp: Responsabilidad) => {
          this.ResponsabilidadService.deleteResponsabilidad(
            resp.id as number
          ).subscribe((data) => {
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: `Responsabilidad ${resp.nombre} eliminada`,
              life: 5000,
            });
            this.refreshTable();
          });
        });
        this.responsabilidad = {
          id: 0,
          activo: false,
          nombre: "",
          descripcion: "",
          area: undefined,
          areaId: 0,
        };
        this.selectedResponsabilidades = [];
      },
    });
  }

  editResponsabilidad(resp: Responsabilidad) {
    this.isModifying = true;
    this.responsabilidad = { ...resp };
    this.responsabilidadModal = true;
  }

  deleteResponsabilidad(resp: Responsabilidad) {
    this.confirmationService.confirm({
      message: `¿Confirma que desea eliminar la responsabilidad '${resp.nombre}'?`,
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log(this.selectedResponsabilidades);
        this.ResponsabilidadService.deleteResponsabilidad(
          resp.id as number
        ).subscribe((data) => {
          this.messageService.add({
            severity: "success",
            summary: "¡Éxito!",
            detail: `Responsabilidad '${resp.nombre}' eliminada.`,
            life: 2000,
          });
          // this.areasArr = this.areasArr.filter((val) => val.id !== area.id);
          // this.totalCount -= 1;
          this.refreshTable();
        });
        this.responsabilidad = {
          id: 0,
          activo: false,
          nombre: "",
          descripcion: "",
          area: undefined,
          areaId: 0,
        };
        this.selectedResponsabilidades = [];
      },
    });
  }

  hideDialog() {
    this.responsabilidadModal = false;
    this.submitted = false;
    this.selectedArea = undefined;
  }

  refreshTable() {
    this.isLoading = true;
    this.ResponsabilidadService.getResponsabilidadesPaged(
      this.currentRows,
      this.first
    ).subscribe((data: ResponsabilidadResponse) => {
      this.responsabilidadesArray = data.list;
      this.totalCount = data.totalCount;
      this.isLoading = false;
    });
  }

  saveResponsabilidad() {
    this.responsabilidad.areaId = this.responsabilidad.area?.id || 0;
    this.submitted = true;
    if (this.isModifying) {
      if (this.responsabilidad?.nombre) {
        this.ResponsabilidadService.updateResponsabilidad(
          this.responsabilidad.id as number,
          this.responsabilidad
        ).subscribe(
          (data) => {
            this.refreshTable();
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Responsabilidad Actualizada.",
              life: 2000,
            });
            this.isModifying = false;
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Error al modificar la responsabilidad ${this.responsabilidad.nombre}.`,
              life: 4000,
            });
            console.log(error);
            this.isModifying = false;
          }
        );
        this.responsabilidadModal = false;
        this.responsabilidad = {
          id: 0,
          activo: false,
          nombre: "",
          descripcion: "",
          area: undefined,
          areaId: 0,
        };
      }
    } else {
      if (this.responsabilidad?.nombre) {
        this.ResponsabilidadService.createResponsabilidad(
          this.responsabilidad
        ).subscribe(
          (data) => {
            this.refreshTable();
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Responsabilidad creada.",
              life: 2000,
            });
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: `Error al crear la responsabilidad ${this.responsabilidad.nombre}`,
              life: 4000,
            });
            console.log(error);
          }
        );
        // if (this.totalCount < 5) {
        //   this.areasArr.push(this.area);
        // }
        // this.totalCount += 1;
        this.responsabilidadModal = false;
        this.responsabilidad = {
          id: 0,
          activo: false,
          nombre: "",
          descripcion: "",
          area: undefined,
          areaId: 0,
        };
      }
    }
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.ResponsabilidadService.getResponsabilidadesPaged(
      event.rows,
      event.first
    ).subscribe((data: ResponsabilidadResponse) => {
      this.responsabilidadesArray = data.list;
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
