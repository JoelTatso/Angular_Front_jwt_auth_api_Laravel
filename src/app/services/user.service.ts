import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, User } from '../models/response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient)

  register(request: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/user/register`, request)
  }//Enregister un utilisateur

  login(credentials: any): Observable<AuthResponse | any> {
    return this.http.post(`${environment.ApiUrl}/user/login`, credentials)
  }//connexion utilisateur

  getUserConnected(): Observable<User | any> {

    const token = localStorage.getItem('token')
    const header = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })

    return this.http.get(`${environment.ApiUrl}/user/connected`,{headers:header})
  }//utilisateur connecté

  logout(): Observable<any> {

    const token = localStorage.getItem('token')
    const header = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })

    return this.http.post(`${environment.ApiUrl}/user/logout`,{},{headers:header})
  }//Deconneter l'utilisateur

  isAuth(): boolean {
    const token = localStorage.getItem("token")
    if ( (token !== null) && (token != undefined) && (token != 'null')) {
      return true
    } else {
      return false
    }
  }//Utilsateur connecté ?

  emailExist(email:string):Observable<any>{
    return this.http.post(`${environment.ApiUrl}/user/email`,{"email":email})
  }//verification de l'email

  sendTwoFactorCode(email:string):Observable<any> {
    return this.http.post(`${environment.ApiUrl}/user/password-code/send`,{email:email})
  }//envoie du code recuperation

  resendTwoFactoryCode(email:string):Observable<any>{
    return this.http.post(`${environment.ApiUrl}/password-code/resend`,{email:email})
  }//renvoie du code recuperation

  verifyTwoFactoryCode(email:string, code:string):Observable<any>{
    return this.http.post(`${environment.ApiUrl}/password-code/verify`,{two_factor_code:code, email:email})
  }//verification du code recuperation

  userPasswordChange(email:string, password:string, passord_confirm:string):Observable<any>{
    return this.http.put(`${environment.ApiUrl}/user/password/update`,{email:email,password:password,password_confirmation:passord_confirm})
  }//changer le mot de passe de l'utilisateur

}
