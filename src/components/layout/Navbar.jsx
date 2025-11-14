import { Link } from 'react-router-dom'
import { IoGrid } from 'react-icons/io5'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import LanguageSelector from '../common/LanguageSelector'

const Links = ({ to, className, text, onClick }) => (
  <Link
    to={to}
    className={`inline-block min-w-[80px] text-center rounded-md px-3 py-2 transition font-semibold ${className}`}
    onClick={onClick}
  >
    {text}
  </Link>
)


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation links (left)
  const navLinks = [
    { to: '/Faqs', text: "FAQs" },
    { to: '/How-to-Play', text: 'How to play' },
    { to: '/Contact', text: 'Contact' },
  ];

  return (
    <nav className="w-full z-50 flex justify-center px-2 py-4 bg-transparent absolute">
      <div className="max-w-5xl w-full flex items-center justify-between rounded-full
      shadow-xl backdrop-blur-xl px-4 sm:px-8 py-2 border border-white/40">
        {/* Left: nav links */}
        <div className="hidden md:flex gap-2 lg:gap-4">
          {navLinks.map(link => (
            <Links
              key={link.to}
              to={link.to}
              className="text- font-medium white px-3 py-2 rounded-lg hover:bg-white/60 transition"
              text={link.text}
            />
          ))}
        </div>

        {/* Center: logo */}
        <div className="flex-1 flex justify-center items-center">
          <Link to="/" className="inline-flex items-center">
            <span className="text-2xl font-sans text-white font-extrabold">World Superlotto</span>
          </Link>
        </div>

        {/* Right: login & CTA */}
        <div className="hidden md:flex items-center gap-2">
          <div className="mr-2">
            <LanguageSelector />
          </div>
          <Link to="/login" className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/60 transition">Login</Link>
          <Link to="/register" className="ml-2 px-5 py-2 rounded-full bg-amber-400 hover:bg-orange-600 text-white font-bold shadow transition">Sign Up</Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-3xl focus:outline-none text-white z-20"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/40 z-10" onClick={() => setMenuOpen(false)}></div>
        )}

        {/* Mobile menu */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95vw] max-w-sm bg-white/95 rounded-3xl shadow-2xl z-30 flex flex-col items-center gap-2 py-8 px-6 border border-white/60 transition-all duration-300 ${menuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <button className="absolute top-4 right-4 text-2xl text-white" onClick={() => setMenuOpen(false)}><FiX /></button>
          <Link to="/" className="mb-6 text-2xl font-secondary tracking-tight  text-neutral-900" onClick={() => setMenuOpen(false)}>World Superlotto</Link>
          {navLinks.map(link => (
            <Links
              key={link.to}
              to={link.to}
              className="w-full text-neutral-700 font-semibold text-lg px-4 py-3 rounded-xl hover:bg-orange-50 text-center"
              text={link.text}
              onClick={() => setMenuOpen(false)}
            />
          ))}
          <div className="w-full mt-4 mb-2">
            <LanguageSelector />
          </div>
          <Link to="/login" className="w-full text-neutral-700 font-semibold text-lg px-4 py-3 rounded-xl hover:bg-orange-50 text-center mt-2" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="w-full mt-2 px-5 py-3 rounded-ful text-neutral-700 font-bold shadow text-center transition" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
