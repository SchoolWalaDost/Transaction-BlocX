// // // "use strict";

// // // const express = require("express");
// // // var bitcore = require(".");
// // // var PrivateKey = bitcore.PrivateKey;
// // // var Transaction = bitcore.Transaction;
// // // var Script = bitcore.Script;
// // // var AddrUtils = bitcore.util.AddrUtils;

// // // const app = express();
// // // const port = 3000;

// // // app.use(express.json());

// // // app.post("/transaction", (req, res) => {
// // //   try {
// // //     const {
// // //       RAddress,
// // //       tAddress,
// // //       pKey,
// // //       sAmount, //INT
// // //       txid,
// // //       vout, //INT
// // //       TBalance //INT
// // //     } = req.body;
// // //     var send = (sAmount*100000000).toString().split('.')[0];
// // //     var fromAddress = RAddress;
// // //     var toAddress = tAddress;
// // //     var changeAddress = RAddress;
// // //     var privateKey = AddrUtils.bitcoin_address_to_zcoin(pKey);
// // //     var sendingAmount = parseInt(send);
// // //     // var sendingAmount = sAmount;
// // //     // console.log(sendingAmount +"============="+ typeof sendingAmount) ;

// // //     var simpleUtxoWith100000Satoshis = {
// // //       address: fromAddress,
// // //       txId: txid,
// // //       outputIndex: vout,
// // //       script: Script.buildPublicKeyHashOut(fromAddress).toString(),
// // //       satoshis: TBalance,
// // //     };

// // //     var tx = new Transaction()
// // //       .from(simpleUtxoWith100000Satoshis)
// // //       .to([{ address: toAddress, satoshis: sendingAmount }])
// // //       .fee(1019)
// // //       .change(changeAddress)
// // //       .sign(privateKey);

// // //     // var txData = JSON.stringify(tx, null, 2);

// // //     // console.log(tx);
// // //     // console.log(txData);

// // //     var txHash = tx.serialize();

// // //     // console.log(seraliseee);
// // //     res.json({ success: true, txHash });
// // //   } catch (error) {
// // //     res.status(500).json({ success: false, error: error.message });
// // //   }
// // // });

// // // app.listen(port, () => {
// // //   console.log(`API server is running on port ${port}`);
// // // });


"use strict";

const express = require("express");
const bitcore = require(".");
const PrivateKey = bitcore.PrivateKey;
const Transaction = bitcore.Transaction;
const Script = bitcore.Script;
const AddrUtils = bitcore.util.AddrUtils;

const app = express();
const port = 3000;

app.use(express.json());

app.post("/transaction", (req, res) => {
  try {
    const {
      RAddress,
      tAddress,
      pKey,
      sAmount,
      txid,
      vout,
      vinamount
    } = req.body;

    if (!Array.isArray(txid) || !Array.isArray(vout) || txid.length !== vout.length) {
      throw new Error("txid and vout should be arrays of the same length.");
    }

    const send = (sAmount * 100000000).toString().split('.')[0];
    const fromAddress = RAddress;
    const toAddress = tAddress;
    const changeAddress = RAddress;
    const privateKey = AddrUtils.bitcoin_address_to_zcoin(pKey);
    const sendingAmount = parseInt(send);

    const tx = new Transaction();
    let totalBalance = 0;

    for (let i = 0; i < txid.length; i++) {
      tx.from({
        address: fromAddress,
        txId: txid[i],
        outputIndex: parseInt(vout[i]),
        script: Script.buildPublicKeyHashOut(fromAddress).toString(),
        satoshis: parseInt(vinamount[i])
      });
      totalBalance += parseInt(vinamount[i]);
    }
    const fees = (192 + (148 * (txid.length - 1)) + (34 * 2)) * 10;

    if ((totalBalance - fees) <= sendingAmount) return res.json({ success: false, error: "Insufficient balance" });
    tx.to([{ address: toAddress, satoshis: sendingAmount }]).fee(fees);

    const remainBalance = totalBalance - sendingAmount - fees;
    if (remainBalance > 100) tx.to([{ address: changeAddress, satoshis: remainBalance }]);

    for (let i = 0; i < txid.length; i++) tx.sign(privateKey);

    const hex = tx.toString()

    return res.json({ success: true, txHashes: hex });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});


// "use strict";

// const express = require("express");
// const bitcore = require(".");
// const PrivateKey = bitcore.PrivateKey;
// const Transaction = bitcore.Transaction;
// const Script = bitcore.Script;
// const AddrUtils = bitcore.util.AddrUtils;

// const app = express();
// const port = 3000;

// app.use(express.json());

// app.post("/transaction", (req, res) => {
//   try {
//     const {
//       RAddress,
//       tAddress,
//       pKey,
//       sAmount,
//       txid,
//       vout,
//       TBalance
//     } = req.body;

//     if (!Array.isArray(txid) || !Array.isArray(vout) || txid.length !== vout.length) {
//       throw new Error("txid and vout should be arrays of the same length.");
//     }

//     const transactions = [];

//     for (let i = 0; i < txid.length; i++) {
//       const send = (sAmount * 100000000).toString().split('.')[0];
//       const fromAddress = RAddress;
//       const toAddress = tAddress;
//       const changeAddress = RAddress;
//       const privateKey = AddrUtils.bitcoin_address_to_zcoin(pKey);
//       const sendingAmount = parseInt(send);

//       const simpleUtxoWith100000Satoshis = {
//         address: fromAddress,
//         txId: txid[i],
//         outputIndex: vout[i],
//         script: Script.buildPublicKeyHashOut(fromAddress).toString(),
//         satoshis: TBalance
//       };

//       const tx = new Transaction()
//         .from(simpleUtxoWith100000Satoshis)
//         .to([{ address: toAddress, satoshis: sendingAmount }])
//         .fee(1019)
//         .change(changeAddress)
//         .sign(privateKey);

//       transactions.push(tx);
//     }

//     // Serialize each transaction
//     const serializedTransactions = transactions.map(tx => tx.serialize());

//     // Concatenate the serialized transactions
//     const combinedData = serializedTransactions.join("");

//     // Calculate the hash of the concatenated data
//     const txHash = bitcore.crypto.Hash.sha256sha256(Buffer.from(combinedData, "hex")).reverse().toString("hex");

//     res.json({ success: true, txHash });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`API server is running on port ${port}`);
// });

