const Footer = () => {
  return (
    <>
      <footer className="w-full  text-[#F5F5F5] py-6 h-44">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="text-lg  font-bold tracking-wide">
            World Superlotto
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-[#FFD700] transition">Terms</a>
            <a href="#" className="hover:text-[#FFD700] transition">Privacy</a>
            <a href="#" className="hover:text-[#FFD700] transition">Contact</a>
          </div>
          <div className="text-xs text-[#FFD700]">
            &copy; {new Date().getFullYear()} The Global Lottery. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer