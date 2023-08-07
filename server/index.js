const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x7e977936d0d29f453b455430c4ca246cd634085f": 100,
  "0x15ef26ff7386fe7eca2cc29c770e7efac84c60a5": 50,
  "0x5e67757c76a42a6e1d91841d57eb11657f0541bf": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, signature, recipient, amount } = req.body;

  const signAddress = getAddress(signature);
  if (signAddress.error) {
    res.status(500).send({ message: signAddress.error });
  }
  if (signAddress !== sender) {
    res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getAddress(signature) {
  try {
    // Get signature from input and parse it
    const signParsed = JSON.parse(signature);
    // Create a signature object
    const signObj = new secp256k1.Signature(
      BigInt(signParsed.r),
      BigInt(signParsed.s),
      signParsed.recovery
    );
    // Recover public key from signature and empty message
    const publicKey = signObj
      .recoverPublicKey(keccak256(utf8ToBytes("")))
      .toHex();
    // Convert public key to Uint8Array
    const publicKeyUint8 = Uint8Array.from(Buffer.from(publicKey, "hex"));
    // Get address from public key
    return `0x${toHex(
      keccak256(publicKeyUint8.slice(1)).slice(-20)
    )}`;
  } catch (ex) {
    return { error: ex }
  }
}
