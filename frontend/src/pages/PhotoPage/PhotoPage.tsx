import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import * as tmImage from '@teachablemachine/image'; // Import Teachable Machine
import CameraCapturePage from './CameraCapture'; // Import the CameraCapturePage component
import ImageUploader from './ImageUploader'; // Import the ImageUploader component
import axios from 'axios'; // Import axios for making API requests

const PhotoPage: React.FC = () => {
  const [isCameraView, setIsCameraView] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any | null>(null);
  const [model, setModel] = useState<any | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useUser();

  // IMPORTANT: Replace these with your actual Teachable Machine model URLs
  // Example: 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/model.json'
  const modelURL = import.meta.env.VITE_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/LNAvMinwT/model.json';
  const metadataURL = import.meta.env.VITE_METADATA_URL || 'https://teachablemachine.withgoogle.com/models/LNAvMinwT/metadata.json';

  useEffect(() => {
    // Load the Teachable Machine model
    const loadModel = async () => {
      try {
        setModelError(null);
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelError('Failed to load AI model. Please check your model URLs in the code or environment variables.');
      }
    };

    loadModel();
  }, []);

  const classifyImage = async (file: File) => {
    if (!model) {
      alert('AI model is not loaded. Please wait or check the console for errors.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const image = document.createElement('img');
      image.src = URL.createObjectURL(file);

      image.onload = async () => {
        try {
          const prediction = await model.predict(image);
          setPredictions(prediction);

          // Prepare data for API request
          const predictionData = prediction.map((pred: any) => ({
            className: pred.className,
            probability: pred.probability
          }));

          // Send results to the backend (History API)
          try {
            if (user) {
              await axios.post('http://localhost:5000/api/history', {
                userId: user.id,
                date: new Date().toISOString(),
                result: predictionData[0].className, // Top result
                image: imageSrc // Save image as base64
              });
              console.log('Analysis saved to history');
            }
          } catch (error) {
            console.error('Error saving history:', error);
            // Continue even if backend fails - show predictions to user
          }
        } catch (error) {
          console.error('Error classifying image:', error);
          alert('Failed to analyze the image. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };
    } catch (error) {
      console.error('Error loading image:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center">
      {isCameraView ? (
        <CameraCapturePage
          setImageSrc={setImageSrc}
          setIsCameraView={setIsCameraView}
          classifyImage={classifyImage}
        />
      ) : (
        <ImageUploader
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          predictions={predictions}
          setPredictions={setPredictions}
          classifyImage={classifyImage}
          setIsCameraView={setIsCameraView}
          modelError={modelError}
          isAnalyzing={isAnalyzing}
          modelLoaded={!!model}
        />
      )}
    </div>
  );
};

export default PhotoPage;
