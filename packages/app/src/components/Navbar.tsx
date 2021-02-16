import { JsonRpcProvider } from '@ethersproject/providers'
import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import Account from './Account'

export default function Navbar({
  userAddress,
  hasBudget,
  userProvider,
  onConnectWallet,
}: {
  userAddress?: string
  hasBudget?: boolean
  userProvider?: JsonRpcProvider
  onConnectWallet: VoidFunction
}) {
  const menuItem = (text: string, route: string) => {
    const external = route.startsWith('http')

    return (
      <a
        style={{ fontWeight: 600 }}
        href={route}
        {...(external
          ? {
              target: '_blank',
              rel: 'noreferrer',
            }
          : {})}
      >
        {text}
      </a>
    )
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <Menu
        mode="horizontal"
        theme="light"
        style={{ display: 'inline-block', border: 'none' }}
      >
        <Menu.Item key="logo" style={{ marginLeft: 0 }}>
          <a href="/" style={{ display: 'inline-block' }}>
            <img
              style={{ height: 40 }}
              src="/assets/juice_logo-ol.png"
              alt="Juice logo"
            />
          </a>
        </Menu.Item>
        {hasBudget && userAddress ? (
          <Menu.Item key="budget">
            {menuItem('Your budget', '/#/' + userAddress)}
          </Menu.Item>
        ) : (
          <Menu.Item key="create">
            {menuItem('Get to work', '/#/create')}
          </Menu.Item>
        )}
        <Menu.Item key="fluid-dynamics">
          {menuItem(
            'Fluid dynamics',
            'https://www.figma.com/file/ZklsxqZUsjK3XO5BksCyE4/Juicy-Funstuff?node-id=0%3A1',
          )}
        </Menu.Item>
      </Menu>
      <Account
        userProvider={userProvider}
        loadWeb3Modal={onConnectWallet}
        userAddress={userAddress}
      />
    </Header>
  )
}
