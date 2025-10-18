import { FaBitcoin, FaEthereum, FaMonero, FaDog } from 'react-icons/fa'
import { SiLitecoin } from 'react-icons/si'

export const CRYPTO_PROVIDERS = [
  {
    name: 'Bitcoin',
    icon: <FaBitcoin className="text-yellow-500" />,
    code: 'BTC'
  },
  {
    name: 'Ethereum',
    icon: <FaEthereum className="text-indigo-400" />,
    code: 'ETH'
  },
  {
    name: 'Monero',
    icon: <FaMonero className="text-orange-500" />,
    code: 'XMR'
  },
  {
    name: 'Litecoin',
    icon: <SiLitecoin className="text-blue-400" />,
    code: 'LTC'
  },
  {
    name: 'Dogecoin',
    icon: <FaDog className="text-yellow-400" />,
    code: 'DOGE'
  }
]
