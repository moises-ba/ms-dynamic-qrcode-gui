import { Component, OnInit } from '@angular/core';
import { QrcodeService } from '../qrcode/qrcode.service';
import { LoginService } from '../login/login.service'
import { QRCode } from '../qrcode';



@Component({
  selector: 'app-qrcodelist',
  templateUrl: './qrcodelist.component.html',
  styleUrls: ['./qrcodelist.component.css']
})
export class QrcodelistComponent implements OnInit {

  constructor(private qrcodeService: QrcodeService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.listQRCodes(); 
  }


  qrcodes: QRCode[] = null;


 listQRCodes(): void {
      let thisObject = this;
      this.qrcodeService.listQRCodes().subscribe(qrcodes =>{
        thisObject.qrcodes = qrcodes;
     });

  }

  
  delete(qrcode: QRCode): void {
    let thisObject = this;

    this.qrcodeService.deleteQRCode(qrcode.uuid).subscribe(() =>{
        thisObject.listQRCodes();
     });

  } 





}
