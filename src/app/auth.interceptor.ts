import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError, BehaviorSubject } from 'rxjs';
import { OAuth2Response } from './oauth2'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from './login/login.service';
import { catchError, delay, filter, finalize, switchMap, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable()
export class AuthIntercepton implements HttpInterceptor {



constructor(private http: HttpClient, private loginService: LoginService ) { }

private isRefreshingToken = false;  
private refreshAccessTokenSubject: Subject<any> = new BehaviorSubject<any>(null);



intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //let isLogin = request.url.indexOf('/login') === -1 ;
  //let isCallingApiToRefreshToken = (true && request.body.refresh_token)


//  if(!this.isRefreshingToken) {

//     if(this.loginService.getJwtToken()){
//          request = this.addToken(request, this.loginService.getJwtToken());
//     }
//  }

  if(this.loginService.getJwtToken()){
    request = this.addToken(request, this.loginService.getJwtToken());
  }

 return next.handle(request).pipe(
   catchError(err =>{
      console.log(err);

      //if (err instanceof HttpErrorResponse && err.status === 401) 

      if (err.status == 401) {

        return this.handleError401(request, next, err);

      } if(err.status == 400) { 

        return this.handleError400(request, next, err);

      } else {
         console.log(err);
         alert(err);
      } 
      return EMPTY;
  }) //FIM catchError
 );

}

private handleError401(request: HttpRequest<any>, next: HttpHandler, error: Error): Observable<HttpEvent<any>> {
  //if (err.error.message.indexOf('expired') > -1 ) 

  if(!this.isRefreshingToken) {
    this.isRefreshingToken = true;
    this.refreshAccessTokenSubject.next(null);

    return this.loginService.refreshToken().pipe(
            switchMap(res =>{
              console.log(res);
              if(res.access_token) {
                this.loginService.applyToken(res);
                this.refreshAccessTokenSubject.next(res.access_token)
                return next.handle(request)
              } else {
                alert("retornou sucesso porem sem o token");
                // this.loginService.gotoLoginPage();
                return EMPTY;
              }                            
            }),
            catchError(err =>{
              console.log(err); 
              //this.loginService.gotoLoginPage();
              return EMPTY;
            }),
            finalize(()=>{ 
              this.isRefreshingToken = false;
            })
      );
  
  
  } else {
  return this.refreshAccessTokenSubject.pipe(
    filter(token => token != null),
    take(1),
    switchMap(jwt => {
      return next.handle(this.addToken(request, jwt));
    }));
  }
    
}


private handleError400(request: HttpRequest<any>, next: HttpHandler, err: any): Observable<HttpEvent<any>> {

  let isCallToAuthenticationServer = (request.url.indexOf(environment.keycloakAuthToken) > -1);
          
  if (isCallToAuthenticationServer) {   

      let erroMessage = err?.error?.message; 
      if(erroMessage == null) {
        erroMessage = err?.error?.error_description; 
      }

      if(erroMessage && erroMessage.toLowerCase().indexOf("invalid refresh token") != -1){
        alert("Sessão expirada.");
        this.loginService.gotoLoginPage();
      } else {
        alert(err)
      }
   
  } else {
    alert(err);
  } 
  
  

  return EMPTY;
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
