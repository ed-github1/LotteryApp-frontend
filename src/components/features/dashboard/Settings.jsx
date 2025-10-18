import { BiMessage, BiUser } from 'react-icons/bi'
import { SiBinance } from 'react-icons/si'
import { motion } from 'framer-motion'

const Option = ({ Icon, title, description }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        backgroundColor: '#dbeafe'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="grid grid-cols-1 items-center justify-center border w-full p-8 bg-yellow-50 rounded-xl cursor-pointer"
    >
      <Icon className="text-3xl mb-2" />
      <p className="text-2xl font-bold font-secondary">{title}</p>
      <p className="text-gray-400 font-light">{description}</p>
    </motion.div>
  )
}

const Settings = () => {
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-6">
      <Option
        title="Messages"
        description="Change your profile, name, photo etc."
        Icon={BiMessage}
      />
      <Option
        title="Profile"
        description="Change your profile, name, photo etc."
        Icon={BiUser}
      />
      <Option
        title="Binance"
        description="SetUp your binance account to play"
        Icon={SiBinance}
      />
    </div>
  )
}

export default Settings
