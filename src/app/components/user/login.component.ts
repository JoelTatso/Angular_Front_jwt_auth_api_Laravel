import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, RouterModule],
  template: `
      <div class="container mt-5">
        <div class="alert alert-success" [ngClass]="{'alert-danger': connectionError}" *ngIf="response_message">{{ response_message }}</div>
        <form class="shadow px-5 py-3 rounded-5" [formGroup]="loginForm" (ngSubmit)="Login()">

          <h1 class="text-center">Connexion</h1>

          <div class="form-group mb-4">
            <label for="email">Email : </label>
            <input type="email" formControlName="email" id="email" class="form-control">
            <span class="text-danger mx-1" *ngIf="errorList?.email">{{ errorList?.email[0] }}</span>
          </div>

          <div class="form-group mb-4">
            <label for="password">Mot de passe : </label>
            <input type="password" formControlName="password" id="password" class="form-control">
            <span class="text-danger" *ngIf="errorList?.password">{{ errorList?.password[0] }}</span>
          </div>

          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn-sm btn-primary" type="submit" [disabled]="!loginForm.valid">
              <span *ngIf="!showSpinner">Se connecter</span>
              <span *ngIf="showSpinner" class="spinner-grow spinner-grow-sm text-white" role="status"></span>
              <span class="sr-only" *ngIf="showSpinner"> Loading...</span>
            </button>

            <div class="text-center">
              <span>Pas de compte ? <a routerLink='/register' class="text-decoration-none"> S'enregister</a></span><br>
              <a routerLink="../renew-password" class="text-secondary text-decoration-none">Mot de passe oublié ?</a>
            </div>
          </div>
      </form>
    </div>
  `,
  styles: `
  `
})
export class LoginComponent implements OnInit {

  showSpinner !: boolean
  loginForm !: FormGroup
  response_message !: any
  connectionError !: boolean

  fb = inject(FormBuilder)
  router = inject(Router)
  userService = inject(UserService)

  errorList: any = { password: Array, email: Array }

  ngOnInit(): void {

    this.formBuilder()

  }

  formBuilder() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    })
  }//initialisation du formulaire

  Login() {
    this.showSpinner = true
    this.userService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response?.status === false) {

          this.response_message = response?.message
          this.errorList = response?.errorsList
          this.connectionError = true
          this.showSpinner = false

        } else {

          localStorage.setItem('token', response?.token)
          this.showSpinner = false
          this.router.navigateByUrl('accueil')

        }
      },
    })
  }//Connecter un utilisateur

}
