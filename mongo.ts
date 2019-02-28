import { Service, inject } from 'ligature';
import * as mongoose from 'mongoose';

import * as dotenv from 'dotenv';

//const msRestAzure = require('ms-rest-azure');
//const KeyVault = require('azure-keyvault');
import * as msRestAzure from 'ms-rest-azure';
import * as keyVault from 'azure-keyvault';
//import * as request from 'request';

const KEY_VAULT_URI =  process.env['AzureKeyVault'] || 'https://anandfamsikeyvault.vault.azure.net/';

export default class MongoDB extends Service {
  //@inject private logger: Logger;

//  private finished: boolean=false;


   
  
 getKeyVaultCredentials(){
  return msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
}

 getKeyVaultSecret(credentials) {
  let keyVaultClient = new keyVault.KeyVaultClient(credentials);
  return keyVaultClient.getSecret(KEY_VAULT_URI, '22d1ab2a14894622944f2e5385e421e3', "");
}



async delay(ms: number) {
  await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
}

async init() {
  
    
    try {
      console.log("entered");
      this.getKeyVaultCredentials().then(
        this.getKeyVaultSecret
      ).then(function (secret){
        console.log(`Your secret value is: ${secret.value}.`);
      }).catch(function (err) {
        console.log(err);
      });
      let now = new Date;
    
      
    } catch (err) {
     
      throw err;
    }
  }
}
