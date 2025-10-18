
import { useState } from 'react'
import { motion } from 'framer-motion'

const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
  <motion.button
    type="button"
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:ring-offset-2 focus:ring-offset-gray-800 ${
      enabled 
        ? 'bg-gradient-to-r from-green-400 to-green-600' 
        : 'bg-gray-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    whileTap={!disabled ? { scale: 0.95 } : {}}
  >
    <motion.span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
      layout
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
    />
  </motion.button>
)

const SecurityActions = ({ editMode, handleCancel, handleSave }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [enable2FA, setEnable2FA] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  return (
    <div className="space-y-8">
      {/* Change Password Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white">Change Password</h4>
        </div>
        {editMode ? (
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300"
                placeholder="Enter new password"
              />
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white/60">
            ••••••••••••
          </div>
        )}
      </div>

      {/* Security Settings */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white">Security Settings</h4>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-white/60 text-sm">Add an extra layer of security</p>
            </div>
          </div>
          <ToggleSwitch 
            enabled={enable2FA} 
            onChange={setEnable2FA} 
            disabled={!editMode}
          />
        </div>

        {/* Privacy Consent */}
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Personalized Offers</p>
              <p className="text-white/60 text-sm">Receive tailored promotions</p>
            </div>
          </div>
          <ToggleSwitch 
            enabled={privacyConsent} 
            onChange={setPrivacyConsent} 
            disabled={!editMode}
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-white/60 text-sm">Draw results and updates</p>
            </div>
          </div>
          <ToggleSwitch 
            enabled={emailNotifications} 
            onChange={setEmailNotifications} 
            disabled={!editMode}
          />
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">SMS Notifications</p>
              <p className="text-white/60 text-sm">Important alerts via text</p>
            </div>
          </div>
          <ToggleSwitch 
            enabled={smsNotifications} 
            onChange={setSmsNotifications} 
            disabled={!editMode}
          />
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white">Account Actions</h4>
        </div>

        {editMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.button 
              type="button" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] font-bold rounded-xl shadow-lg hover:shadow-[#FFD700]/25 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleSave}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </motion.button>
            <motion.button 
              type="button" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleCancel}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </motion.button>
            {/* Delete Account button removed */}
          </div>
        ) : (
          null
        )}
      </div>
    </div>
  )
}

export default SecurityActions