import { Injectable } from '@angular/core';
import { QRCode } from '../qrcode';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as uuid from 'uuid';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {

  private qrcodeUrl = environment.qrCodeBackendHost + '/ms-dynamic-qrcode/qrcode/generate'
  private qrcodesListURL = environment.qrCodeBackendHost + '/ms-dynamic-qrcode/qrcode/list'


  constructor(private http: HttpClient) { }


  generateQRCode(qrCode: QRCode): Observable<QRCode> {

    let headers = new HttpHeaders({
       'Content-type': 'application/json'
    });


    qrCode.uuid = uuid.v4();

    return this.http.post<QRCode>(this.qrcodeUrl, qrCode ,{ headers: headers })
           .pipe(
            catchError(err => of({}))
    );

  }

  listQRCodes(): Observable<QRCode[]> {
    let headers = new HttpHeaders({
       'Content-type': 'application/json'
    });

     return this.http.get<QRCode[]>(this.qrcodesListURL ,{ headers: headers })
           .pipe(
            catchError(err => of([{}]))
    );

  }


}


