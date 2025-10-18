import { useEffect, useState } from 'react'
import RegisterForm from '../features/auth/RegisterForm'
import Notification from '../common/Notification'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [showNotif, setShowNotif] = useState(false)
  const { message } = useAuth()

  useEffect(() => {
    if (message) {
      setShowNotif(true)
    }
  }, [message])

  return (
    <>
      <Notification
        show={showNotif}
        type="success"
        onClose={() => setShowNotif(false)}
        message={message}
      />
  <div className="flex flex-col lg:flex-row min-h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className='w-full flex items-center justify-center'>
          <RegisterForm />
        </div>
     +
      </div>
    </>
  )
}

export default Register
