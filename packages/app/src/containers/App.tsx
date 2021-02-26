import { Web3Provider } from '@ethersproject/providers'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { useCallback, useState } from 'react'

import Navbar from '../components/Navbar'
import { localProvider } from '../constants/local-provider'
import { web3Modal } from '../constants/web3-modal'
import Router from '../containers/Router'
import { useContractLoader } from '../hooks/ContractLoader'
import useContractReader from '../hooks/ContractReader'
import { useUserAddress } from '../hooks/UserAddress'
import { useUserProvider } from '../hooks/UserProvider'
import { Budget } from '../models/budget'
import { budgetsEq } from '../utils/budgetsEq'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const userProvider = useUserProvider(injectedProvider, localProvider)

  const userAddress = useUserAddress(userProvider)

  const contracts = useContractLoader(userProvider)

  const budget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [userAddress],
    shouldUpdate: budgetsEq,
  })

  console.log('User:', userAddress, userProvider)

  return (
    <Layout
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'transparent',
      }}
    >
      <Navbar
        hasBudget={!!budget}
        userAddress={userAddress}
        onConnectWallet={loadWeb3Modal}
        shouldUseNetwork={
          userProvider &&
          userProvider.network?.chainId !== 3 &&
          process.env.NODE_ENV === 'production'
            ? 'Ropsten'
            : undefined
        }
      />

      <Content>
        <Router
          activeBudget={budget}
          userAddress={userAddress}
          contracts={contracts}
          userProvider={userProvider}
          onNeedProvider={loadWeb3Modal}
        />
      </Content>
    </Layout>
  )
}

export default App