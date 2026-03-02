import React, { useState } from 'react';
import { FaUserCircle, FaCheck, FaMagic, FaUpload } from 'react-icons/fa';

const faceShapes = [
    {
        id: 'oval',
        name: 'Oval',
        description: "Balanced proportions with a slightly narrower chin. You're lucky!",
        styles: ["Textured Bob", "Long Layers", "Blunt Bangs", "Wavy Shag"],
        color: "from-pink-500 to-rose-500"
    },
    {
        id: 'round',
        name: 'Round',
        description: "Soft angles with equal width and length. Needs lengthening.",
        styles: ["Long Bob (Lob)", "Pixie Cut with Volume", "Side-Swept Bangs", "High Ponytail"],
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 'square',
        name: 'Square',
        description: "Strong jawline and broad forehead. Needs softening.",
        styles: ["Soft Layers", "Curtain Bangs", "Side Part", "Textured Waves"],
        color: "from-purple-500 to-indigo-500"
    },
    {
        id: 'heart',
        name: 'Heart',
        description: "Wider forehead and pointed chin. Needs balance at the jaw.",
        styles: ["Chin-Length Bob", "Side-Swept Pixie", "Deep Side Part", "Loose Waves"],
        color: "from-orange-500 to-amber-500"
    },
    {
        id: 'diamond',
        name: 'Diamond',
        description: "Narrow forehead and jawline with prominent cheekbones.",
        styles: ["Chin-Length Bob", "Deep Side Part", "Swept Bangs", "Textured Shag"],
        color: "from-teal-500 to-green-500"
    },
    {
        id: 'oblong',
        name: 'Oblong',
        description: "Face is longer than it is wide.",
        styles: ["Blunt Bangs", "Layered Bob", "Loose Curls", "Mid-Length Layers"],
        color: "from-red-500 to-orange-500"
    }
];

const StyleGuidePage: React.FC = () => {
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsAnalyzing(true);
        setSelectedShape(null); // Clear manual selection
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('http://localhost:5000/api/analyze-face', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            setAiResult(data);

            // Try to match the shape to one of our pre-defined colors for UI flair
            const detectedShape = data.faceShape?.toLowerCase() || '';
            const matchedShape = faceShapes.find(s => detectedShape.includes(s.id));
            if (matchedShape) {
                setSelectedShape(matchedShape.id);
            }
        } catch (error) {
            console.error("AI Face analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const activeShape = faceShapes.find(s => s.id === selectedShape);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        Style Guide & Face Shape
                    </span>
                </h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
                    Select your face shape below or use AI to analyze a photo of your face directly.
                </p>
            </div>

            {/* AI Upload Section */}
            <div className="mb-12 max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-purple-100 shadow-lg text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <FaMagic className="text-purple-600" />
                    AI Face Shape Finder
                </h3>

                {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full mx-auto mb-6 shadow-md border-4 border-purple-50" />
                )}

                {!isAnalyzing ? (
                    <div className="flex justify-center">
                        <label className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3">
                            <FaUpload />
                            Upload Face Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-b-4 border-transparent mb-4"></div>
                        <p className="text-purple-600 font-medium">Analyzing your facial features...</p>
                    </div>
                )}
            </div>

            {/* Face Shape Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                {faceShapes.map((shape) => (
                    <button
                        key={shape.id}
                        onClick={() => { setSelectedShape(shape.id); setAiResult(null); setImagePreview(null); }}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${selectedShape === shape.id
                            ? 'border-purple-600 bg-purple-50 shadow-md scale-105'
                            : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${shape.color} flex items-center justify-center text-white shadow-sm`}>
                            <FaUserCircle className="text-2xl opacity-80" />
                        </div>
                        <span className={`font-bold text-sm ${selectedShape === shape.id ? 'text-purple-700' : 'text-gray-600'}`}>
                            {shape.name}
                        </span>
                        {selectedShape === shape.id && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full text-[10px] shadow-sm">
                                <FaCheck />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Recommendations Section */}
            {(activeShape || aiResult) && (
                <div className="animate-fade-in-up bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${activeShape ? activeShape.color : 'from-purple-500 to-indigo-500'}`}></div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-1">
                            <h3 className="text-3xl font-bold text-gray-800 mb-4 text-transform capitalize">
                                {aiResult ? aiResult.faceShape : activeShape?.name} Shape
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {aiResult ? aiResult.description : activeShape?.description}
                            </p>
                            <div className="bg-purple-100 p-6 rounded-2xl inline-block w-full">
                                <FaMagic className="text-purple-600 text-3xl mb-2" />
                                <p className="text-sm font-semibold text-purple-800">Pro Tip</p>
                                <p className="text-purple-700 text-xs mt-1">
                                    {aiResult ? "AI confidence is high, but always consult a stylist!" : "Always bring reference photos to your stylist!"}
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                {aiResult ? 'AI Recommended Styles' : 'Recommended Styles'}
                                <span className="ml-3 px-3 py-1 bg-purple-100 text-xs font-semibold rounded-full text-purple-600 uppercase tracking-wide">
                                    {aiResult ? 'Personalized Match' : 'Top Picks'}
                                </span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {(aiResult ? aiResult.recommendedStyles : activeShape?.styles)?.map((style: string, idx: number) => (
                                    <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
                                        <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${activeShape ? activeShape.color : 'from-purple-500 to-indigo-500'} mr-4`}></div>
                                        <span className="font-semibold text-gray-700">{style}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StyleGuidePage;
