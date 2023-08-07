const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');

const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);

console.log('public key:', toHex(publicKey));

const address = keccak256(publicKey.slice(1)).slice(-20);

console.log('address:', toHex(address));

const signature = secp256k1.sign(keccak256(utf8ToBytes('')), privateKey);

const toStringify = (obj) => {
    return JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    );
}

console.log('signature:', toStringify(signature));