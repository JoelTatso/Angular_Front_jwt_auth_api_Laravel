import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";

export const goToLoginGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService)
  const router = inject(Router)

  if(userService.isAuth()){
      return true
  }

  router.navigateByUrl('login')
  return false
}
