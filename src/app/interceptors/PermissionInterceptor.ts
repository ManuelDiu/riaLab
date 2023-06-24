import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

const coordinadorPaths: string[] = []

export const permissionGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const userInfo = sessionStorage.getItem("USERINFO");
  const requestPath = route.routeConfig?.path || '';

  console.log("llego", route, state);
  console.log("curr url ", requestPath)
  // const isPublicPath = listOfPublicPath.includes(pathname);

  if (userInfo && userInfo !== "") {
    const userRoles: string[] = JSON.parse(userInfo).roles;
    if (userRoles.includes("ADMIN")) {
      return true;
    }

    if (userRoles.includes("COORDINADOR")) {
      console.log(coordinadorPaths.includes(requestPath))
      if (coordinadorPaths.includes(requestPath)) {
        return true;
      } else {
        return false;
      }
    }

    if (userRoles.includes("TRIBUNAL")) {
      // algo
      return true;
    }
    console.log(userRoles);
    return false;
  } else {
    console.log("no hay userInfo.");
    // router.navigateByUrl("/auth/login");
    return false;
  }
};
