import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import React, { useState } from 'react'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import BudgetDetail from './BudgetDetail'

export default function BudgetsHistory({
  contracts,
  transactor,
  userAddress,
  startId,
}: {
  contracts?: Contracts
  transactor?: Transactor
  userAddress?: string
  startId?: BigNumber
}) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [poolNumbers, setPoolNumbers] = useState<BigNumber[]>([])

  if (startId !== undefined && !poolNumbers.length) setPoolNumbers([startId])

  const allPoolsLoaded = budgets.length >= poolNumbers.length
  const poolNumber = allPoolsLoaded
    ? undefined
    : poolNumbers[poolNumbers.length - 1]
  const pollTime = allPoolsLoaded ? undefined : 100

  useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getBudget',
    args: [poolNumber],
    pollTime,
    callback: budget => {
      if (
        !budget ||
        !poolNumber ||
        poolNumbers.includes(budget.previous) ||
        budget.id.eq(0)
      )
        return
      setBudgets([...budgets, budget])
      setPoolNumbers([
        ...poolNumbers,
        ...(budget.previous.toNumber() > 0 ? [budget.previous] : []),
      ])
    },
  })

  const budgetElems = (
    <Space direction="vertical" size="large">
      {budgets.length
        ? budgets.map((budget, index) => (
            <BudgetDetail
              key={index}
              userAddress={userAddress}
              budget={budget}
              transactor={transactor}
              contracts={contracts}
            />
          ))
        : 'No history'}
    </Space>
  )

  return (
    <div>
      {budgetElems}

      {allPoolsLoaded ? null : <div>Loading...</div>}
    </div>
  )
}
