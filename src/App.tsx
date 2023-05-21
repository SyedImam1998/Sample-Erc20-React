import React from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ethers, Contract } from "ethers";
import contractAbi from "../src/assets/EmissionToken.json";

const App = () => {
  const [count, setCount] = React.useState(0);
  const [provider, setProvider] = React.useState<any>();
  const [account, setAccount] = React.useState<any>();
  const [contract, setContract] = React.useState<any>();
  const contractAddress = "0x23D30fc87eF557097b8D25f7Cc06f30ac569e110";
  const [operation, setOperation] = React.useState("");
  const [wallet, setWallet] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [selectedAddress, setSelectedAddress] = React.useState("");
  const [transfervalue, settransfervalue] = React.useState("");
  const [burnValue, setBurnValue] = React.useState("");

  const transferAddress = [
    "Select An Address",
    "0xd05ea27c5bcACCeaf2ADe96faCA70f302CBFeBA0",
    "0x301826c1199943b990dB086641c64655D2f4d049",
    "0xb2e0885f39b7bA39cc74767eE6024Ec6dDFa6aa6",
  ];

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const signer = await provider.getSigner();
    setAccount(signer);
    console.log("signer", signer.address);
    setWallet(signer.address);
    const contractInstance = new Contract(
      contractAddress,
      contractAbi.abi,
      signer
    );
    setContract(contractInstance);
    const value = await contractInstance.balanceOf(signer.address);
    const balance = value;
    console.log("value", value);
    const decimals = 18;
    const formattedBalance = balance.toString().padStart(decimals + 1, "0");
    console.log("formattedBalance", formattedBalance);
    // const balanceWithDecimal = `${formattedBalance.slice(0, -decimals)}.${formattedBalance.slice(-decimals)}`;
    const balanceWithDecimal = `${formattedBalance.slice(
      0,
      -decimals
    )}.${formattedBalance.slice(-decimals, -decimals + 5)}`;

    console.log(balanceWithDecimal);
    setBalance(balanceWithDecimal);
  };

  const transferFun = async () => {
    const value = ethers.parseUnits(transfervalue, 18);
    const tx = await contract
      .transfer(selectedAddress, value)
      .then((res: any) => {
        alert("Wait for Transaction to Mine");

      }).catch((e:any)=>{
        console.log('e', e)

      })

      
  };
  const mintFun = async () => {
    const value = ethers.parseUnits(transfervalue, 18);
    const tx = await contract
      .mint(selectedAddress, value)
      .then((res: any) => {
        alert("Wait for Transaction to Mine");

      }).catch((e:any)=>{
        console.log('e', e)

      })

      
  };
  const burnFun = async () => {
    const value = ethers.parseUnits(burnValue, 18);
    console.log('value', value)
    console.log('contract', contract)
    const tx = await contract
      .burn(value)
      .then((res: any) => {
        alert("Wait for Transaction to Mine");
      }).catch((e:any)=>{
        console.log('e', e)

      })

      
  };

  React.useEffect(() => {
    const checkMetamaskAndConnect = async () => {
      if (window.ethereum) {
        console.log("Metamask Detected!!!!");
        await connectWallet();
      } else {
        alert("Please install Metamask!!!");
      }
    };

    checkMetamaskAndConnect();
  }, []);

  let contentToRender;

  switch (operation) {
    case "transfer":
      contentToRender = (
        <div>
          <div>
            <select className="selectInput" onChange={(e) => setSelectedAddress(e.target.value)}>
              {transferAddress.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <input type="text"
              placeholder="Enter value"
              className="selectInput input"
              onChange={(e) => settransfervalue(e.target.value)}
            ></input>
          </div>
          <div>
            <button onClick={transferFun}>Transfer</button>
          </div>
        </div>
      );
      break;
    case "mint":
      contentToRender = (
        <div>
          <div>
            <select className="selectInput" onChange={(e) => setSelectedAddress(e.target.value)}>
              {transferAddress.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <input type="text"
              placeholder="Enter value"
              className="selectInput input"
              onChange={(e) => settransfervalue(e.target.value)}
            ></input>
          </div>
          <div>
            <button onClick={mintFun}>Mint</button>
          </div>
        </div>
      );
      break;
    case "burn":
      contentToRender = (
        <div>
          <div>
            <input type="text" className="selectInput" placeholder="Enter Number of token to Burn 🔥" onChange={(e)=>setBurnValue(e.target.value)} />
          </div>
          <div>
            <button onClick={burnFun}>Burn 🔥</button>
          </div>
        </div>
      );
      break;
    default:
      contentToRender = <div>Select an Operation Above</div>;
      break;
  }
  return (
    <div className="App">
      <div>Account:{wallet}</div>
      <div>Balance:{balance}</div>
      <div>
        <select className="selectInput"
          onChange={(e) => {
            console.log("value", e.target.value);
            setOperation(e.target.value);
          }}
        >
          <option value="">Select an Operation</option>
          <option value="transfer">Transfer Tokens</option>
          <option value="mint">Mint Tokens</option>

          <option value="burn">Burn Tokens</option>
        </select>
      </div>

      <div>{contentToRender}</div>
    </div>
  );
};

export default App;
