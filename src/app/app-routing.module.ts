import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AreaComponent } from "./components/area/area.component";
import { LlamadosEPComponent } from "./components/llamadosEstadosPosibles/llamadosEP.component";

const routes: Routes = [
  {
    path: "areas", component: AreaComponent
  },
  {
    path: "llamadosEP", component: LlamadosEPComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
