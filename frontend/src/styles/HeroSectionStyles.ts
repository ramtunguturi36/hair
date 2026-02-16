const HeroSectionStyles = {
  section: "relative h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 overflow-hidden",
  textContainer: "z-10 text-center md:text-left max-w-lg animate-fade-in-up",
  title: "text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg",
  description: "text-lg md:text-xl text-gray-200 mb-8 leading-relaxed",
  getStartedButton: "btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-purple-500/50",

  // Moved gradientCircle into canvasContainer to ensure it’s behind the 3D model
  canvasContainer: "absolute inset-0 z-0",
  gradientCircle: `
    absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500 
    blur-3xl opacity-70 animate-gradientMove z-0
  `,
};

// Define animation for gradient movement
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradientMove {
    background-size: 200% 200%;
    animation: gradientMove 10s ease infinite;
  }
`;
document.head.appendChild(styleElement);

export default HeroSectionStyles;
