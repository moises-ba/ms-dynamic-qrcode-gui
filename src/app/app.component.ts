import { Component, OnInit, isDevMode } from '@angular/core';
import { LoginService } from './login/login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ms-dynamic-qrcode-gui';

  constructor(private loginService: LoginService) {

  }

  ngOnInit() {

  	if(isDevMode()) {
  		console.log('Development environment');
  	} else {
  		console.log('Production environment');
  	}

  }


  get jwtToken() {
    return this.loginService.getJwtToken() && true;
  }
    
  get jwtDecoded() {
    return this.loginService.decodePayloadJWT();
  }  

}