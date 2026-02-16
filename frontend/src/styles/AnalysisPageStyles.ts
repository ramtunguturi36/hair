const AnalysisPageStyles = {
  container: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden",
  backgroundCircles: "absolute inset-0 flex items-center justify-center z-0",
  circle1: "w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px] animate-blob mix-blend-multiply",
  circle2: "w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply absolute top-1/4 right-1/4",
  content: "relative z-10 flex flex-col items-center space-y-8 px-4",
  tube1: "absolute top-10 left-0 w-24 h-24 animate-float opacity-80",
  tube2: "absolute top-20 right-10 w-20 h-20 animate-float animation-delay-1000 opacity-80",
  tube3: "absolute bottom-20 left-10 w-28 h-28 animate-float animation-delay-2000 opacity-80",
  tube4: "absolute bottom-10 right-0 w-24 h-24 animate-float animation-delay-1500 opacity-80",
  scientistImage: "w-80 h-auto relative z-20 drop-shadow-2xl animate-fade-in-up",
  startButton: "btn-primary text-xl px-12 py-4 shadow-2xl z-30",
};

export default AnalysisPageStyles;
