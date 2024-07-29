import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
  template:`
    <div class="container mt-5" *ngIf="(!codePart)">
        <div class="alert alert-success" [ngClass]="{'alert-danger': response_statut}" *ngIf="response_message">{{ response_message }}</div>
        <form class="shadow px-5 py-3 rounded-5" [formGroup]="Form1" (ngSubmit)="verifyEmail()">
          <div class="form-group mb-4">
            <label for="email">Email : </label>
            <input type="email" formControlName="emailF" id="email" class="form-control">
          </div>


          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn-sm btn-primary" type="submit" [disabled]="!Form1.valid">
              <span *ngIf="!showSpinner">Suivant</span>
              <span *ngIf="showSpinner" class="spinner-grow spinner-grow-sm text-white" role="status"></span>
              <span class="sr-only" *ngIf="showSpinner"> Loading...</span>
            </button>

          </div>
      </form>
    </div>

    <div class="container mt-5"  *ngIf="codePart &&  !passwordPart">
        <div class="alert alert-success" [ngClass]="{'alert-danger': response_statut}" *ngIf="response_message">{{ response_message }}</div>
        <form class="shadow px-5 py-3 rounded-5" [formGroup]="Form2" (ngSubmit)="verifyCode()">

          <div class="form-group mb-4">
            <label for="two_factor_code">Code de récupération : </label>
            <input type="text" formControlName="two_factor_code" id="two_factor_code" class="form-control">
          </div>

          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn-sm btn-primary" type="submit" [disabled]="!Form2.valid">
              <span *ngIf="!showSpinner">Suivant</span>
              <span *ngIf="showSpinner" class="spinner-grow spinner-grow-sm text-white" role="status"></span>
              <span class="sr-only" *ngIf="showSpinner"> Loading...</span>
            </button>

            <button class="btn btn-sm btn-danger" type="submit" (click)="resendCode()">
              <span *ngIf="!showSpinner">Resend</span>
              <span *ngIf="showSpinner" class="spinner-grow spinner-grow-sm text-white" role="status"></span>
              <span class="sr-only" *ngIf="showSpinner"> Loading...</span>
            </button>

          </div>
      </form>
    </div>

    <div class="container mt-5"  *ngIf="passwordPart">
        <div class="alert alert-success" [ngClass]="{'alert-danger': response_statut}" *ngIf="response_message">{{ response_message }}</div>
        <form class="shadow px-5 py-3 rounded-5" [formGroup]="Form3" (ngSubmit)="changePassword()">
          <h1 class="text-center">Modification du mot de passe</h1>
          <div class="form-group mb-4">
            <label for="password">Mot de passe : </label>
            <input type="password" formControlName="password" id="password" class="form-control">
          </div>

          <div class="form-group mb-4">
            <label for="password_confirmation">Confirmation : </label>
            <input type="password" formControlName="password_confirmation" id="password_confirmation" class="form-control">
          </div>

          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn-sm btn-primary" type="submit" [disabled]="!Form3.valid">
              <span *ngIf="!showSpinner">Modifier</span>
              <span *ngIf="showSpinner" class="spinner-grow spinner-grow-sm text-white" role="status"></span>
              <span class="sr-only" *ngIf="showSpinner"> Loading...</span>
            </button>

          </div>
      </form>
    </div>
  `,
  styles:``
})
export class NewPasswordComponent implements OnInit{

  showSpinner !: boolean
  response_message !: any
  response_statut !: boolean
  codePart !: boolean
  passwordPart  = false


  Form1 !: FormGroup
  Form2 !: FormGroup
  Form3 !: FormGroup

  userService = inject(UserService)
  fb = inject(FormBuilder)
  router = inject(Router)


  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm(){

    this.Form1 = this.fb.group({
      emailF :["",[Validators.email,Validators.required]],
    })

    this.Form2 = this.fb.group({
      two_factor_code: ["",[Validators.required]]
    })

    this.Form3 = this.fb.group({
      password: ["",[Validators.required]],
      password_confirmation: ["",[Validators.required]],
    })
  }// Initialisation des formulaires

  verifyEmail(){
    this.userService.emailExist(this.Form1.get('emailF')?.value).subscribe({
      next: (response) => {
        if(!response?.status){
            this.response_message = "Veillez enter une email existante"
            this.response_statut = true
        }else{
          this.codePart = true
          this.userService.sendTwoFactorCode(this.Form1.get('emailF')?.value).subscribe({
            next: (response) => {
              localStorage.setItem('email',this.Form1.get('emailF')?.value)
              this.response_statut = false
              this.response_message = "Veillez vérifier le code dans votre boîte mail"
            }
          })
        }
      }
    })
  }//vérfication de l'Email et envoie du code récupération

  resendCode(){
    const email = localStorage.getItem("email")
    if((email != undefined) && (email != null) && (email != 'null')){
      this.userService.resendTwoFactoryCode(email).subscribe({
        next: (response) => {
          if(response.errorsList){

          }else{
            this.response_statut = false
            this.response_message = response?.message
            setTimeout( () => {
                this.response_message = null
            },4000)
          }
        }
      })
    }
  }//Envoie (n) du code de récupération

  verifyCode(){
    const email = localStorage.getItem("email")
    if((email != undefined) && (email != null) && (email != 'null')){
      this.userService.verifyTwoFactoryCode(email, this.Form2.get('two_factor_code')?.value).subscribe({
        next: (response) => {
          console.log(response)
          if(response?.two_factor_code){
              this.passwordPart = true
              this.response_statut = false
              this.response_message = null
          }else{
            this.response_statut = true
            this.response_message = "Veillez entrer le bon code !!!"
            setTimeout( () => {
              this.response_message =null
            },4000)
          }
        }
      })
    }
  }//verification du code de récupération

  changePassword(){
    const email = localStorage.getItem("email")
    const password = this.Form3.get('password')?.value
    const passwordConfirm = this.Form3.get('password_confirmation')?.value
    if((email != undefined) && (email != null) && (email != 'null')){
      this.userService.userPasswordChange(email,password,passwordConfirm).subscribe({
        next: (response) => {
          console.log(response)
          if(response?.status){
            localStorage.removeItem("email")
            this.router.navigateByUrl("login")
          }
        }
      })
    }
  }//modifier le mot de passe de l'utilisateur

}
