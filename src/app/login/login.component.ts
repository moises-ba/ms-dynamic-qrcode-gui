import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray ,FormBuilder  } from '@angular/forms';
import { LoginService } from './login.service'
import { Router ,  ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';

 

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
     this.route.queryParams.subscribe(params => {
         let isLogout = params['logout'];
         if(isLogout) {
           thisObject.logout();
         }
         
    }); 

  }


  login(event): void {
    let thisObject = this;
    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(oauthResponse =>{
       localStorage.setItem('jwt_token', oauthResponse.access_token);
       localStorage.setItem('jwt_refresh_token', oauthResponse.refresh_token);
       if(oauthResponse.access_token){
         thisObject.router.navigate(['/qrcode']);
       } else {
         alert('Falha no login.');
       }
    });
  }

  logout(): void {
      this.loginService.logout();
  }




}
