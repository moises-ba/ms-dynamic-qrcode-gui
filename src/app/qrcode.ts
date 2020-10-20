export interface QRCode {
  uuid?:string;
  qrCodeInBase64?: string;
  content?: string;
  dynamic?: boolean;
  persistentContent?: string;
  customFields?: Array<CustomField>;
}

export interface CustomField {
key?:string;
value?: string;
}
