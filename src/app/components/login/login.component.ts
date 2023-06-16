import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { LoginService } from 'src/app/services/login/login.service';
import { LoggedUserService } from 'src/app/services/usuario/loggedUserService';
import { HandleLoginData, Usuario } from 'src/app/types/Usuario';
import { storageToken } from 'src/app/utils/tokenUtils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public alertsTypes: Message[] = [];

  constructor(public loginService: LoginService) {}

  public handleLogin() {
    if (this.email.trim() != '' && this.password.trim() != '') {
      const dataToSend: HandleLoginData = {
        username: this.email,
        password: this.password,
      };
      this.loginService.handleLogin(dataToSend).subscribe({
        next: (response: any) => {
          const userInfo = response?.body as Usuario;
          if (userInfo?.token) {
            console.log("userInfo is", userInfo)
            const lus = new LoggedUserService();
            lus.handleStorageUserInfo(userInfo);
            storageToken(userInfo?.token);
            window.location.reload();
          }
        },
        error: (response: any) => {
          if (response?.error) {
            this.alertsTypes = [
              {
                severity: 'error',
                summary: 'Error',
                detail: 'Credenciales incorrectas',
              },
            ];
          }
        },
      });
      //call to endpoint
    } else {
      this.alertsTypes = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Rellena los campos antes de continuar',
        },
      ];
    }
  }
}
