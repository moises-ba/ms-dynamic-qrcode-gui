import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuth2Response } from './oauth2'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from './login/login.service';

@Injectable()
export class AuthIntercepton implements HttpInterceptor {



constructor(private http: HttpClient, private loginService: LoginService ) { }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     if(request.url.indexOf('/login') === -1) {

        if(this.loginService.getJwtToken()){
             request = this.addToken(request, this.loginService.getJwtToken());
        }
     }


    return next.handle(request);
   }


 private addToken(request: HttpRequest<any>, token: string) {

    return request.clone({
      setHeaders: {
       // 'Content-type': 'application/json',  //nao deve definir por causa do upload
        'Authorization': `Bearer ${token}`
      }
    });
  }

}
