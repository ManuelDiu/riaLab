import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDocumentoPageComponent } from './tipo-documento-page/tipo-documento-page.component';

const routes: Routes = [
  { path: 'tipoDocumento', component: TipoDocumentoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
