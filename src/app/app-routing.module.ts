import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'qrcode', component: QrcodeComponent, canActivate: [AuthGuardService]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuardService]
})
export class AppRoutingModule { }
