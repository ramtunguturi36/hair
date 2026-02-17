
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

const result = dotenv.config({ override: true });
if (result.error) {
    console.log("Error loading .env:", result.error);
} else {
    console.log(".env loaded successfully");
}

const key = process.env.GEMINI_API_KEY;
console.log("Using API Key:", key ? key.substring(0, 10) + "..." : "undefined");
const genAI = new GoogleGenerativeAI(key);

// ... (imports and config same as before)

// ... imports same

import fs from 'fs';

async function run() {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Read the image file
        const imagePath = "OIP (1).jpg";
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg",
            },
        };

        const prompt = `Analyze this hair image as a trichologist. Return a JSON object with this structure:
    {
      "analysis": "Markdown formatted detailed analysis identifying hair type, texture, scalp condition, issues, recommendations, and key ingredients.",
      "hairType": "Short string of the dominant hair type e.g. 'Type 3 Curly', 'Type 4 Coily', 'Type 1 Straight', 'Type 2 Wavy', 'Bald'",
      "confidence": 85,
      "probabilities": [
        { "name": "Type 1 Straight", "percentage": 10 },
        { "name": "Type 2 Wavy", "percentage": 20 },
        { "name": "Type 3 Curly", "percentage": 60 },
        { "name": "Type 4 Coily", "percentage": 10 }
      ]
    }
    Ensure 'probabilities' sum to roughly 100. 'hairType' should match the highest percentage.`;

        console.log("Analyzing image...");
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log(text);

    } catch (error) {
        console.error("Error connecting to Gemini:", error);
    }
}

run();
