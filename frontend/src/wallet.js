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
    name: 'Validator Notifier',
    icon: myIcon, // svg string icon
    description: 'Swap tokens for other tokens',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
  },
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: 'custom text header'
        }
      }
    }
  }
})