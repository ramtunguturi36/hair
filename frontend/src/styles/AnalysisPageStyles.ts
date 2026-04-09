const AnalysisPageStyles = {
  container: "min-h-[calc(100vh-110px)] flex items-center justify-center bg-transparent text-brand-textDark relative overflow-hidden isolate",
  backgroundCircles: "absolute inset-0 flex items-center justify-center -z-10",
  circle1: "w-[560px] h-[560px] rounded-full bg-cyan-200/40 blur-[120px] animate-pulse-glow mix-blend-multiply",
  circle2: "w-[480px] h-[480px] rounded-full bg-blue-200/35 blur-[120px] animate-pulse-glow animation-delay-2000 mix-blend-multiply absolute top-1/4 right-1/4",
  content: "relative z-10 flex flex-col items-center space-y-10 px-6 animate-slide-up-fade",
  tube1: "absolute top-10 left-0 w-24 h-24 animate-float opacity-70 drop-shadow-xl",
  tube2: "absolute top-20 right-10 w-20 h-20 animate-float animation-delay-1000 opacity-70 drop-shadow-xl",
  tube3: "absolute bottom-20 left-10 w-28 h-28 animate-float animation-delay-2000 opacity-70 drop-shadow-xl",
  tube4: "absolute bottom-10 right-0 w-24 h-24 animate-float animation-delay-1500 opacity-70 drop-shadow-xl",
  scientistImage: "w-80 h-auto relative z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-slide-up-fade hover:scale-105 transition-transform duration-500",
  startButton: "dash-btn-primary text-xl px-14 py-5 z-30",
};

export default AnalysisPageStyles;
