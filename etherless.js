var Web3 = require( 'web3')
const gsn = require('@opengsn/provider')
const ethers = require("ethers")



// const conf = {
// 	ourContract: '0x10A51A94d096e746E1Aec1027A0F8deCEC43FF63',
// 	notOurs:     '0x6969Bc71C8f631f6ECE03CE16FdaBE51ae4d66B1',
// 	paymaster:   '0x3f84367c25dC11A7aBE4B9ef97AB78d5D5498bF5',
// 	gasPrice:  20000000000   // 20 Gwei
// }

const conf = {
	ourContract: '0x7aFd3916D9d09BFa16Fb4Bed0E8d314387784C84',
	paymaster:   '0xD1ff5ef598803E24209E29d6d621A51279675900',
    forwarder: "0x4d4581c01A457925410cd3877d17b2fd4553b2C5",
	gasPrice:  20000000000   // 20 Gwei
}

var provider
var userAddr   // The user's address
let contract;


let abi = [ { "inputs": [ { "internalType": "string", "name": "baseurl", "type": "string" }, { "internalType": "uint32", "name": "cap", "type": "uint32" }, { "internalType": "string", "name": "placeHolder", "type": "string" }, { "internalType": "address", "name": "_forwarder", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Revealed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "customer", "type": "address" }, { "indexed": false, "internalType": "uint32", "name": "tokenCount", "type": "uint32" } ], "name": "Whitelisted", "type": "event" }, { "inputs": [ { "internalType": "address[]", "name": "customers", "type": "address[]" }, { "internalType": "uint32[]", "name": "tokenCounts", "type": "uint32[]" } ], "name": "addToWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "address", "name": "_operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "isOperator", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isRevealed", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarder", "type": "address" } ], "name": "isTrustedForwarder", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "customer", "type": "address" } ], "name": "isWhitelisted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint32", "name": "count", "type": "uint32" } ], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "reveal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "baseURI_", "type": "string" } ], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_placeholder", "type": "string" } ], "name": "setPlaceholder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "startingIndex", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "supplyCap", "outputs": [ { "internalType": "uint32", "name": "", "type": "uint32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

const initContract = async () => {

	if (!window.ethereum) {
		throw new Error('provider not found')
	  }
	  window.ethereum.on('accountsChanged', () => {
		console.log('acct');
		window.location.reload()
	  })
	window.ethereum.on('chainChanged', () => {
		console.log('chainChained');
		window.location.reload()
	})

	// const networkId = await window.ethereum.request({method: 'net_version'})
	
  	const gsnProvider = await gsn.RelayProvider.newProvider({
		provider: window.ethereum,
		config: { 
			paymasterAddress: conf.paymaster,
        	relayLookupWindowBlocks: 899,
			relayRegistrationLookupBlocks: 899,
			loggerConfiguration: {logLevel: 'debug'}
		} }).init()
	
	provider = new ethers.providers.Web3Provider(gsnProvider);
	
	const network = await provider.getNetwork();

	const signer = provider.getSigner();
	contract = new ethers.Contract(conf.ourContract, abi, signer)
	
	console.log("contract ", contract)
	return {contractAddress: conf.ourContract, network}
}


async function contractCall() {
	await window.ethereum.request({ method: 'eth_requestAccounts' })
	console.log("done")
	const tx = await contract.mint(1);

	console.log(`Transaction hash: ${tx.hash}`);
  
	const receipt = await tx.wait();
	console.log("RECEIPT ", receipt);
	console.log(`Mined in block: ${receipt.blockNumber}`)
  }


// const gsnContractCall = async () => {
// 	await connect2Gsn()
// 	// await provider.ready

// 	await window.ethereum.send('eth_requestAccounts')


//     console.log("provider", provider)

// 	if (provider?._network?.chainId != 80001) {
// 		alert("I only know the addresses for Mumbai")
// 		raise("Unknown network")
// 	}

// 	console.log("contract ", contract);

// 	const tx = await contract.mint(1)

// 	console.log(`Transaction hash: ${tx.hash}`);
  
// 	const receipt = await provider.waitForTransaction(tx.hash)
//     console.log("RECEIPT ", receipt);


// 	// const receipt = await provider.waitForTransaction(hash)
// 	// console.log(`Mined in block: ${receipt.blockNumber}`)
// }   // gsnContractCall


// window.app = {
// 	contractCall: contractCall,
// 	initContract: initContract,
// 	conf: conf,
// 	ethers: ethers,
// 	provider: provider,
// 	abi: abi,
// 	gsn: gsn
// }

window.app = {
	initContract,
	contractCall
}