const HeroSectionStyles = {
  section: "relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 overflow-hidden bg-brand-surface isolate",
  textContainer: "z-10 text-center md:text-left max-w-2xl animate-slide-up-fade",
  title: "text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-textDark via-brand-textLight to-gray-400 leading-[1.1] mb-6 drop-shadow-sm tracking-tight",
  description: "text-lg md:text-2xl text-brand-textLight mb-10 leading-relaxed font-medium max-w-xl",
  getStartedButton: "btn-primary text-lg px-10 py-5 group flex items-center justify-center gap-3 shadow-glow-purple",

  // Modern atmospheric background and 3D canvas
  canvasContainer: "absolute inset-0 z-0 pointer-events-none md:pointer-events-auto",
  gradientCircle: `
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] 
    rounded-full bg-gradient-to-r from-accent-purple/10 via-accent-cyan/10 to-accent-pink/10 
    blur-[100px] opacity-80 animate-pulse-glow mix-blend-multiply -z-10
  `,
};

export default HeroSectionStyles;

