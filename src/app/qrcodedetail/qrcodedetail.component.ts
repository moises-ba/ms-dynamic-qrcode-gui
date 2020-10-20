import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { QRCode, CustomField } from '../qrcode';
import { QrcodeService } from '../qrcode/qrcode.service';

@Component({
  selector: 'app-qrcodedetail',
  templateUrl: './qrcodedetail.component.html',
  styleUrls: ['./qrcodedetail.component.css']
})
export class QrcodedetailComponent implements OnInit {

  qrcode: QRCode = {};

  constructor( private route: ActivatedRoute, private qrcodeService: QrcodeService) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
         
         this.qrcodeService.findQrCodeById(params.get('uuid')).subscribe(qrcode =>{

         	this.qrcode = qrcode;	

         });


    }); 

  }

}
