import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";

export const goToHomeGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService)
  const router = inject(Router)

  if(userService.isAuth()){
      router.navigateByUrl('accueil')
      return false
  }

  return true

}//Utilisateur non Connecté
