import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../../context/CreditContext';
import { alibaba, amazon, jumia } from '../../assets/index';
import styles from '../../styles/ImageUploaderStyles';
import UpgradeCard from '../UpgradeCard';

interface Prediction {
    className: string;
    probability: number;
}

interface ImageUploaderProps {
    imageSrc: string | null ;
    setImageSrc: (src: string | null) => void;
    predictions: Prediction[] | null;
    setPredictions: (predictions: Prediction[] | null) => void;
    classifyImage: (file: File) => Promise<void>;
    setIsCameraView: React.Dispatch<React.SetStateAction<boolean>>;
    modelError: string | null;
    isAnalyzing: boolean;
    modelLoaded: boolean;
}

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
            await classifyImage(selectedFile);
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
        if (predictions && predictions.length > 0){
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

    const handleWebsiteClick = (website: string) =>{
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
                <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    <p>Loading AI model... Please wait.</p>
                </div>
            )}

            {/* Image Display */}
            {imageSrc ? (
                <img src={imageSrc} alt='Captured' className={styles.image} />
            ) : (
                <img 
                    src="https://example.com/placeholder.png"
                    alt= "Take a Photo"
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
                <div className="mb-4">
                    <button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        onClick={handleAnalyzePhoto}
                        disabled={isAnalyzing || !modelLoaded || credits < 25}
                    >
                        {isAnalyzing ? '🔍 Analyzing...' : '🚀 Start Analysis'}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">This will use 25 credits</p>
                </div>
            )}

            {/* Analysis Results */}
            {predictions && (
                <div className={styles.analysisContainer}>
                    <h3 className={styles.analysisTitle}>✨ Analysis Result</h3>
                    <ul>
                        {predictions.map((concept, index) => (
                            <li key={index} className={styles.analysisItem}>
                                {concept.className}: {Math.round(concept.probability * 100)}%
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none font-semibold shadow-md"
                        onClick={handleBuyHairProducts}
                    >
                        🛍️ Buy Hair Products
                    </button>
                    
                    {/* Clear Analysis Button */}
                    <button
                        className="mt-2 ml-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none font-semibold shadow-md"
                        onClick={handleNewPhoto}
                    >
                        📸 Analyze Another Photo
                    </button>
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
                                <img src={amazon} alt="Amazon" className="w-6 h-6"/>
                                <span>Amazon</span>
                            </button>

                            <button
                            className={styles.websiteButton}
                            onClick={() => handleWebsiteClick('Alibaba')}
                            >
                                <img src={alibaba} alt="Alibaba" className="w-6 h-6"/>
                                <span>Alibaba</span>
                            </button>

                            <button
                            className={styles.websiteButton}
                            onClick={() => handleWebsiteClick('Jumia')}
                            >
                                <img src={jumia} alt="Jumia" className="w-6 h-6"/>
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
  