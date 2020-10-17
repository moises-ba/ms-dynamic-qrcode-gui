import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray ,FormBuilder  } from '@angular/forms';

import { QRCode, CustomField } from '../qrcode';
import { QrcodeService } from './qrcode.service'



@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {


  qrCodeForm =  this.fb.group({
    uuid: this.fb.control(''),
    dynamic: this.fb.control(false),
    content : this.fb.control(''),
    qrCodeInBase64 : this.fb.control(''),
    customFields: this.fb.array([])
  });

  qrcodes: QRCode[] = null;

  constructor(private qrcodeService: QrcodeService, private fb: FormBuilder) { }

  ngOnInit(): void {
      this.listQRCodes();
  }

  get customFields() {
    return this.qrCodeForm.get('customFields') as FormArray;
  }

  addField(event): void {

     this.customFields.push(this.fb.group({
        key: this.fb.control(''),
        value: this.fb.control('')
     }));


  }


  createQRCode(event): void {
     let thisObject = this;

     let qrcode = {
                   dynamic: this.qrCodeForm.value.dynamic,
                   content: this.qrCodeForm.value.content,
                   customFields : []};

     for (var controlCustomField of this.customFields.controls) {
         qrcode.customFields.push({
            key : controlCustomField.value.key,
            value : controlCustomField.value.value
         });
     }


     this.qrcodeService.generateQRCode(qrcode).subscribe(qrcode =>{
        thisObject.qrCodeForm.value.uuid =  qrcode.uuid;
        thisObject.qrCodeForm.value.qrCodeInBase64 =  qrcode.qrCodeInBase64;
        thisObject.qrCodeForm.reset();
        thisObject.listQRCodes();
     });
  }


  listQRCodes(): void {
      let thisObject = this;
      this.qrcodeService.listQRCodes().subscribe(qrcodes =>{
        thisObject.qrcodes = qrcodes;
     });



  }




}
