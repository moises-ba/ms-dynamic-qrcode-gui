import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { AuthIntercepton } from './auth.interceptor';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    QrcodeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthIntercepton, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
