"use strict";

const express = require("express");
var bitcore = require(".");
var PrivateKey = bitcore.PrivateKey;
var Transaction = bitcore.Transaction;
var Script = bitcore.Script;
var AddrUtils = bitcore.util.AddrUtils;

const app = express();
const port = 3000;

app.use(express.json());

app.post("/transaction", (req, res) => {
  try {
    const {
      RAddress,
      tAddress,
      pKey,
      sAmount, //INT
      txid,
      vout, //INT
      TBalance //INT
    } = req.body;

    var fromAddress = RAddress;
    var toAddress = tAddress;
    var changeAddress = RAddress;
    var privateKey = AddrUtils.bitcoin_address_to_zcoin(pKey);
    var sendingAmount = sAmount;

    var simpleUtxoWith100000Satoshis = {
      address: fromAddress,
      txId: txid,
      outputIndex: vout,
      script: Script.buildPublicKeyHashOut(fromAddress).toString(),
      satoshis: TBalance,
    };

    var tx = new Transaction()
      .from(simpleUtxoWith100000Satoshis)
      .to([{ address: toAddress, satoshis: sendingAmount }])
      .fee(1019)
      .change(changeAddress)
      .sign(privateKey);

    var txData = JSON.stringify(tx, null, 2);

    // console.log(tx);
    console.log(txData);

    var txHash = tx.serialize();

    // console.log(seraliseee);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
