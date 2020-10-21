import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray ,FormBuilder  } from '@angular/forms';

import { QRCode, CustomField } from '../qrcode';
import { QrcodeService } from './qrcode.service';
import { FileUploadService } from '../fileupload.service'
import { HttpEventType,HttpResponse } from '@angular/common/http';



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

  fileToUpload: File = null;
  progress = 0;
  message = '';

  constructor(private qrcodeService: QrcodeService, private fb: FormBuilder, private fileServiceUpload: FileUploadService) { }

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
                   filePath: null,
                   type: null,
                   customFields : []};

     for (var controlCustomField of this.customFields.controls) {
         qrcode.customFields.push({
            key : controlCustomField.value.key,
            value : controlCustomField.value.value
         });
     }


     let funcHandleQrcodeGeneratorResponse = function(qrcode) {
        thisObject.qrCodeForm.value.uuid =  qrcode.uuid;
        thisObject.qrCodeForm.value.qrCodeInBase64 =  qrcode.qrCodeInBase64;
        thisObject.qrCodeForm.reset();
        thisObject.listQRCodes();
     }

     if(this.fileToUpload) {

        this.progress = 0;
        this.fileServiceUpload.postFile(this.fileToUpload).subscribe(
                event => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.progress = Math.round(100 * event.loaded / event.total);
                  } else if (event instanceof HttpResponse) {
                  //  this.message = event.body.message;
                   // this.fileInfos = this.uploadService.getFiles();
                   qrcode.filePath = event.body.filePath;  
                   qrcode.type = event.body.type;  
                   this.qrcodeService.generateQRCode(qrcode).subscribe(funcHandleQrcodeGeneratorResponse); 

                   this.resetFileInput();
                  }
                },
                err => {                 
                  alert('Não foi possivel efetuar o download!');
                  this.resetFileInput();
                });

                  
      
    } else {
      this.qrcodeService.generateQRCode(qrcode).subscribe(funcHandleQrcodeGeneratorResponse);
    }

  }


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


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }


  resetFileInput(): void {
     this.progress = 0;
      this.fileToUpload = null;
  }


}
