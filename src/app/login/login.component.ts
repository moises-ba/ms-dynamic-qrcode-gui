import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray ,FormBuilder  } from '@angular/forms';
import { LoginService } from './login.service'
import { Router ,  ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm =  this.fb.group({
      username: this.fb.control(''),
      password : this.fb.control('')
    });

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,  private route: ActivatedRoute) { }

  ngOnInit(): void {
     let thisObject = this;   
     let parameterValue = null;


     parameterValue = this.route.snapshot.queryParamMap.get("logout");
     if(parameterValue) {
        thisObject.logout();
        return;
     } 

     parameterValue = this.route.snapshot.queryParamMap.get("code");
      if(parameterValue){
        //parametro vindo do keycloak para solicitar o access_token
        this.loginByAuthorizationCode(parameterValue);
        return;
      }

      //se nao tiver parametro vai para a pagina de login do keycloak
      let urlLogin  = this.urlLogin();
      console.log(urlLogin);
      this.loginService.logout();
      //caso nao tenha parametros, manda para a tela de login do keycloak
      window.location.href = this.urlLogin();
      

 

  }


  urlLogin(): string{
    let baseURL = window.location.protocol + '//' + window.location.host;
    return  environment.keycloakHost
            + '/auth/realms/principal/protocol/openid-connect/logout?redirect_uri='
            + environment.keycloakHost
            + '/auth/realms/principal/protocol/openid-connect/auth?response_type=code%26client_id=ms-dynamic-qrcode%26scope=openid%26redirect_uri='
            + baseURL + '/login?callback';
  }


  handleCallBackLogin(oauthResponse) {
      localStorage.setItem('jwt_token', oauthResponse.access_token);
       localStorage.setItem('jwt_refresh_token', oauthResponse.refresh_token);
       if(oauthResponse.access_token){
         this.router.navigate(['/qrcode']);
       } else {
         alert('Falha no login.');
       }
    }
  


  login(event): void {
    
    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password)
                     .subscribe(oauthResponse =>{
                          this.handleCallBackLogin(oauthResponse);
                     });
    
  }


  loginByAuthorizationCode(authorizationCode: string): void {
    let thisObject = this;
    this.loginService.loginByAuthorizationCode(authorizationCode).subscribe(oauthResponse =>{
        this.handleCallBackLogin(oauthResponse);
    });
  }

  logout(): void {
      this.loginService.logout();
      window.location.href = this.urlLogin();
  }




}
