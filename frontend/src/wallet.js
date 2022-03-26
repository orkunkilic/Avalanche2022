import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import myIcon from './logo.svg'

const injected = injectedModule()

export const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0xa869',
      token: 'AVAX',
      label: 'Avalanche FUJI',
      rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc'
    },
  ],
  appMetadata: {
    name: 'ExpiryDator',
    icon: myIcon, // svg string icon
    description: 'Get notified when validators of your subnet is about to expire',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
  },
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: 'Connect your wallet'
        }
      }
    }
  }
})