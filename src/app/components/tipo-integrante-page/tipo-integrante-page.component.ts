import { Component } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { TipoIntegrante } from 'src/app/types/tipoIntegrante';
import { TipoIntegranteService } from 'src/app/services/TipoIntegrante/tipo-integrante-service';

var intervalSearch: any = 0;

@Component({
  selector: 'app-tipo-integrante-page',
  templateUrl: './tipo-integrante-page.component.html',
  styleUrls: ['./tipo-integrante-page.component.scss'],
  host: { class: 'w-full' },
})
export class TipoIntegrantePageComponent {
  public tipoIntegrantes: TipoIntegrante[] = [];
  public selectedItemsToDelete: TipoIntegrante[] = [];
  public showAddDialog = false;
  public isLoading = false;
  public isLoadingCreate = false;
  public addedSuccess = false;
  public nombreTipoDocumento = '';
  public estadoTipoIntegrante = false;
  public ordenTipoIntegrante: number = 0;
  public alertsTypes: Message[] = [];
  public selectedItemToEdit: TipoIntegrante | undefined = undefined;
  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];
  public query: String = '';

  constructor(
    private tdIntegrante: TipoIntegranteService,
    private confirmationService: ConfirmationService
  ) {}

  public handleLoadData(query: string = '') {
    this.isLoading = true;
    this.tdIntegrante
      .getTipoIntegrantes(this.currentRows, this.first, query)
      .subscribe({
        next: (response) => {
          const data = response.body?.list || [];
          this.tipoIntegrantes = data;
          this.totalCount = response?.body?.totalCount || 0;
        },
        error: () => {
          console.log('error loading ');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  ngOnInit() {
    this.handleLoadData('');
  }

  public showDialog() {
    if (!this.showAddDialog) {
      this.estadoTipoIntegrante = true;
    }
    this.showAddDialog = !this.showAddDialog;
  }

  public onChangeNombre(event: any) {
    this.nombreTipoDocumento = event.target?.value;
  }

  public onChangeOrden(event: any) {
    this.ordenTipoIntegrante = event.target?.value;
  }

  public deleteTipoDocumento(response: any, id: number) {
    if (response?.body) {
      this.tipoIntegrantes = this.tipoIntegrantes.filter(
        (item: TipoIntegrante) => item.id !== id
      );
    }
  }

  public handleChangeEstado(event: any) {
    console.log(event);
    if (this.selectedItemToEdit) {
      this.selectedItemToEdit.activo = event?.checked;
    }
  }

  public onHide() {
    this.selectedItemToEdit = undefined;
  }

  public activeToEditItem(doc: TipoIntegrante) {
    if (doc) {
      console.log('doc.activo', doc.activo);
      this.selectedItemToEdit = doc;
      this.showAddDialog = true;
      this.nombreTipoDocumento = doc.nombre;
      this.ordenTipoIntegrante = doc.orden;
      this.estadoTipoIntegrante = doc.activo;
    }
  }

  confirmDelete() {
    if (this.selectedItemsToDelete?.length === 0) {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Selecciona al menos un TipoIntegrante',
        },
      ];
      return;
    }
    const stringsToDelete = this.selectedItemsToDelete?.map(
      (item: TipoIntegrante) => item.nombre
    );
    this.confirmationService.confirm({
      message: `Estas seguro que quieres borrar los TipoIntegrante: ${String(
        stringsToDelete
      )}`,
      accept: async () => {
        this.alertsTypes = [];
        const ids = this.selectedItemsToDelete.map(
          (item: TipoIntegrante) => item.id
        );
        const successDeleted: number[] = [];
        ids.map((item: number) => {
          this.tdIntegrante.deleteTipoIntegrante(item).subscribe({
            next: (response) => this.deleteTipoDocumento(response, item),
            error: () => {
              console.log('error deleting ');
            },
          });
        });

        // console.log("success deleted" , successDeleted)
      },
    });
  }

  public handleCreateTipoIntegrante() {
    this.isLoadingCreate = true;

    if (this.selectedItemToEdit !== undefined) {
      this.selectedItemToEdit.nombre = this.nombreTipoDocumento;
      console.log('estadoTipoIntegrante', this.estadoTipoIntegrante);

      this.tdIntegrante
        .updateTipoIntegrante(this.selectedItemToEdit)
        .subscribe({
          next: () => {
            this.alertsTypes = [
              {
                severity: 'success',
                summary: 'Actualizado',
                detail: `TipoIntegrante actualizado correctamente`,
              },
            ];
          },
          complete: () => {
            this.isLoadingCreate = false;
            this.showAddDialog = false;
          },
        });
      return;
    }

    this.tdIntegrante
      .createTipoIntegrante(
        this.nombreTipoDocumento,
        true,
        this.ordenTipoIntegrante,
        this.estadoTipoIntegrante
      )
      .subscribe({
        next: (response) => {
          if (response.body) {
            this.tipoIntegrantes.push(response.body);
          }
          this.showAddDialog = false;
          this.alertsTypes = [
            {
              severity: 'success',
              summary: 'TipoIntegrante',
              detail: 'Agregado correctamente',
            },
          ];
        },
        error: () => {
          console.log('error agregndo un tipo documento ');
        },
        complete: () => {
          this.isLoadingCreate = false;
        },
      });
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.tdIntegrante
      .getTipoIntegrantes(event.rows, event.first)
      .subscribe((data: any) => {
        this.tipoIntegrantes = data?.body.list || [];
        this.totalCount = data?.body?.totalCount;
        this.isLoading = false;
      });
    this.first = event.first;
    this.currentRows = event.rows;
  }

  public handleSearch(event: any) {
    const text = event?.target?.value;
    this.query = text;
    clearTimeout(intervalSearch);
    intervalSearch = setTimeout(() => {
      this.handleLoadData(text);
    }, 1000);
  }
}
