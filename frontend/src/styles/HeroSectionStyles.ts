const HeroSectionStyles = {
  section: "relative min-h-[88vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-14 lg:px-20 pt-28 pb-14 md:pb-20 overflow-hidden isolate",
  textContainer: "z-10 text-center md:text-left max-w-2xl animate-slide-up-fade",
  title: "text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-cyan-700 leading-[1.08] mb-5 tracking-tight",
  description: "text-base md:text-xl text-slate-600 mb-8 leading-relaxed font-medium max-w-xl",
  getStartedButton: "btn-primary text-base md:text-lg px-8 py-4 group flex items-center justify-center gap-3 shadow-sm",

  // Modern atmospheric background and 3D canvas
  canvasContainer: "absolute inset-0 z-0 pointer-events-none md:pointer-events-auto opacity-95",
  gradientCircle: `
    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] 
    rounded-full bg-gradient-to-r from-cyan-200/35 via-sky-200/25 to-teal-200/30
    blur-[90px] opacity-80 animate-pulse-glow mix-blend-multiply -z-10
  `,
};

export default HeroSectionStyles;

