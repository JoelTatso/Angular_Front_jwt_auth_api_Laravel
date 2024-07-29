import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="alert alert-success" [ngClass]="{'alert-danger': errorList != undefined }" *ngIf="response_message">{{ response_message }}</div>
      <form class="shadow px-5 py-3 rounded-5" [formGroup]="registerForm" (ngSubmit)="saveForm()">
        <h1 class="text-center">Enregister un utilisateur</h1>
        <div class="form-group mb-4">
          <label for="name">Nom : </label>
          <input type="text" formControlName="name" id="name" class="form-control">
          <span class="text-danger mx-1" *ngIf="errorList?.name">{{ errorList?.name[0] }}</span>
        </div>

        <div class="form-group mb-4">
          <label for="email">Email : </label>
          <input type="email" formControlName="email" id="email" class="form-control">
          <span class="text-danger mx-1" *ngIf="errorList?.email">{{ errorList?.email[0] }}</span>
        </div>

        <div>

          <div class="form-group mb-4">
            <label for="password">Mot de passe : </label>
            <input type="password" formControlName="password" id="password" class="form-control">
            <span class="text-danger" *ngIf="errorList?.password">{{ errorList?.password[0] }}</span>
          </div>

          <div class="form-group mb-4">
            <label for="password_confirmation">Confirmation du mot de passe : </label>
            <input type="password" formControlName="password_confirmation" id="password_confirmation" class="form-control">
            <span class="text-danger" *ngIf="errorList?.password">{{ errorList?.password[0] }}</span>
          </div>

        </div>

        <div class="d-flex align-items-center justify-content-between">

          <button class="btn btn-sm btn-primary" type="submit" [disabled]="!registerForm.valid">
            <span *ngIf="!showSpinner">Sauvegarder</span>
            <span *ngIf="showSpinner" class="spinner-grow spinner-grow-sm text-white" role="status"></span>
            <span class="sr-only" *ngIf="showSpinner"> Loading...</span>
          </button>

          <div class="compte-existant">
            <span>Compte existant ?</span>
            <a routerLink='/login' class="text-decoration-none"> Se connecter</a>
          </div>

        </div>

      </form>
    </div>
  `,
  styles: `
    .compte-existant{
      text-wrap: nowrap;
    }
  `
})
export class RegisterComponent implements OnInit {

  registerForm !: FormGroup
  response_message !: any
  showSpinner !: boolean

  errorList : any = {email:Array ,password:Array, name:Array}

  fb = inject(FormBuilder)
  userService = inject(UserService)
  router = inject(Router)


  ngOnInit(): void {

    this.formBuilder()

  }

  formBuilder() {
    this.registerForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      password_confirmation: [null, Validators.required]
    })
  }//initialisation du formulaire

  saveForm() {
    this.showSpinner = true
    this.userService.register(this.registerForm.value).subscribe({
      next: (response) => {
        if(response?.errorsList){

          this.response_message = "Erreur de validation veillez vérifier vos différent champs !!!"
          this.errorList = response?.errorsList
          console.log(this.errorList)
          this.showSpinner = false

        }else{

          this.showSpinner = false
          this.router.navigateByUrl('/login')

        }
      },
    })
  }//envoi des informations de l'utilisateur

}
