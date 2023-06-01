import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AreaComponent } from "./components/area/area.component";

const routes: Routes = [
  {
    path: "",
    children: [{ path: "areas", component: AreaComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
