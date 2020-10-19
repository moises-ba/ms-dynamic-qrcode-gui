import { Injectable } from '@angular/core';
import { OAuth2Response } from '../oauth2';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private oauth2TokenUrl = window.location.protocol + '//' + window.location.host + '/login/token';

  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<OAuth2Response>{

    let headers = new HttpHeaders({
       'Content-type': 'application/json'
    });

    let param = {"username" : username, "password" : password};

    return this.http.post<OAuth2Response>(this.oauth2TokenUrl, param ,{ headers: headers }).pipe(
            catchError(err => of({})));

  }

  getJwtToken() {
    return localStorage.getItem('jwt_token');
  }



}
