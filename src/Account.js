import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import "./account.css";
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function Account() {
  const [form, setForm] = useState({
    address: "",
  });
  const [balance, setBalance] = useState();
  function handleChange(value) {
    setForm({
      ...form,
      [value.target.name]: value.target.value,
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
  }
  useEffect(() => {
    async function getBalance() {
      let response = await alchemy.core.getBalance(form.address, "latest");
      setBalance(response._hex);
    }
    getBalance();
  }, [form.address]);

  return (
    <div className="account">
      <h1>Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>

      <p>Balance: {parseInt(balance, 16)}</p>
    </div>
  );
}

export default Account;
