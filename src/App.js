import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import Account from "./Account";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
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

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [receipt, setReceipt] = useState();
  const [showtransactions, setShowtransactions] = useState(false);
  const [clickedTransaction, setClickedTransaction] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      try {
        setBlockNumber(await alchemy.core.getBlockNumber());
      } catch (error) {
        console.log(error);
      }
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlock() {
      try {
        setBlock(await alchemy.core.getBlock(blockNumber));
      } catch (error) {
        console.log(error);
      }
    }

    getBlock();
  }, [blockNumber]);

  useEffect(() => {
    async function getReceipt() {
      try {
        // Only make the API call if clickedTransaction is not null
        if (clickedTransaction) {
          const response = await alchemy.core.getTransactionReceipt(
            clickedTransaction
          );
          console.log(response);
          setReceipt(response);
        }
      } catch (error) {
        console.log(error);
        // Handle the error, e.g., setReceipt to a default value or show an error message
      }
    }

    getReceipt();
  }, [clickedTransaction]);

  const handleTransactionClick = (transaction) => {
    // Set the clicked transaction value in the state
    setClickedTransaction(transaction);
  };
  function onclick() {
    setShowtransactions(!showtransactions);
  }
  if (!block) {
    return <div>Loading...</div>;
  }
  const { transactions } = block;

  if (!transactions) {
    return <div>No transactions</div>;
  }

  //create a div with all transactions
  const transactionDivs = transactions.map((transaction) => (
    <div
      key={transaction}
      className="transaction"
      onClick={() => handleTransactionClick(transaction)}
    >
      <p>Transaction: {transaction}</p>
    </div>
  ));
  const RenderObject = ({ myObject }) => {
    const renderObjectProperties = (obj) => {
      return Object.entries(obj).map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // If the value is an object, recursively render its properties
          return (
            <li key={key}>
              <strong>{key}:</strong>
              <ul>{renderObjectProperties(value)}</ul>
            </li>
          );
        } else {
          // If the value is not an object, display the key-value pair
          return (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          );
        }
      });
    };

    return (
      <div>
        <h2>transaction Details</h2>
        <ul>{renderObjectProperties(myObject)}</ul>
      </div>
    );
  };

  console.log(receipt);
  return (
    <div className="App">
      <div className="blockNumber">
        <p onClick={onclick}>Block Number: {blockNumber}</p>
      </div>

      <div className={showtransactions ? "show transactions" : "hide"}>
        {" "}
        {transactionDivs}
      </div>
      {clickedTransaction && (
        <div className="clickedTransaction">
          <p>Selected Transaction: {clickedTransaction}</p>
        </div>
      )}

      {receipt && (
        <div className="receipt">
          {" "}
          <RenderObject myObject={receipt} />
        </div>
      )}
      <Account />
    </div>
  );
}

export default App;
