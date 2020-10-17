export interface QRCode {
  uuid?:string;
  qrCodeInBase64?: string;
  content?: string;
  dynamic?: boolean;
  customFields?: Array<CustomField>;
}

export interface CustomField {
key?:string;
value?: string;
}
