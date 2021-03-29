import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { Contracts } from 'models/contracts'
import { NetworkName } from 'models/network-name'
import { Transactor } from 'models/transactor'
import { createContext } from 'react'

export const UserContext: React.Context<{
  signingProvider?: Web3Provider
  userAddress?: string
  network?: NetworkName
  contracts?: Contracts
  transactor?: Transactor
  onNeedProvider: () => Promise<void>
  userHasProjects?: boolean
  adminFeePercent?: number
  weth?: Partial<{
    contract: Contract
    symbol: string
    address: string
  }>
}> = createContext({
  onNeedProvider: () => Promise.resolve(),
})
