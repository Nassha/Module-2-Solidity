import {useState, useEffect,useRef} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";


export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [showTransactions,setShowTransactions]=useState(false);
  const [valDeposit,setValDeposit]=useState(0);
  const [valWithdraw,setValWithdraw]=useState(0);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;
  const refDep = useRef(null);
  const refWid = useRef(null);

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    // after wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const performTransact=()=> {
    if (showTransactions==true){
      setShowTransactions(false)
    }
    else{
      setShowTransactions(true)
    }
  }

  const deposit = async() => {
    try{
      if (atm) {
        let tx = await atm.deposit(valDeposit);
        await tx.wait()
        getBalance();
        refDep.current.value='';
      }
    }catch{}
    
  }

  const withdraw = async() => {
    try{
      if (atm) {
        let tx = await atm.withdraw(valWithdraw);
        await tx.wait()
        getBalance();
        refWid.current.value='';
      }
    }catch{}
  
  }

  function fetchDeposit(input){
    setValDeposit(input.target.value)
  }
  function fetchWithdraw(input){
    setValWithdraw(input.target.value)
  }
  const initUser = () => {
    
    if (!ethWallet) { // to check if user has metamask
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    if (!account) { // to check if user is connected
      return <button onClick={connectAccount} id='firstbtn'><a>Connect Metamask wallet</a></button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p id="label"><span id='acct'>Your Account: </span> {account}</p>
        <p id="label"><span id='acct'>Your Balance: </span>{balance}</p>
        <button onClick={performTransact} id="showTransact">Show Transactions</button>
        {showTransactions && (
          <div>
            <br/>
            <input type="text" onChange={fetchDeposit} id="input" ref={refDep}/>
            <button onClick={deposit} id="transbtn" >Deposit</button>
            <br/>
            <input type="text" onChange={fetchWithdraw} id="input" ref={refWid}/>
            <button onClick={withdraw} id="transbtn">Withdraw</button>
          </div>
        )}
        
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1 id="message">Welcome to the <br/><span id="company">Metacrafters ATM!</span></h1></header>
      {initUser()}
    </main>
  )
}