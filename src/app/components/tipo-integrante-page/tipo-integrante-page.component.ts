import { Component } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/api';
import { TipoIntegrante } from 'src/app/types/tipoIntegrante';
import { TipoIntegranteService } from 'src/app/services/TipoIntegrante/tipo-integrante-service';

@Component({
  selector: 'app-tipo-integrante-page',
  templateUrl: './tipo-integrante-page.component.html',
  styleUrls: ['./tipo-integrante-page.component.scss'],
})
export class TipoIntegrantePageComponent {
  public tipoIntegrantes: TipoIntegrante[] = [];
  public selectedItemsToDelete: TipoIntegrante[] = [];
  public showAddDialog = false;
  public isLoading = false;
  public isLoadingCreate = false;
  public addedSuccess = false;
  public nombreTipoDocumento = '';
  public ordenTipoIntegrante: number = 0;
  public alertsTypes: Message[] = [];
  public selectedItemToEdit: TipoIntegrante | undefined = undefined;

  constructor(
    private tdIntegrante: TipoIntegranteService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.tdIntegrante.getTipoIntegrantes().subscribe({
      next: (response) => {
        const data = response.body?.list || [];
        this.tipoIntegrantes = data;
      },
      error: () => {
        console.log('error loading ');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  public showDialog() {
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

  public onHide() {
    this.selectedItemToEdit = undefined;
  }

  public activeToEditItem(doc: TipoIntegrante) {
    if (doc) {
      this.selectedItemToEdit = doc;
      this.showAddDialog = true;
      this.nombreTipoDocumento = doc.nombre;
      this.ordenTipoIntegrante = doc.orden;
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
      console.log(this.nombreTipoDocumento);
      this.selectedItemToEdit.nombre = this.nombreTipoDocumento;

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
        this.ordenTipoIntegrante
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
          console.log('xd2');
        },
        error: () => {
          console.log('error agregndo un tipo documento ');
        },
        complete: () => {
          this.isLoadingCreate = false;
        },
      });
  }
}
