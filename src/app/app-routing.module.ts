import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AreaComponent } from "./components/area/area.component";
import { LlamadosEPComponent } from "./components/llamadosEstadosPosibles/llamadosEP.component";
import { TipoDocumentoPageComponent } from './components/tipo-documento-page/tipo-documento-page.component';
import { TipoIntegrantePageComponent } from "./components/tipo-integrante-page/tipo-integrante-page.component";
import { LoginComponent } from "./components/login/login.component";
import { UsuarioComponent } from "./components/usuarios/usuario.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { permissionGuard } from "./interceptors/PermissionInterceptor";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "areas", component: AreaComponent, canActivate: [permissionGuard]
  },
  {
    path: "llamadosEP", component: LlamadosEPComponent, canActivate: [permissionGuard]
  },
  { path: 'tipoDocumento', component: TipoDocumentoPageComponent, canActivate: [permissionGuard] },
  { path: 'tipoIntegrante', component: TipoIntegrantePageComponent, canActivate: [permissionGuard] },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent, },
  { path: 'restore-password', component: ResetPasswordComponent },
  { path: 'usuarios', component: UsuarioComponent, canActivate: [permissionGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
