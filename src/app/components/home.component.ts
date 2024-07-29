import { Component, inject, OnInit } from '@angular/core';
import { DashboardPage } from "../page/dashboard.page";
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DashboardPage],
  template: `
      <app-dashboard [User]="User"/>
    <div class="connected">
      <h1>Bienvenue</h1>
    </div>
  `,
  styles: `
    .connected{
      position: absolute;
      transform: translate(-50%,-50%);
      top:50%;
      left:50%;

      h1{
        font-size:15rem;
      }
    }
  `
})
export class HomeComponent implements OnInit{

  userService = inject(UserService)
  router = inject(Router)
  User !: any

  ngOnInit(): void {
      this.getUserConnected()
      console.log(this.User)
  }

  getUserConnected(){
    this.userService.getUserConnected().subscribe({
      next: (response) => {
        this.User = response.user
      }
    })
  }//récupère l'utilisateur connecté

}
