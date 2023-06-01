import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AreaComponent } from "./components/area/area.component";
import { LlamadosEPComponent } from "./components/llamadosEstadosPosibles/llamadosEP.component";
import { TipoDocumentoPageComponent } from './tipo-documento-page/tipo-documento-page.component';
import { TipoIntegrantePageComponent } from './tipo-integrante-page/tipo-integrante-page.component';

const routes: Routes = [
  {
    path: "areas", component: AreaComponent
  },
  {
    path: "llamadosEP", component: LlamadosEPComponent
  },
  { path: 'tipoDocumento', component: TipoDocumentoPageComponent },
  { path: 'tipoIntegrante', component: TipoIntegrantePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
