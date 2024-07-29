import { Routes } from '@angular/router';
import { LoginComponent } from './components/user/login.component';
import { RegisterComponent } from './components/user/register.component';
import { HomeComponent } from './components/home.component';
import { goToLoginGuard } from './guards/goToLogin.guard';
import { goToHomeGuard } from './guards/goToHome.guard';
import { NewPasswordComponent } from './components/user/new-password.component';

export const routes: Routes = [
  {
    path:'accueil', component: HomeComponent, title:'Accueil', canActivate:[goToLoginGuard]
  },
  {
    path:'register', component:RegisterComponent, title:'S\'enregistrer', canActivate:[goToHomeGuard]
  },
  {
    path:'login', component:LoginComponent, title:'Connexion', canActivate:[goToHomeGuard]
  },
  {
    path:'renew-password', component:NewPasswordComponent, title:'Nouveau mot de passe'
  },
  {
    path:'**',redirectTo:'register',pathMatch:'full'
  }
];
