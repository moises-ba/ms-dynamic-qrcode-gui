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

  urlLogin(): string{
    let baseURL = window.location.protocol + '//' + window.location.host;
    return  environment.keycloakHost
            + '/auth/realms/principal/protocol/openid-connect/logout?redirect_uri='
            + environment.keycloakHost
            + '/auth/realms/principal/protocol/openid-connect/auth?response_type=code%26client_id=ms-dynamic-qrcode%26scope=openid%26redirect_uri='
            + baseURL + '/login?callback';
  }


  applyToken(oauth2Resp: OAuth2Response) {
    localStorage.setItem('jwt_token', oauth2Resp.access_token);
     localStorage.setItem('refresh_token', oauth2Resp.refresh_token);
     localStorage.setItem('jwt_refresh_token', oauth2Resp.refresh_token);     
  }

  logout(): void {
     localStorage.removeItem('jwt_token');
     localStorage.removeItem('refresh_token');
     localStorage.removeItem('jwt_refresh_token');     
  }


  gotoLoginPage(): void {
    this.logout();
    window.location.href = this.urlLogin();
  } 


  refreshToken(): Observable<OAuth2Response>{

    let headers = new HttpHeaders({
       'Content-type': 'application/x-www-form-urlencoded'
    });     

    let param = "client_id=" + environment.oauth2ClientID
                 + "&grant_type=refresh_token"
                 + "&refresh_token=" + localStorage.getItem('jwt_refresh_token');
                
                 
    return this.http.post<OAuth2Response>(this.oauth2TokenUrl, param ,{ headers: headers });

  }



}
