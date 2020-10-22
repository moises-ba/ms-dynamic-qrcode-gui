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
}

export interface CustomField {
key?:string;
value?: string;
}
