import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/User";
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) { }

  registerUser(user): Observable<User>{
    return this.http.post<User>('/api/users/register', user , httpOptions)
  }

  authenticateUser(user): Observable<User>{
    return this.http.post<User>('/api/users/authenticate', user , httpOptions)
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(): Observable<any>{
    this.loadToken();

    return this.http.get<any>('/api/users/profile', {headers: {Authorization: this.authToken}})
  }

  loadToken(){
    this.authToken = localStorage.getItem('id_token');
  }

  isLoggedIn = () => {
    let jwtHelper = new JwtHelperService();
    if(localStorage.id_token == undefined)
      return false;
    return !jwtHelper.isTokenExpired(localStorage.id_token);
  };

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}

