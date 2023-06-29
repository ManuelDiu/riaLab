import { Component } from '@angular/core';
import { TipoDocumentoService } from '../../services/TipoDocumento/tipo-documento-service';
import { TipoDocumento } from 'src/app/types/tipoDocumento';
import { ConfirmationService, Message } from 'primeng/api';

let intervalSearch: any = null;
@Component({
  selector: 'app-tipo-documento-page',
  templateUrl: './tipo-documento-page.component.html',
  styleUrls: ['./tipo-documento-page.component.scss'],
  providers: [TipoDocumentoService],
  host: {'class': 'w-full'}
})
export class TipoDocumentoPageComponent {
  public tipoDocumentos: TipoDocumento[] = [];
  public selectedItemsToDelete: TipoDocumento[] = [];
  public showAddDialog = false;
  public isLoading = false;
  public isLoadingCreate = false;
  public addedSuccess = false;
  public nombreTipoDocumento = '';
  public alertsTypes: Message[] = [];
  public selectedItemToEdit: TipoDocumento | undefined = undefined;
  public estadoTipodocumento = false;
  public query: string = "";

  first: number = 0;
  currentRows: number = 5;
  totalCount: number = 0;
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  constructor(
    private tdservice: TipoDocumentoService,
    private confirmationService: ConfirmationService
  ) {}


  public handleLoad = (query: string = "") => {
    this.isLoading = true;
    this.tdservice.getTipoDocumentos(this.currentRows, this.first, query).subscribe({
      next: (response) => {
        const data = response.body?.list || [];
        this.tipoDocumentos = data;
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
    this.handleLoad("");
  }

  public showDialog() {
    if (this.showAddDialog == false) {
      this.estadoTipodocumento = true;
    }
    this.showAddDialog = !this.showAddDialog;
  }

  public handleChangeEstado(event:any) {
    if (this.selectedItemToEdit) {
      this.selectedItemToEdit.activo = event?.checked;
    }
  }

  public onChangeNombre(event: any) {
    this.nombreTipoDocumento = event.target?.value;
  }
  public deleteTipoDocumento(response: any, id: number) {
    if (response?.body) {
      this.tipoDocumentos = this.tipoDocumentos.filter(
        (item: TipoDocumento) => item.id !== id
      );
    }
  }

  public onHide() {
    this.selectedItemToEdit = undefined;
  }

  public activeToEditItem(doc: TipoDocumento) {
    if (doc) {
      this.selectedItemToEdit = doc;
      this.showAddDialog = true;
      this.nombreTipoDocumento = doc.nombre;
      this.estadoTipodocumento = doc.activo;
    }
  }

  confirmDelete() {
    if (this.selectedItemsToDelete?.length === 0) {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Selecciona al menos un TipoDocumento',
        },
      ];
      return;
    }
    const stringsToDelete = this.selectedItemsToDelete?.map(
      (item: TipoDocumento) => item.nombre
    );
    this.confirmationService.confirm({
      message: `Estas seguro que quieres borrar los TipoDocumento: ${String(
        stringsToDelete
      )}`,
      accept: async () => {
        this.alertsTypes = [];
        const ids = this.selectedItemsToDelete.map(
          (item: TipoDocumento) => item.id
        );
        const successDeleted: number[] = [];
        ids.map((item: number) => {
          const response = this.tdservice.deleteTipoDocumento(item).subscribe({
            next: (response) => this.deleteTipoDocumento(response, item),
            error: () => {
              console.log('error deleting ');
            },
          });
        });

      },
    });
  }

  public handleCreateTipoDocumento() {
    const preparedData = {
      nombre: this.nombreTipoDocumento,
    };
    this.isLoadingCreate = true;

    if (this.selectedItemToEdit !== undefined) {
      this.selectedItemToEdit.nombre = this.nombreTipoDocumento;

      this.tdservice.updateTipoDocumento(this.selectedItemToEdit).subscribe({
        next: () => {
          this.alertsTypes = [ {
            severity: 'success',
            summary: 'Actualizado',
            detail: `TipoDocumento actualizado correctamente`,
          },];
        },
        complete: () => {
          this.isLoadingCreate = false;
          this.showAddDialog = false;
        }
      })
      return;
    }

    this.tdservice
      .createTipoDocumento(this.nombreTipoDocumento, this.estadoTipodocumento)
      .subscribe({
        next: (response) => {
          if (response.body) {
            this.tipoDocumentos.push(response.body);
          }
          this.showAddDialog = false;
          this.alertsTypes = [
            {
              severity: 'success',
              summary: 'TipoDocumento',
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
    this.tdservice.getTipoDocumentos(event.rows, event.first)
      .subscribe((data: any) => {
        this.tipoDocumentos = data?.body.list || [];
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
      this.handleLoad(text);
    }, 1000);
  }
}
