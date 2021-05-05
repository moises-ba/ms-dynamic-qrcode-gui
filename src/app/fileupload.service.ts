import { Injectable } from '@angular/core';
import { QRCode } from './qrcode';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as uuid from 'uuid';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private generateQrcodeUrl = environment.qrCodeBackendHost + '/ms-dynamic-qrcode/qrcode/generate'
  private qrcodesListURL = environment.qrCodeBackendHost + '/ms-dynamic-qrcode/qrcode/list'
  private findQrcodeURL = environment.qrCodeBackendHost + '/ms-dynamic-qrcode/qrcode/'
  private urlUpload = environment.qrCodeBackendHost + '/ms-dynamic-qrcode/file/uploadFile'


  constructor(private http: HttpClient) { }
 

  postFile(fileToUpload: File): Observable<HttpEvent<any>> {
 
    const formData: FormData = new FormData();   

  

    formData.append('file', fileToUpload); 
    return this.http.post(this.urlUpload, formData, {  
      reportProgress: true,  
      observe: 'events',
      responseType: 'json',
    } );  


 }



}


