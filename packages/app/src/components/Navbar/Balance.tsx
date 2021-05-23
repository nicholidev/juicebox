import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import EthPrice from 'components/Dashboard/EthPrice'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { useEtherPrice } from 'hooks/EtherPrice'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/formatCurrency'

export default function Balance({ userAddress }: { userAddress?: string }) {
  const { signingProvider } = useContext(UserContext)
  const [dollarMode, setDollarMode] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const usdPerEth = useEtherPrice()

  // get updated balance
  usePoller(
    () => {
      if (!userAddress || !signingProvider) return

      try {
        signingProvider.getBalance(userAddress).then(setBalance)
      } catch (e) {
        console.log('Error getting balance', e)
      }
    },
    [userAddress, signingProvider],
    30000,
  )

  const displayBalance =
    usdPerEth && dollarMode
      ? `$${balance ? formatWad(balance.mul(usdPerEth).toString()) : '--'}`
      : `${parseFloat(formatWad(balance) ?? '0').toFixed(4)}ETH`

  if (!userAddress) return null

  return (
    <div
      style={{
        verticalAlign: 'middle',
        cursor: 'pointer',
        lineHeight: 1,
      }}
      onClick={() => setDollarMode(!dollarMode)}
    >
      {displayBalance}
      <div style={{ color: colors.text.tertiary }}>
        <EthPrice />
      </div>
    </div>
  )
}
