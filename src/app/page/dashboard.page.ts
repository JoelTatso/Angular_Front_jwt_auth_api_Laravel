import { Component, inject, Input, input, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
      <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
        <div class="container">
          <a href="#" class="navbar-brand">Dashboard ( {{ User?.email }} )</a>
        </div>
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <button class="btn btn-sm btn-warning fw-700" type="submit" (click)="logout()">Se déconnecter</button>
          </li>
        </ul>
      </nav>
  `,
  styles: ``
})
export class DashboardPage {

    @Input() User !: any

    userService = inject(UserService)
    router = inject(Router)

    logout(){
      console.log("bonjour")
      this.userService.logout().subscribe({
          next: () => {
            localStorage.removeItem("token")
            this.router.navigateByUrl("login")
          }
      })
    }

}
