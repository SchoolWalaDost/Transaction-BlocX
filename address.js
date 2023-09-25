'use strict';

var bitcore = require('.');
var PrivateKey = bitcore.PrivateKey;

var privateKey = new PrivateKey();
var address = privateKey.toAddress();


console.log(address.toString())