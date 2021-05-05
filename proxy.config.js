const proxy = [
    {
      context: '/api',
      target: 'http://localhost:8081',
      pathRewrite: {'^/api' : ''}
    }
  ];
  module.exports = proxy;

  //https://medium.com/@gigioSouza/resolvendo-o-problema-do-cors-com-angular-2-e-o-angular-cli-7f7cb7aab3c2

  /*
  App Angular gerado pelo @angular/cli
Crie um arquivo proxy.config.js no mesmo diretório em que se encontra o seu package.json :
const proxy = [
  {
    context: '/api',
    target: 'http://localhost:8080',
    pathRewrite: {'^/api' : ''}
  }
];
module.exports = proxy;
Agora edite o script de start de sua aplicação no package.json :
...
"scripts": {
  "start": "ng serve --proxy-config proxy.config.js",
...
Ou dentro configure dentro de seu .angular-cli.json , assim não precisa usar a flag --proxy-config no comando ng serve :
...
"defaults": {
  "serve": {
    "proxyConfig": "./proxy.config.js"
  }
...
*/