import { Component, OnInit } from '@angular/core';
import { LoginService} from './login/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }



  get jwtToken() {
    return this.loginService.getJwtToken() && true;
  }
    
  get jwtDecoded() {
    return this.loginService.decodePayloadJWT();
  }  


  navigate(to: string): void {
    this.router.navigate([to]);
  } 


}
