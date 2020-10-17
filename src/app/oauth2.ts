export interface OAuth2Response {
  access_token?:string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
}
