'use strict';

var bitcore = require('.');
var PrivateKey = bitcore.PrivateKey;
var Transaction = bitcore.Transaction;
var Script = bitcore.Script;
var AddrUtils = bitcore.util.AddrUtils;



var fromAddress = 'put sender  address';
var toAddress = 'put receiver address';
var changeAddress = 'here also put sender  address';
var privateKey = AddrUtils.bitcoin_address_to_zcoin('sender private key'); 
var sendingAmount = 'put amount to send';
 
var simpleUtxoWith100000Satoshis = {
    address: fromAddress,
    txId: 'current sender address last txid',
    outputIndex: 0,
    script: Script.buildPublicKeyHashOut(fromAddress).toString(),
    satoshis: 'current sender address blocx balance'
  };

var tx = new Transaction()
      .from(simpleUtxoWith100000Satoshis)
      .to([{address: toAddress, satoshis: sendingAmount}])
      .fee(15000)
      .change(changeAddress)
      .sign(privateKey);


      var txData = JSON.stringify(tx);

      console.log(tx);
      console.log(txData)

      var seraliseee = tx.serialize();
      
      console.log(seraliseee);