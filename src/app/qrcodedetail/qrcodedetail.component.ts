import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { QRCode, CustomField } from '../qrcode';
import { QrcodeService } from '../qrcode/qrcode.service';
import { environment } from '../../environments/environment';

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

          switch (qrcode.type) {
            case "jpeg":
            case "gif":
            case "png":
            case "bmp":
            case "tiff":
            case "psd":
            case "exif":
            case "raw":
            case "eps":
            case "svg":
            case "webp":
              this.qrcode.isImage  = true; 

               this.qrcodeService.getFileBase64(qrcode.filePath).subscribe(fileBase64 =>{
                  this.qrcode.fileBase64 = fileBase64;
               });
             

              break;
             
            default:
              this.qrcode.isImage  = false;
              break;
          }

           

         });


    }); 
  }

 
 
  download(fileName: string): void {
    
     this.qrcodeService.downloadFile(fileName).subscribe(data => {


        let blob = new Blob([data], { type: "application/octet-stream"});

        fileName = fileName.substr(fileName.lastIndexOf('/')+1);    
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();

   
        document.body.removeChild(downloadLink);
     });


  }


}
