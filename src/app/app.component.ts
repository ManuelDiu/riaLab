import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getToken } from './utils/tokenUtils';
import { NgxSpinnerService } from 'ngx-spinner';

const listofPublicPaths = [
  "/auth/login",
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
  constructor(private spinner: NgxSpinnerService) {}


  ngOnInit() {
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

}
