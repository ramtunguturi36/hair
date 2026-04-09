const NavbarStyles = {
  navbar: "fixed w-full z-50 transition-all duration-500 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm",
  container: "max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center h-20",
  logo: "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-textDark to-brand-textLight flex items-center gap-3 tracking-tighter hover:scale-105 transition-transform duration-300",
  toggleButton: "text-slate-700 text-2xl hover:text-cyan-700 focus:outline-none transition-colors",
  navLinks: "hidden md:flex space-x-8 items-center bg-white/90 px-7 py-2.5 rounded-full border border-slate-200 shadow-sm",
  link: "text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-600 hover:after:w-full after:transition-all after:duration-300",
  mobileMenu: "md:hidden absolute top-20 left-0 w-full bg-white border-t border-slate-200 p-6 flex flex-col space-y-5 shadow-xl origin-top animate-slide-up-fade",
  mobileLink: "block text-lg font-semibold text-slate-700 hover:text-cyan-700 transition-colors",
  actionButtons: "hidden md:flex items-center space-x-5",
  loginButton: "text-sm font-semibold text-slate-600 hover:text-cyan-700 transition-colors",
  getStartedButton: "btn-primary py-2.5 px-6 text-sm shadow-sm",
};

export default NavbarStyles;