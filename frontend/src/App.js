import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { CONTACT_ABI, CONTACT_ADDRESS } from './config'

function App() {
  // your state
  const [account, setAccount] = useState()
  const [balance, setBalance] = useState()

  const [contactList, setContactList] = useState()
  const [contacts, setContacts] = useState([])

  const [inputAddress, setInputAddress] = useState()
  const [inputAmount, setInputAmount] = useState()

  let web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')

  const addressWithMetaMask = [
    '0x112aeb6d62c2FBdA6D631E2C9a44B899265C8f36',
    '0x1718859589abea78a93ca8a79C3657188267e2Aa',
    '0x90A74fA5147CF519F5C7ef4194A81FacDD2319f0',
  ]

  window.ethereum.on('accountsChanged', function (accounts) {
    setAccount(undefined)
    // Time to reload your interface with accounts[0]!
  })

  window.ethereum.on('networkChanged', function (networkId) {
    // Time to reload your interface with the new networkId
  })

  useEffect(() => {
    async function load() {
      // get accounts from web3
      const accounts = await web3.eth.requestAccounts()
      setAccount(accounts[0])

      // get balance
      const balance = await web3.eth.getBalance(accounts[0])
      setBalance(balance)

      // get contact list
      const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS)
      setContactList(contactList)

      for (let index = 0; index < addressWithMetaMask.length; index++) {
        const contact = await contactList.methods.accounts(addressWithMetaMask[index]).call()
        setContacts(prevContacts => [...prevContacts, contact])
      }
    }

    if (!account) {
      load()
    }
  }, [account])

  // const balanceFormatter = balance => {
  //   return balance / 1000000000000000000 + ' ' + 'ETH'.toString()
  // }

  const handleChangeInput = async (key, value) => {
    if (key === 'address') setInputAddress(value)
    if (key === 'value') setInputAmount(value)
  }

  const transferal = async type => {
    if (type === 'eth') {
      return web3.eth.sendTransaction({ from: account, to: inputAddress, value: inputAmount })
    }
    const response = await contactList.methods.transfer(inputAddress, inputAmount).send({ from: account })
    console.log('response', response)
  }

  const createAccount = async () => {
    await contactList.methods.createAccount().send({ from: account })
  }

  const getReceipt = async (hash, callback) => {
    const receipt = await web3.eth.getTransactionReceipt(hash)
    if (receipt) {
      return callback(receipt)
    }
    setTimeout(() => {
      getReceipt(hash, callback)
    }, 1000)
  }

  console.log('balance', balance)

  return (
    <div style={{ padding: '4rem' }}>
      {contacts.map(item => {
        if (item.userAddress === account) {
          return (
            <div key={item.userAddress} style={{ border: '1px solid', padding: '1rem' }}>
              <h1>You Address Detail</h1>
              <h3>You account is: {item.userAddress}</h3>
              <h3>You Local balance is: {item.balance} coin</h3>
            </div>
          )
        }
        return null
      })}

      <div style={{ border: '1px solid', padding: '1rem' }}>
        {contacts.map((item, index) => {
          if (item.userAddress !== account) {
            return (
              <div key={item.userAddress}>
                <h3>You account is: {item.userAddress}</h3>
                <h3>You Local balance is: {item.balance} coin</h3>
              </div>
            )
          }
          return null
        })}
      </div>

      <div style={{ border: '1px solid', borderTop: 'none', padding: '1rem' }}>
        <h3> CREATE ACCOUNT WITH METAMASK </h3>
        <button onClick={() => createAccount()}> createAccount </button>
      </div>

      <div style={{ border: '1px solid', borderTop: 'none', padding: '1rem' }}>
        <h3> SEND LOCAL COIN</h3>
        <span> address </span> <input onChange={event => handleChangeInput('address', event.target.value)} />
        <span> amount </span> <input onChange={event => handleChangeInput('value', event.target.value)} />
        <button onClick={() => transferal('local')}> Transfer </button>
      </div>

      <div style={{ border: '1px solid', borderTop: 'none', padding: '1rem' }}>
        <h3> SEND ETH</h3>
        <span> address </span> <input onChange={event => handleChangeInput('address', event.target.value)} />
        <span> amount </span> <input onChange={event => handleChangeInput('value', event.target.value)} />
        <button onClick={() => transferal('eth')}> Transfer </button>
      </div>
    </div>
  )
}

export default App
