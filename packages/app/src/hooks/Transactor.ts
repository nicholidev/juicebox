import { BigNumber } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Deferrable } from '@ethersproject/properties'
import {
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionRequest,
  Web3Provider,
} from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { notification } from 'antd'
import Notify, { InitOptions, TransactionEvent } from 'bnc-notify'
import { useCallback } from 'react'

export type TransactorCallback = (
  e?: TransactionEvent,
  signer?: JsonRpcSigner,
) => void

export type TransactorOptions = {
  onDone?: VoidFunction
  onConfirmed?: TransactorCallback
  onCancelled?: TransactorCallback
}

export type Transactor = (
  contract: Contract,
  functionName: string,
  args: any[],
  options?: TransactorOptions,
) => Promise<boolean>

// wrapper around BlockNative's Notify.js
// https://docs.blocknative.com/notify
export function useTransactor({
  provider,
  gasPrice,
}: {
  provider?: Web3Provider | JsonRpcProvider
  gasPrice?: BigNumber
}): Transactor | undefined {
  return useCallback(
    async (
      contract: Contract,
      functionName: string,
      args: any[],
      options?: TransactorOptions,
    ) => {
      if (!provider) return false

      const signer = provider.getSigner()

      const network = await provider.getNetwork()

      const notifyOpts: InitOptions = {
        dappId: '2f161484-1dae-4684-b0db-6ff7c4470e2e', // https://account.blocknative.com
        system: 'ethereum',
        networkId: network.chainId,
        darkMode: true,
        transactionHandler: txInformation => {
          console.log('HANDLE TX', txInformation)
          if (options && txInformation.transaction.status === 'confirmed') {
            options.onConfirmed && options.onConfirmed(txInformation, signer)
            options.onDone && options.onDone()
          }
          if (options && txInformation.transaction.status === 'cancelled') {
            options.onCancelled && options.onCancelled(txInformation, signer)
            options.onDone && options.onDone()
          }
        },
      }
      const notify = Notify(notifyOpts)

      let etherscanNetwork = ''
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + '.'
      }

      let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/'
      if (network.chainId === 100) {
        etherscanTxUrl = 'https://blockscout.com/poa/xdai/tx/'
      }

      const tx: Deferrable<TransactionRequest> = contract[functionName](...args)

      const reportArgs = Object.values(contract.interface.functions)
        .find(f => f.name === functionName)
        ?.inputs.reduce(
          (acc, input, i) => ({
            ...acc,
            [input.name]: args[i],
          }),
          {},
        )

      console.log('🧃 Calling ' + functionName + '() with args:', reportArgs)

      try {
        let result
        if (tx instanceof Promise) {
          console.log('AWAITING TX', tx)
          result = await tx
        } else {
          if (!tx.gasPrice) tx.gasPrice = gasPrice ?? parseUnits('4.1', 'gwei')

          if (!tx.gasLimit) tx.gasLimit = hexlify(120000)

          console.log('RUNNING TX', tx)
          result = await signer.sendTransaction(tx)
          await result.wait()
        }
        console.log('RESULT:', result)
        // console.log("Notify", notify);

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        const isNotifyNetwork =
          [1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0

        if (isNotifyNetwork) {
          const { emitter } = notify.hash(result.hash)
          emitter.on('all', transaction => ({
            onclick: () => window.open(etherscanTxUrl + transaction.hash),
          }))
        } else {
          console.log('LOCAL TX SENT', result.hash)
          if (result.confirmations) {
            options?.onConfirmed && options.onConfirmed(result, signer)
          } else {
            options?.onCancelled && options.onCancelled(result, signer)
          }
          options?.onDone && options.onDone()
        }

        return true
      } catch (e) {
        console.log('Transaction Error:', e.message)

        notification.error({
          key: new Date().valueOf().toString(),
          message: 'Transaction failed',
          description: e.message,
        })

        options?.onDone && options.onDone()
        return false
      }
    },
    [provider, gasPrice],
  )
}
