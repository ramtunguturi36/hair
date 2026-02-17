import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../../context/CreditContext';
import { alibaba, amazon, jumia } from '../../assets/index';
import styles from '../../styles/ImageUploaderStyles';
import UpgradeCard from '../UpgradeCard';
import RoutineDisplay from '../../components/RoutineDisplay';
import ProductRecommendations from '../../components/ProductRecommendations';
import { generateHairRoutine } from '../../utils/hairRoutineGenerator';

interface Prediction {
    className: string;
    probability: number;
}

interface AnalysisResponse {
    analysis: string;
    hairType: string;
    confidence: number;
    probabilities: { name: string; percentage: number }[];
}

interface ImageUploaderProps {
    imageSrc: string | null;
    setImageSrc: (src: string | null) => void;
    predictions: Prediction[] | null;
    setPredictions: (predictions: Prediction[] | null) => void;
    classifyImage: (file: File) => Promise<void>;
    setIsCameraView: React.Dispatch<React.SetStateAction<boolean>>;
    modelError: string | null;
    isAnalyzing: boolean;
    modelLoaded: boolean;
}

// Simple Markdown renderer for the analysis result
const MarkdownRenderer = ({ content }: { content: string }) => {
    // Basic conversion of markdown-like text to HTML
    const htmlContent = content
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/\n/gim, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="text-gray-700 leading-relaxed" />;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
    imageSrc,
    setImageSrc,
    predictions,
    setPredictions,
    classifyImage,
    setIsCameraView,
    modelError,
    isAnalyzing,
    modelLoaded
}) => {

    const navigate = useNavigate();
    const { credits, deductCredits } = useCredits();
    const [showModel, setShowModel] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [localIsAnalyzing, setLocalIsAnalyzing] = useState(false);

    const handleFileChange = async (file: File) => {
        if (credits < 25) {
            alert('Insufficient credits. Please purchase more credits to continue.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setSelectedFile(file); // Store the file for later analysis
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyzePhoto = async () => {
        if (!selectedFile) {
            alert('Please select a photo first.');
            return;
        }

        if (credits < 25) {
            alert('Insufficient credits. Please purchase more credits to continue.');
            return;
        }

        // Deduct credits from context (saves to Clerk)
        const success = await deductCredits(25);
        if (success) {
            setLocalIsAnalyzing(true);
            try {
                // Create FormData to send the file
                const formData = new FormData();
                formData.append('image', selectedFile);

                // Call the backend API
                const response = await fetch('http://localhost:5000/api/analyze-hair', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to analyze image');
                }

                const data: AnalysisResponse = await response.json();

                // Update Analysis Text
                setAnalysisResult(data.analysis);

                // Update UI Bars (Predictions)
                if (data.probabilities) {
                    const mappedPredictions: Prediction[] = data.probabilities.map(p => ({
                        className: p.name,
                        probability: p.percentage / 100
                    }));
                    // Sort by probability descending
                    mappedPredictions.sort((a, b) => b.probability - a.probability);
                    setPredictions(mappedPredictions);
                } else {
                    // Fallback if no probabilities
                    await classifyImage(selectedFile);
                }

            } catch (error) {
                console.error('Error analyzing hair:', error);
                alert('An error occurred during analysis. Please try again.');
            } finally {
                setLocalIsAnalyzing(false);
            }
        } else {
            alert('Failed to deduct credits. Please try again.');
        }
    };

    const handleNewPhoto = () => {
        setImageSrc(null);
        setSelectedFile(null);
        setPredictions(null); // Clear previous predictions
    };

    const handleInputClick = () => {
        document.getElementById('fileInput')?.click();
    };

    const handleBuyHairProducts = () => {
        if (predictions && predictions.length > 0) {
            const topPrediction = predictions.reduce((prev, current) =>
                prev.probability > current.probability ? prev : current
            );
            const product = encodeURIComponent(topPrediction.className + 'hair products');
            setSelectedWebsite(product);
            setShowModel(true);
        } else {
            alert('No predictions available to search for products.')
        }
    };

    const handleWebsiteClick = (website: string) => {
        let url = '';
        switch (website) {
            case 'Amazon':
                url = `https://www.amazon.com/s?k=${selectedWebsite}`;
                break;
            case 'Alibaba':
                url = `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${selectedWebsite}`;
                break;
            case 'Jumia':
                url = `https://www.jumia.com.ng/catalog/?g=${selectedWebsite}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank')
        setShowModel(false);
    };

    return (
        <div className={styles.container}>
            {credits < 1 ? (
                <UpgradeCard />
            ) : (
                <>
                    {/* Model Status */}
                    {modelError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            <p className="font-semibold">⚠️ Model Error</p>
                            <p className="text-sm">{modelError}</p>
                        </div>
                    )}

                    {!modelLoaded && !modelError && (
                        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded max-w-2xl mx-auto text-center">
                            <p>Loading AI model... Please wait.</p>
                        </div>
                    )}

                    {/* Upload Section - Centered Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12 max-w-2xl mx-auto text-center">
                        {/* Image Display */}
                        {imageSrc ? (
                            <img src={imageSrc} alt='Captured' className={`${styles.image} max-h-80 object-contain bg-gray-50`} />
                        ) : (
                            <img
                                src="https://placehold.co/600x400/e2e8f0/94a3b8?text=Upload+Photo"
                                alt="Take a Photo"
                                className={styles.image}
                            />
                        )}

                        <h2 className={styles.title}>Take a Photo</h2>
                        <p className={styles.description}>We'll use this to analyze and return predictions from the AI model</p>
                        <p className={styles.credits}>Available Credits: {credits} (25 credits per analysis)</p>

                        {/* Camera Button */}
                        <button
                            className={styles.button}
                            onClick={async () => {
                                if (credits < 25) {
                                    alert('Insufficient credits. Please purchase more credits to continue.');
                                    return;
                                }
                                setIsCameraView(true);
                            }}
                            disabled={credits < 25 || !modelLoaded}
                        >
                            Use Camera
                        </button>

                        {/* Choose from Library */}
                        <div className="flex justify-center space-x-4 mb-4">
                            <div className="relative inline-block">
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) handleFileChange(file);
                                    }}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button
                                    className={styles.button}
                                    onClick={handleInputClick}
                                    disabled={credits < 25 || !modelLoaded}
                                >
                                    Choose from Library
                                </button>
                            </div>
                        </div>

                        {/* Analyze Photo Button - Shows after selecting a photo */}
                        {imageSrc && selectedFile && !predictions && (
                            <div className="mt-6">
                                <button
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                    onClick={handleAnalyzePhoto}
                                    disabled={isAnalyzing || localIsAnalyzing || !modelLoaded || credits < 25}
                                >
                                    {isAnalyzing || localIsAnalyzing ? '🔍 Analyzing...' : '🚀 Start Analysis'}
                                </button>
                                <p className="text-sm text-gray-500 mt-3 font-medium">Uses 25 credits</p>
                            </div>
                        )}
                    </div>

                    {/* Analysis Results */}
                    {predictions && (
                        <div className="animate-fade-in-up">
                            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                                <div className="text-center mb-8">
                                    <div className="inline-block p-3 rounded-full bg-green-100 text-green-600 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-gray-800 mb-2">Analysis Complete</h3>
                                    <p className="text-gray-500">Here's what our AI detected from your photo</p>
                                </div>

                                <div className="space-y-4 max-w-lg mx-auto">
                                    {predictions.map((concept, index) => {
                                        const percentage = Math.round(concept.probability * 100);
                                        const isTop = index === 0;
                                        return (
                                            <div key={index} className="relative">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className={`font-bold ${isTop ? 'text-lg text-gray-900' : 'text-gray-600'}`}>
                                                        {concept.className}
                                                    </span>
                                                    <span className={`font-mono font-bold ${isTop ? 'text-purple-600' : 'text-gray-400'}`}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gray-300'
                                                            }`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Smart Routine Builder */}
                            <RoutineDisplay
                                routine={generateHairRoutine(
                                    predictions.reduce((prev, current) => prev.probability > current.probability ? prev : current).className
                                )}
                                hairType={predictions.reduce((prev, current) => prev.probability > current.probability ? prev : current).className}
                            />

                            <ProductRecommendations
                                hairType={predictions.reduce((prev, current) => prev.probability > current.probability ? prev : current).className}
                            />

                            {/* Detailed AI Analysis Result */}
                            {analysisResult && (
                                <div className="mt-8 bg-purple-50 rounded-2xl p-8 border border-purple-100 shadow-md animate-fade-in-up">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-purple-600 text-white p-2 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">Expert AI Analysis</h3>
                                    </div>
                                    <div className="prose prose-purple max-w-none">
                                        <MarkdownRenderer content={analysisResult} />
                                    </div>
                                </div>
                            )}

                            {/* Clear Analysis Button */}

                            {/* Clear Analysis Button */}
                            {/* Clear Analysis Button */}
                            <div className="flex justify-center mt-10">
                                <button
                                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold shadow-sm hover:shadow-md"
                                    onClick={handleNewPhoto}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-1.2l.858-1.715h5.093l.858 1.715a2 2 0 001.665 1.2h.929a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Analyze Another Photo
                                </button>
                            </div>
                        </div>
                    )}

                    {showModel && (
                        <div className={styles.modalContainer}>
                            <div className={styles.modalContent}>
                                <h3 className={styles.modalTitle}>Choose a Website</h3>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        className={styles.websiteButton}
                                        onClick={() => handleWebsiteClick('Amazon')}
                                    >
                                        <img src={amazon} alt="Amazon" className="w-6 h-6" />
                                        <span>Amazon</span>
                                    </button>

                                    <button
                                        className={styles.websiteButton}
                                        onClick={() => handleWebsiteClick('Alibaba')}
                                    >
                                        <img src={alibaba} alt="Alibaba" className="w-6 h-6" />
                                        <span>Alibaba</span>
                                    </button>

                                    <button
                                        className={styles.websiteButton}
                                        onClick={() => handleWebsiteClick('Jumia')}
                                    >
                                        <img src={jumia} alt="Jumia" className="w-6 h-6" />
                                        <span>Jumia</span>
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}
                </>
            )}

        </div>
    )
}

export default ImageUploader
