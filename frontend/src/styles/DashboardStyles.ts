const DashboardStyles = {
  container: "flex min-h-screen bg-gradient-to-br from-gray-50 to-purple-50",
  mobileToggle: "flex md:hidden justify-between items-center bg-gray-800 text-white px-4 py-3",
  mobileTitle: "text-2xl font-bold",
  toggleButton: "focus:outline-none",
  toggleIcon: "text-2xl",
  sidebar: "bg-white/90 backdrop-blur-xl text-gray-700 w-72 h-screen fixed md:sticky top-0 left-0 py-8 px-5 shadow-2xl border-r border-white/50 flex flex-col justify-between z-40 transition-transform duration-300",
  logoContainer: "flex items-center justify-center py-4 mb-6",
  logoImage: "w-10 h-10",
  logoText: "text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 ml-3",
  nav: "space-y-4 flex-1", // Makes the nav section flexible
  navLink: "flex items-center py-3.5 px-5 rounded-xl transition-all duration-300 group hover:bg-purple-50",
  navIcon: "mr-3 text-gray-600",
  navText: "text-base font-semibold group-hover:translate-x-1 transition-transform",
  activeLink: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200",
  sidebarFooter: "self-end flex flex-col items-center py-4 border-t border-gray-300", // Adjusted to self-end
  credits: "text-sm font-medium text-gray-600 mb-2",
  avatarContainer: "cursor-pointer",
  avatarImage: "w-12 h-12 rounded-full border-2 border-purple-200 p-0.5 mb-2 hover:scale-105 transition-transform",
  userInfo: "text-center",
  userName: "text-sm font-semibold text-gray-800",
  userEmail: "text-xs text-gray-500",
  userCard: "absolute right-16 top-20 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50",
  cardHeader: "flex items-center mb-2",
  cardAvatar: "w-12 h-12 rounded-full border-2 border-gray-300 mr-2",
  cardUserName: "font-semibold",
  cardUserEmail: "text-sm text-gray-500",
  mainContent: "flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12",
};

export default DashboardStyles;
