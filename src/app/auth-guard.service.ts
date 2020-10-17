import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';


@Injectable({
providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

constructor() { }

  canActivate() {
    if(localStorage.getItem('jwt_token')){
      return true;
    } else {
      return false;
    }

  }
}
