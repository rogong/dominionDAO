import Web3 from 'web3'
import {
  setAlert,
  setGlobalState,
  getGlobalState,
  setLoadingMsg,
} from './store'
import DominionDAO from './abis/DominionDAO.json'

const { ethereum } = window

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    console.log(JSON.stringify(error))
    // setAlert(JSON.stringify(error), 'red')
  }
}

const loadWeb3 = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    window.web3 = new Web3(ethereum)
    await ethereum.enable()

    window.web3 = new Web3(window.web3.currentProvider)

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setGlobalState('connectedAccount', accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = DominionDAO.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(DominionDAO.abi, networkData.address)
      const isStakeholder = await contract.methods.isStakeholder().call()

      setGlobalState('isStakeholder', isStakeholder)
      setGlobalState('contract', contract)
      console.log(contract)
      console.log(isStakeholder)
    } else {
      window.alert('DominionDAO contract not deployed to detected network.')
    }
  } catch (error) {
    alert('Please connect your metamask wallet!')
  }
}

const structuredNfts = (nfts) => {
  const web3 = window.web3
  return nfts
    .map((nft) => ({
      id: nft.id,
      to: nft.to,
      from: nft.from,
      cost: web3.utils.fromWei(nft.cost),
      title: nft.title,
      description: nft.description,
      timestamp: nft.timestamp,
    }))
    .reverse()
}

export { loadWeb3, connectWallet }
