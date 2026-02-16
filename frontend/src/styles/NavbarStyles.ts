const NavbarStyles = {
  navbar: "fixed w-full z-50 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-white/10",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20",
  logo: "text-2xl font-bold text-white flex items-center gap-2",
  toggleButton: "text-white text-2xl focus:outline-none",
  navLinks: "hidden md:flex space-x-8 items-center",
  link: "text-gray-300 hover:text-white transition-colors duration-200 font-medium",
  mobileMenu: "md:hidden absolute top-20 left-0 w-full bg-gray-900 border-t border-gray-800 p-4 flex flex-col space-y-4",
  mobileLink: "block text-gray-300 hover:text-white py-2",
  actionButtons: "hidden md:flex items-center space-x-4",
  loginButton: "text-white font-medium hover:text-purple-300 transition-colors",
  getStartedButton: "btn-primary py-2 px-5 text-sm",
};

export default NavbarStyles;