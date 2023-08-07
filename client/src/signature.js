import { Buffer } from "buffer";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export function getAddress(signature) {
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
        console.error(ex);
        alert(ex);
    }
}