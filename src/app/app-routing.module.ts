import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { AuthGuardService } from './auth-guard.service';
import { QrcodedetailComponent } from './qrcodedetail/qrcodedetail.component';
import { HomeComponent } from './home.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'qrcode', component: HomeComponent,
    children: [
      {
        path: '', 
        component: QrcodeComponent,
        canActivate: [AuthGuardService] 
      },
      {
        path: ':uuid', 
        component: QrcodedetailComponent
      }
    ], 
  },


  { path: '', redirectTo: '/login', pathMatch : 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuardService]
})
export class AppRoutingModule { }
