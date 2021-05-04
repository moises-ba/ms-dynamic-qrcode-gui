export const environment = {
  production: true,
  qrCodeBackendHost: window.location.protocol + '//' + window.location.host,
  keycloakHost: window.location.protocol + '//' + window.location.host,
  keycloakAuthToken : '/auth/realms/principal/protocol/openid-connect/token',
  oauth2ClientID : "ms-dynamic-qrcode",
  oauth2ClientPassword : ""
};
