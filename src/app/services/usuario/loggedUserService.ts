import { Injectable } from '@angular/core';

let DEFAULT_USER_DATA_VARIABLE = "USERINFO"

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  
  public static userInfo: any = null;

  public handleSetUserInfo(data: any) {
    LoggedUserService.userInfo = data;
  }

  public handleStorageUserInfo(userInfo: any) {
    if (userInfo) {
        const dataToSave = JSON.stringify(userInfo);
        sessionStorage.setItem(DEFAULT_USER_DATA_VARIABLE, dataToSave);
        this.handleSetUserInfo(userInfo);
    }
  }

  public handleClearStoreInfo() {
    sessionStorage.removeItem(DEFAULT_USER_DATA_VARIABLE);
  }

  public handleLoadUserInfo(): any {
    const userData = sessionStorage.getItem(DEFAULT_USER_DATA_VARIABLE)
    if (userData && userData !== "") {
        LoggedUserService.userInfo = JSON.parse(userData);
    }
  }
}
