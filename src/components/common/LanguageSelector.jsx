import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { BiGlobe, BiChevronDown } from 'react-icons/bi'

const LanguageSelector = () => {
  const { currentLanguage, languages, changeLanguage, getCurrentLanguage, translate } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  const currentLang = getCurrentLanguage()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors duration-200 w-full"
        aria-label={translate('language')}
      >
        <BiGlobe className="text-yellow-300 text-lg" />
        <span className="flex items-center gap-2 flex-1">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm font-medium">{currentLang.name}</span>
        </span>
        <BiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#232946]/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  currentLanguage === language.code ? 'bg-yellow-300/20 text-yellow-300' : 'text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <svg className="w-4 h-4 ml-auto text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSelector
