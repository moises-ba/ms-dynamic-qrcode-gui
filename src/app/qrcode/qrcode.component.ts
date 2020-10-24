import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray ,FormBuilder  } from '@angular/forms';

import { QRCode, CustomField, VCardField } from '../qrcode';
import { QrcodeService } from './qrcode.service';
import { FileUploadService } from '../fileupload.service'
import { HttpEventType,HttpResponse } from '@angular/common/http';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';


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
    customFields: this.fb.array([]),

    url: this.fb.control(''),
    text: this.fb.control(''),
    vcard: this.fb.group({
         name: this.fb.control(''),
         lastName: this.fb.control(''),
         cellphone: this.fb.control(''),
         phone: this.fb.control(''),
         fax: this.fb.control(''),
         email: this.fb.control(''),
         corporationName:  this.fb.control(''),
         ocupation:  this.fb.control(''),
         street:  this.fb.control(''),
         city:  this.fb.control(''),
         postalCode:  this.fb.control(''),
         state:  this.fb.control(''),
         country:  this.fb.control(''),
         website:  this.fb.control('')     
    }),
    

   // email?: EmailField;
   // wifi?: WIFIField;
  //  bitcoin?: BitCoinField;
   // twitter?: TwitterField;
   // facebook?: FacebookField;
   // pdf?: PDFField;
  //  mp3?: MP3Field;
  //  appstores?: AppStoresField;
  //  photos?: PhotosField;

  });


  qrcode: QRCode = {};
  qrcodes: QRCode[] = null;

  fileToUpload: File = null;
  progress = 0;
  message = '';


  @ViewChild('fileUpoadInput')
  fileUpoadInput: ElementRef;

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


     this.qrcode.dynamic = false; //default false
     switch (this.qrcode.type) {
       case "vcard":
         this.qrcode.vcard = new VCardField();
         this.qrcode.vcard.name = this.qrCodeForm.value.name;
         this.qrcode.vcard.lastName = this.qrCodeForm.value.lastName;
         this.qrcode.vcard.cellphone = this.qrCodeForm.value.cellphone;
         this.qrcode.vcard.phone = this.qrCodeForm.value.phone;
         this.qrcode.vcard.fax = this.qrCodeForm.value.fax;
         this.qrcode.vcard.email = this.qrCodeForm.value.email;
         this.qrcode.vcard.corporationName = this.qrCodeForm.value.corporationName;
         this.qrcode.vcard.ocupation = this.qrCodeForm.value.ocupation;
         this.qrcode.vcard.street = this.qrCodeForm.value.street;
         this.qrcode.vcard.city = this.qrCodeForm.value.city;
         this.qrcode.vcard.postalCode = this.qrCodeForm.value.postalCode;
         this.qrcode.vcard.state = this.qrCodeForm.value.state;
         this.qrcode.vcard.country = this.qrCodeForm.value.country;
         this.qrcode.vcard.website = this.qrCodeForm.value.website;

         break;
       
       default:
         // code...
         break;
     }


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
     this.fileUpoadInput.nativeElement.value = "";
  }

  onChangeTab($event: NgbTabChangeEvent): void {
    this.qrcode.type = $event.nextId;
  }


}
