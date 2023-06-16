import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { clearToken, getToken } from './utils/tokenUtils';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoggedUserService } from './services/usuario/loggedUserService';

const listofPublicPaths = [
  "/auth/login",
  "/auth/register"
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public currentPathname: string = window.location.pathname || "";
  title = 'riaLab';
  public isChecking = true;
  constructor(private spinner: NgxSpinnerService, private router: Router) {
    router.events.subscribe(val => {
      if (val instanceof NavigationStart){
        console.log(val.url)
        this.activePath = val.url;
        // this.routerChangeMethod(event.url);
     }
      // console.log(location)
    });

  }
  public userInfo: any = null;
  public activePath = '/';
  
  

  ngOnInit() {
    this.activePath = this.router.url;
    console.log(this.activePath)
    const lus = new LoggedUserService();
    lus.handleLoadUserInfo();
    this.userInfo = LoggedUserService.userInfo;

    this.spinner.show();
    const currentPathName = window.location.pathname;
    const token = getToken();
    const isInPublicPath = listofPublicPaths.includes(currentPathName);
    if (!token && !isInPublicPath) {
      window.location.pathname = "/auth/login";
    }
    if (token && isInPublicPath) {
      window.location.pathname = "/"; // dashboard
    }
    this.isChecking = false;
  }

  public handleLogout() {
    const loggedUserService = new LoggedUserService();
    loggedUserService.handleClearStoreInfo();
    clearToken();
    this.router.navigate(["/auth/login"]);
    window.location.pathname = "/auth/login"
  }
  
}
