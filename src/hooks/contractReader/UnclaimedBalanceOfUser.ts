import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { BigNumber } from 'ethers'
import { ContractName } from 'models/contract-name'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUnclaimedBalanceOfUser() {
  const { userAddress } = useContext(NetworkContext)
  const { projectId, terminal } = useContext(ProjectContext)

  return useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
