import { Injectable } from '@angular/core';
import { OAuth2Response } from '../oauth2';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private oauth2TokenUrl = environment.keycloakHost + environment.keycloakAuthToken;

  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<OAuth2Response>{

    let headers = new HttpHeaders({
       'Content-type': 'application/json'
    });

    let param = {"username" : username, "password" : password};

    return this.http.post<OAuth2Response>(this.oauth2TokenUrl, param ,{ headers: headers }).pipe(
            catchError(err => of({})));

  }

  loginByAuthorizationCode(authorizationCode: string): Observable<OAuth2Response>{

        let headers = new HttpHeaders({
                'Content-type': 'application/x-www-form-urlencoded'
              });
    
        let param =  "code=" + authorizationCode 
                    + "&redirect_uri=" + window.location.href.split('\?')[0] + "?callback"
                    + "&client_id=" + environment.oauth2ClientID
                    + "&client_secret=" + environment.oauth2ClientPassword
                    + "&grant_type=authorization_code"
                    + "&code=" + authorizationCode;

    
        return this.http.post<OAuth2Response>(this.oauth2TokenUrl, param,{ headers: headers }).pipe(
                catchError(err => of({})));

 }

  getJwtToken() {
    return localStorage.getItem('jwt_token');
  }

  public decodePayloadJWT(): any {
    try {
      let jwtToken = this.getJwtToken();
      if(jwtToken){
        return jwt_decode(jwtToken);
      }

      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }


  logout(): void {
     localStorage.removeItem('jwt_token');
     localStorage.removeItem('refresh_token');
     localStorage.removeItem('jwt_refresh_token');     
  }


   

}
