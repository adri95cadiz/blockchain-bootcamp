import server from "./server";
import { getAddress } from "./signature";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  signature,
  setSignature,
}) {
  async function onChangeWallet(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onChangeSignature(evt) {
    const signature = evt.target.value;
    setSignature(signature);
    if (signature) {
      const address = getAddress(signature);
      setAddress(address);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setAddress("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>{signature ? "Your Wallet" : "Wallet inspector"}</h1>

      <label>
        Signature
        <input
          placeholder="Enter your signature here"
          value={signature}
          onChange={onChangeSignature}
        ></input>
      </label>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0xabc..."
          value={address}
          disabled={!!signature}
          onChange={onChangeWallet}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
