// ImageUploaderStyles.ts
const styles = {
  container: "w-full max-w-5xl mx-auto drop-shadow-sm",
  image: "w-full h-56 object-cover rounded-xl mb-6 shadow-glass-md border border-brand-light",
  title: "text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink tracking-tight",
  description: "text-brand-textLight mb-8 font-medium",
  credits: "text-gray-400 mb-5 font-bold tracking-wide",
  button: "btn-primary mb-4",
  analysisContainer: "mt-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-glass-md border border-brand-light",
  analysisTitle: "text-xl font-bold text-accent-purple mb-4",
  analysisItem: "text-brand-textDark font-semibold",
  modalContainer: "fixed inset-0 flex items-center justify-center z-[100] bg-brand-textDark/40 backdrop-blur-sm",
  modalContent: "bg-white border border-brand-light rounded-2xl p-10 w-full max-w-xl h-auto mx-auto shadow-glass-lg animate-slide-up-fade relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent-purple/5 before:to-transparent before:pointer-events-none text-brand-textDark",
  modalTitle: "text-2xl font-black mb-6 text-brand-textDark tracking-tight",
  websiteButton: "btn-secondary !py-2 !px-4 text-sm flex items-center justify-center space-x-3 w-full sm:w-auto",
  websiteButtonAlibaba: "btn-secondary !py-2 !px-4 text-sm flex items-center justify-center space-x-3 w-full sm:w-auto hover:!border-accent-pink/50 hover:!shadow-glow-pink",
};

export default styles;
