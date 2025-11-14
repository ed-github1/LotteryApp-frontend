import { BsInstagram, BsTelephone, BsTiktok, BsTwitterX } from 'react-icons/bs'
import Footer from '../layout/Footer'
import Navbar from '../layout/Navbar'
import TicketCard from '../layout/TicketCard'
import { MdEmail } from 'react-icons/md'
import DrawCountdown from '../common/DrawCountdown'
import mobilePhoneImg from '../../assets/banners/mobilephone.png'
import heroBg from '../../assets/banners/hero.jpg'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const Home = () => {
  const { t } = useTranslation()
  return (
    <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <div className="min-h-[72vh] flex flex-col text-white overflow-hidden ">
        <Navbar />
        <section
          className="relative w-full min-h-screen max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-8 sm:pb-12 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(2,12,40,0.92), rgba(2,12,40,0.7)), url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'multiply'
          }}
        >
          <div className="flex flex-col-reverse md:flex-col items-center justify-center gap-5 mt-5 lg:flex-row lg:gap-12">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-white max-w-2xl">{t('home.hero.title')}</h1>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0">{t('home.hero.subtitle')}</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
               {t('home.hero.getStarted')}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="flex items-center justify-center flex-1 lg:flex-none">
              <div className="relative">
                <img src={mobilePhoneImg} alt="mobile mockup" className="w-[250px] sm:w-[300px] md:w-[360px] lg:w-[320px] xl:w-[360px] rounded-3xl shadow-2xl object-cover relative z-10 mt-10" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Next Draw Banner */}
      <section className="w-full py-8 sm:py-12 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white/8 backdrop-blur-lg border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{t('home.nextDraw.title')}</h2>
              <p className="text-sm sm:text-base text-white/70">{t('home.nextDraw.subtitle')}</p>
            </div>

            {/* Self-contained DrawCountdown component */}
            <DrawCountdown />

            <div className="text-center mt-6 sm:mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base"
              >
                {t('home.nextDraw.playNow')}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="w-full text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contactDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contactDots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {t('home.contact.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t('home.contact.subtitle')}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Contact Info Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#FFC300]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/8 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/12 transition-all duration-300 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC300] flex items-center justify-center mb-4 sm:mb-6">
                  <BsTelephone className="text-lg sm:text-xl text-[#232946]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('home.contact.getInTouch')}</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-white/80 hover:text-white transition-colors text-sm sm:text-base">
                    <BsTelephone className="text-xs sm:text-sm flex-shrink-0" />
                    <span className="break-all sm:break-normal">+1 (742) 322-212-12</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-white/80 hover:text-white transition-colors text-sm sm:text-base">
                    <MdEmail className="text-xs sm:text-sm flex-shrink-0" />
                    <span className="break-all sm:break-normal">hello@worldlottery.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#FFC300]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/8 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/12 transition-all duration-300 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC300] flex items-center justify-center mb-4 sm:mb-6">
                  <BsInstagram className="text-lg sm:text-xl text-[#232946]" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('home.contact.followUs')}</h3>
                <p className="text-white/70 mb-4 sm:mb-6 text-xs sm:text-sm">{t('home.contact.followSubtitle')}</p>
                <div className="flex gap-3 sm:gap-4">
                  <a href="https://instagram.com" aria-label="Instagram" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFC300] hover:text-[#232946] transition-all duration-300">
                    <BsInstagram className="text-sm sm:text-lg" />
                  </a>
                  <a href="https://twitter.com" aria-label="Twitter" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFC300] hover:text-[#232946] transition-all duration-300">
                    <BsTwitterX className="text-sm sm:text-lg" />
                  </a>
                  <a href="https://tiktok.com" aria-label="TikTok" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFC300] hover:text-[#232946] transition-all duration-300">
                    <BsTiktok className="text-sm sm:text-lg" />
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#FFC300]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/8 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/12 transition-all duration-300 h-full flex flex-col sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC300] flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#232946]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('home.contact.startPlaying')}</h3>
                <p className="text-white/70 mb-4 sm:mb-6 text-xs sm:text-sm flex-1">{t('home.contact.startPlayingDesc')}</p>
                <Link to="/register" className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#232946] font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base">
                  {t('home.contact.getStarted')}
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
