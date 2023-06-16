import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { AreaComponent } from './components/area/area.component';
import { LlamadosEPComponent } from './components/llamadosEstadosPosibles/llamadosEP.component';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';

import { TipoDocumentoPageComponent } from './components/tipo-documento-page/tipo-documento-page.component';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoIntegrantePageComponent } from './components/tipo-integrante-page/tipo-integrante-page.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UsuarioComponent } from './components/usuarios/usuario.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TipoDocumentoPageComponent,
    TipoIntegrantePageComponent,
    AreaComponent,
    LlamadosEPComponent,
    LoginComponent,
    UsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    DialogModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    TagModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    DropdownModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    PaginatorModule,
    MessagesModule,
    NgxSpinnerModule,
    OverlayPanelModule,
    CheckboxModule,
    CheckboxModule,
    ReactiveFormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  providers: [ConfirmationService, MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
