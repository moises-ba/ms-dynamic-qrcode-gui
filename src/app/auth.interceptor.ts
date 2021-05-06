import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { OAuth2Response } from './oauth2'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from './login/login.service';
import { catchError, delay } from 'rxjs/operators';


@Injectable()
export class AuthIntercepton implements HttpInterceptor {



constructor(private http: HttpClient, private loginService: LoginService ) { }

isRefreshingToken = false;  

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


 // request.body.refresh_token

  if(request.url.indexOf('/login') === -1 && !this.isRefreshingToken) {

     if(this.loginService.getJwtToken()){
          request = this.addToken(request, this.loginService.getJwtToken());
     }
  }

   

 return next.handle(request).pipe(
   catchError(err =>{
  
      if (err.status == 401) {

        //se o token estiver expirado e ele ainda nao tentou fazer um refreshToken, chamamos o refreshToken
        if (err.error.message.indexOf('expired') > -1 && !this.isRefreshingToken ) {
          this.isRefreshingToken = true;
          let res = this.refreshToken();
        }

      } else {
         console.log(err);
      } 
      return EMPTY;
  }) //FIM catchError
 );


}


refreshToken(){
  
  this.loginService.refreshToken()
             .toPromise()
             .then(res =>{
                console.log(res);
                if(res.access_token) {
                  this.loginService.applyToken(res)
                } else {
                  alert("retornou sucesso porem sem o token");
                 // this.loginService.gotoLoginPage();
                }
               
              })
             .catch(err =>{
               console.log(err); 
               this.loginService.gotoLoginPage();
              })
              .finally(()=>{ 
                this.isRefreshingToken = false;
              });
             
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
