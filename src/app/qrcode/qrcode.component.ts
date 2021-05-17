import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray ,FormBuilder  } from '@angular/forms';

import { QRCode, CustomField, VCardField ,EmailField } from '../qrcode';
import { QrcodeService } from './qrcode.service';
import { FileUploadService } from '../fileupload.service'
import { HttpEventType,HttpResponse } from '@angular/common/http';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';


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
    
    url: this.fb.control(''),
    text: this.fb.control(''),
    email: this.fb.group({
       email: this.fb.control(''),
       subject: this.fb.control(''),
       message: this.fb.control('')
    })
   
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
  qrcodeGenerated: QRCode = null;
  

  fileToUpload: File = null;
  progress = 0;
  message = '';


  @ViewChild('fileUpoadInput')
  fileUpoadInput: ElementRef;

  constructor(private qrcodeService: QrcodeService, private fb: FormBuilder, private fileServiceUpload: FileUploadService) { }

  ngOnInit(): void {
       
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


     if(!this.qrcode.type){
       this.qrcode.type = 'url'; //default(primeiro item da aba)
     }
 


     let formValue = this.qrCodeForm.value;
     
     this.qrcode.dynamic = formValue.dynamic; 
     switch (this.qrcode.type) {
       case "vcard":
         this.qrcode.vcard = new VCardField();
         this.qrcode.vcard.name = formValue.vcard.name;
         this.qrcode.vcard.lastName = formValue.vcard.lastName;
         this.qrcode.vcard.cellphone = formValue.vcard.cellphone;
         this.qrcode.vcard.phone = formValue.vcard.phone;
         this.qrcode.vcard.fax = formValue.vcard.fax;
         this.qrcode.vcard.email = formValue.vcard.email;
         this.qrcode.vcard.corporationName = formValue.vcard.corporationName;
         this.qrcode.vcard.ocupation = formValue.vcard.ocupation;
         this.qrcode.vcard.street = formValue.vcard.street;
         this.qrcode.vcard.city = formValue.vcard.city;
         this.qrcode.vcard.postalCode = formValue.vcard.postalCode;
         this.qrcode.vcard.state = formValue.vcard.state;
         this.qrcode.vcard.country = formValue.vcard.country;
         this.qrcode.vcard.website = formValue.vcard.website;
         

         break;

       case "url":
         this.qrcode.url = formValue.url;
         break;   
       
       case "text":
         this.qrcode.text = formValue.text;
         break;   

       case "email":
         this.qrcode.email = new EmailField();
         this.qrcode.email.email = formValue.email.email;
         this.qrcode.email.subject = formValue.email.subject;
         this.qrcode.email.message = formValue.email.message;
         break;   

       default:
         // code...
         break;
     }


     for (var controlCustomField of this.customFields.controls) {
         this.qrcode.customFields.push({
            key : controlCustomField.value.key,
            value : controlCustomField.value.value
         });
     }


     //funcao guardada em variavel para tratar o retorno
     let funcHandleQrcodeGeneratorResponse = function(qrcode) {
       thisObject.qrCodeForm.reset();
       thisObject.qrcodeGenerated = qrcode;
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
                   this.qrcode.filePath = event.body.filePath;  
                   this.qrcodeService.generateQRCode(this.qrcode).subscribe(funcHandleQrcodeGeneratorResponse); 

                   this.resetFileInput();
                  }
                },
                err => {                 
                  alert('Não foi possivel efetuar o upload!');
                  this.resetFileInput();
                });

                  
      
    } else {
      this.qrcodeService.generateQRCode(this.qrcode).subscribe(funcHandleQrcodeGeneratorResponse);
    }

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
    this.qrcodeGenerated = null
    this.qrcode.type = $event.nextId;
  }


}
