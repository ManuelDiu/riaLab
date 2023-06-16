import { Component, OnInit } from "@angular/core";
import { LlamadoEstadoPosible } from "src/app/models/llamadoEP/estadoPosible";
import { LlamadoEPService } from "src/app/services/llamadosEP/llamadoEP.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { EstadoPosibleResponse } from "src/app/types/LlamadoEPResponse";

@Component({
  selector: "app-llamadosEP",
  templateUrl: "./llamadosEP.component.html",
  styleUrls: ["./llamadosEP.component.scss"],
  providers: [MessageService, ConfirmationService],
  host: {'class': 'w-full'}
})
export class LlamadosEPComponent implements OnInit {
  estadosArray: LlamadoEstadoPosible[] = [];
  currentEstadoPosible: LlamadoEstadoPosible = {};
  visible: boolean = false;
  submitted: boolean = false;
  estadoModal: boolean = false;
  isModifying: boolean = false;

  selectedEstados: LlamadoEstadoPosible[] = [];

  // Estados de Services
  isLoading: boolean = false;

  // Paginación
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  constructor(
    public llamadoEPService: LlamadoEPService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.llamadoEPService
      .getEstadosPosiblesPaged(this.currentRows, this.first)
      .subscribe((data: EstadoPosibleResponse) => {
        this.estadosArray = data.list;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      });
  }

  openNew() {
    this.currentEstadoPosible = {};
    this.submitted = false;
    this.estadoModal = true;
  }

  deleteSelectedEstados() {
    this.confirmationService.confirm({
      message:
        "¿Estás seguro de que quieres eliminar los estados seleccionados?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.selectedEstados.forEach((estado: LlamadoEstadoPosible) => {
          this.llamadoEPService
            .deleteEstadoPosible(estado.id as number)
            .subscribe((data) => {
              this.messageService.add({
                severity: "success",
                summary: "¡Éxito!",
                detail: "Estado \"" + estado.nombre + "\" eliminado",
                life: 2000,
              });
              this.refreshTable();
            });
        });
        this.currentEstadoPosible = {};
        this.selectedEstados = [];
      },
    });
  }

  editEstado(estadoP: LlamadoEstadoPosible) {
    this.isModifying = true;
    this.currentEstadoPosible = { ...estadoP };
    this.estadoModal = true;
  }

  public handleChangeEstado(event:any) {
    if (this.currentEstadoPosible) {
      console.log("event.checked", event?.checked)
      this.currentEstadoPosible.activo = event?.checked;
    }
  }

  deleteEstado(estadoP: LlamadoEstadoPosible) {
    this.confirmationService.confirm({
      message:
        "¿Estás seguro de que deseas eliminar el estado " + estadoP.nombre + "?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        console.log(this.selectedEstados);
        this.llamadoEPService
          .deleteEstadoPosible(estadoP.id as number)
          .subscribe((data) => {
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Estado \""+ estadoP.nombre +"\" eliminado",
              life: 2000,
            });
            this.refreshTable();
          });
        this.currentEstadoPosible = {};
        this.selectedEstados = [];
      },
    });
  }

  hideDialog() {
    this.estadoModal = false;
    this.submitted = false;
  }

  refreshTable() {
    this.isLoading = true;
    this.llamadoEPService
      .getEstadosPosiblesPaged(this.currentRows, this.first)
      .subscribe((data: EstadoPosibleResponse) => {
        this.estadosArray = data.list;
        this.totalCount = data.totalCount;
        console.log("data del get:", data);
        this.isLoading = false;
      });
  }

  saveEstadoPosible() {
    this.submitted = true;
    if (this.isModifying) {
      if (this.currentEstadoPosible?.nombre) {
        console.log("currentEstadoPosible", this.currentEstadoPosible)
        this.llamadoEPService
          .updateEstadoPosible(
            this.currentEstadoPosible.id as number,
            this.currentEstadoPosible
          )
          .subscribe(
            (data) => {
              this.refreshTable();
              this.messageService.add({
                severity: "success",
                summary: "¡Éxito!",
                detail: "Estado Actualizado",
                life: 2000,
              });
              this.isModifying = false;
            },
            (error) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail:
                  "Error al crear el Estado " +
                  this.currentEstadoPosible.nombre,
                life: 4000,
              });
              console.log(error);
              this.isModifying = false;
            }
          );
        this.estadoModal = false;
        this.currentEstadoPosible = {};
      }
    } else {
      if (this.currentEstadoPosible?.nombre) {
        this.llamadoEPService.createEstadoPosible(this.currentEstadoPosible).subscribe(
          (data) => {
            this.refreshTable();
            this.messageService.add({
              severity: "success",
              summary: "¡Éxito!",
              detail: "Estado creado",
              life: 2000,
            });
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail:
                "Error al crear el Estado " + this.currentEstadoPosible.nombre,
              life: 4000,
            });
            console.log(error);
          }
        );
        this.estadoModal = false;
        this.currentEstadoPosible = {};
      }
    }
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.llamadoEPService
      .getEstadosPosiblesPaged(event.rows, event.first)
      .subscribe((data: EstadoPosibleResponse) => {
        this.estadosArray = data.list;
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
}
