import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  public email: string = '';
  public alertsTypes: Message[] = [];
  public isLoading: boolean = false;


  constructor(private router: Router, private forgotPasswordService: ForgotPasswordService) {

  }

  public handleResetPassword() {
    if (!this.email) {
      if (this.alertsTypes?.length > 0) return;
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Completa el email para continuar',
        },
      ];
      return;
    }
    this.alertsTypes = [];
    this.isLoading = true;
    this.forgotPasswordService.handleForgotPassword(this.email).subscribe({
      next: (response: any) => {
        // this.alertsTypes.
        this.alertsTypes = [
          {
            severity: 'success',
            summary: 'Email enviado',
            detail: 'Revisa tu casilla de correo electronico para restablecer tu contraseña',
          },
        ];
      },
      error: () => {
        this.alertsTypes = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'Error al completar el envio de email',
          },
        ];
      },
      complete: () => {
        this.isLoading = false;
      }
    })

  }

  public handleGoToLogin() {
    this.router.navigate(["/auth/login"])
  }
}
