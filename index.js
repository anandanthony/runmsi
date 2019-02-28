const express = require('express');
const msRestAzure = require('ms-rest-azure');
const KeyVault = require('azure-keyvault');
const KEY_VAULT_URI = "https://anandfamsikeyvault.vault.azure.net" || process.env['KEY_VAULT_URI'];  //https://lpmsiauth.vault.azure.net/

let app = express();
//let clientId = process.env['CLIENT_ID']; // service principal    8a406187-68aa-489a-83b6-3eb6fd83be22
//let domain = process.env['DOMAIN']; // tenant id    https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/saml2
//let secret = process.env['APPLICATION_SECRET'];   //1AVruN1Rv/iVJVxUdeM7AXorpFgyr6V1z9Yx8mhgKWA=
let clientId = "cdb196fe-c9d0-476b-aba5-6d9438dade44"
let domain = "72f988bf-86f1-41af-91ab-2d7cd011db47"
let secret = "KcM+Ff7h0141++KI9we9IV07++Z9yEjTd6JzTVysAnI=" 
//does not work
/*let clientId = "ad0f90a2-de85-4c08-9747-8cabec73c774"
let domain = "c22135b2-8433-4517-8890-5ba4032212cd" 
let secret = "3anfHESLmCkSEHq2IOVnsUk0KM6BUIBG5j9uZ4oQnFk=" */

function getKeyVaultCredentials(){
  if (process.env.APPSETTING_WEBSITE_SITE_NAME){
    return msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
  } else {
    console.log("credentials");
    return msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain);
  }
}

function getKeyVaultSecret(credentials) {

  let keyVaultClient = new KeyVault.KeyVaultClient(credentials);
  console.log("secret");

  return keyVaultClient.getSecret(KEY_VAULT_URI, '22d1ab2a14894622944f2e5385e421e3', "");
}

app.get('/', function (req, res) {
  getKeyVaultCredentials().then(
     getKeyVaultSecret
  ).then(function (secret){
    res.send(`Your secret value is: ${secret.value}.`);
  }).catch(function (err) {
    res.send(err);
  });
});

app.get('/ping', function (req, res) {
  res.send('Hello World!!!');
});

let port = process.env.PORT || 9000;

app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
});
