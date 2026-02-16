import React, { useState } from 'react';
import { FaUserCircle, FaCheck, FaMagic } from 'react-icons/fa';

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
    }
];

const StyleGuidePage: React.FC = () => {
    const [selectedShape, setSelectedShape] = useState<string | null>(null);

    const activeShape = faceShapes.find(s => s.id === selectedShape);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        Style Guide & Face Shape
                    </span>
                </h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Select your face shape to discover hairstyles that perfectly accentuate your features.
                </p>
            </div>

            {/* Face Shape Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {faceShapes.map((shape) => (
                    <button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${selectedShape === shape.id
                                ? 'border-purple-600 bg-purple-50 shadow-xl scale-105'
                                : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-lg'
                            }`}
                    >
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${shape.color} flex items-center justify-center text-white shadow-lg`}>
                            <FaUserCircle className="text-4xl opacity-80" />
                        </div>
                        <span className={`font-bold text-lg ${selectedShape === shape.id ? 'text-purple-700' : 'text-gray-600'}`}>
                            {shape.name}
                        </span>
                        {selectedShape === shape.id && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full text-xs shadow-md">
                                <FaCheck />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Recommendations Section */}
            {activeShape && (
                <div className="animate-fade-in-up bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${activeShape.color}`}></div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-1">
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">{activeShape.name} Shape</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {activeShape.description}
                            </p>
                            <div className="bg-purple-100 p-6 rounded-2xl inline-block">
                                <FaMagic className="text-purple-600 text-3xl mb-2" />
                                <p className="text-sm font-semibold text-purple-800">Pro Tip</p>
                                <p className="text-purple-700 text-xs">Always bring reference photos to your stylist!</p>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                Recommended Styles
                                <span className="ml-3 px-3 py-1 bg-gray-100 text-xs rounded-full text-gray-500 uppercase tracking-wide">Top Picks</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {activeShape.styles.map((style, idx) => (
                                    <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
                                        <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${activeShape.color} mr-4`}></div>
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
