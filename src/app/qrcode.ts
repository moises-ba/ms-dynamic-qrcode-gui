
export interface QRCode {
  uuid?:string;
  qrCodeInBase64?: string;
  content?: string;
  dynamic?: boolean;
  persistentContent?: string;
  filePath?: string;
  fileBase64?: string;
  type?: string;
  customFields?: Array<CustomField>;
  isImage?: boolean;
  
  url?: string;
  text?: string;
  vcard?: VCardField;
  email?: EmailField;
  wifi?: WIFIField;
  bitcoin?: BitCoinField;
  twitter?: TwitterField;
  facebook?: FacebookField;
  pdf?: PDFField;
  mp3?: MP3Field;
  appstores?: AppStoresField;
  photos?: PhotosField;


}

export interface CustomField {
 key?:string;
 value?: string;
}


export class VCardField {
  name?:string;
  lastName?: string;
  cellphone?: string;
  phone?: string;
  fax?: string;
  email?: string;
  corporationName?: string;
  ocupation?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  website?: string;


   

  

}


export class EmailField {
  email?:string;
  subject?: string;
  message?: string;
  
   
}

export class SMSField {
  number?:string;
  message?: string;
}


export class WIFIField {
  netName?: string;
  visible?: boolean;
  password?: string; //WPA ou WEB (radio button)
}

export class BitCoinField {
  coin?: string; //Bitcoin, Bitcoin Cash, Ether, LiteCoin ou Dash
  value?: string;
  destinatary?: string;  
  message?: string;  
}

export class TwitterField {
  option?: string;  //1 vincular ao perfil ou 2 - postar um twitter (radio button)
  value?: string;
  textToPost?: string;  
  usernameVinculation?: string;  
}

export class PDFField {
  filePath?: string
}

export class MP3Field {
  filePath?: string
}


export class FacebookField {
  
}


export class AppStoresField {
  
}

export interface PhotosField {
  
}