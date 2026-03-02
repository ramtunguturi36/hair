const NavbarStyles = {
  navbar: "fixed w-full z-50 transition-all duration-500 bg-white/60 backdrop-blur-2xl border-b border-brand-light shadow-glass-sm",
  container: "max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center h-24",
  logo: "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-textDark to-brand-textLight flex items-center gap-3 tracking-tighter hover:scale-105 transition-transform duration-300",
  toggleButton: "text-brand-textDark text-2xl hover:text-accent-cyan focus:outline-none transition-colors",
  navLinks: "hidden md:flex space-x-10 items-center bg-white/80 px-8 py-3 rounded-full border border-brand-light shadow-sm",
  link: "text-sm font-bold text-brand-textLight hover:text-brand-textDark transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-accent-purple hover:after:w-full after:transition-all after:duration-300",
  mobileMenu: "md:hidden absolute top-24 left-0 w-full bg-white border-t border-brand-light p-6 flex flex-col space-y-6 shadow-2xl origin-top animate-slide-up-fade",
  mobileLink: "block text-lg font-bold text-brand-textLight hover:text-accent-purple transition-colors",
  actionButtons: "hidden md:flex items-center space-x-5",
  loginButton: "text-sm font-bold text-brand-textLight hover:text-accent-purple transition-colors",
  getStartedButton: "btn-primary py-2.5 px-6 text-sm",
};

export default NavbarStyles;