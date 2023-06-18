import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  public newPassword: string = "";
  public newPasswordtwo: string = "";
  public alertsTypes: Message[] = [];
  public isInvalid: boolean = false;
  public token: string = "";
  public email: string = "";
  public isLoading = false;

  constructor(private router: Router, private fps: ForgotPasswordService, private routerActive: ActivatedRoute) {};

  ngOnInit() {
    const token = this.routerActive.snapshot.queryParamMap.get('token');
    const email = this.routerActive.snapshot.queryParamMap.get('email');
    if (!token || !email) {
      this.isInvalid = true;
      return;
    }
    this.token = token;
    this.email = email;
    this.isInvalid = false;
  }

  public handleResetPassword() {
    if (!this.newPassword || !this.newPasswordtwo) {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Ingresa una contraseña para continuar',
        },
      ];
      return;
    }
    if (this.newPassword !== this.newPasswordtwo) {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Las contraseñas no coinciden',
        },
      ];
      return;
    }
    const securePasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-\/]).{8,}$/;
    if (!securePasswordRegex.test(this.newPassword)) {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Utiliza una contraseña segura, utilizando caracteres como mayusuclas , numeros , y simbolos',
        },
      ];
      return;
    }
    this.isLoading = true;
    
    this.alertsTypes = [];
    this.fps.handleResetPassword(this.email, this.newPassword, this.token).subscribe({
      next: (response: any) => {
        if (response?.body?.status === true) {
          this.alertsTypes = [
            {
              severity: 'success',
              summary: 'Contraseña reseteada',
              detail: 'Se cambio su contraseña correctamente',
            },
          ];
        }
      },
      error: (err: any) => {
        this.alertsTypes = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'Error al validar los datos , intentalo nuevamente',
          },
        ];
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
  
  public handleGoToLogin() {
    this.router.navigate(['/auth/login'])
  }
}
