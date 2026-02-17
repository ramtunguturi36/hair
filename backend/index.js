import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const envResult = dotenv.config({ override: true });
if (envResult.error) {
  console.error("Error loading .env file:", envResult.error);
} else {
  console.log(".env file loaded successfully");
}

const key = process.env.GEMINI_API_KEY;
console.log("Server using Gemini API Key:", key ? key.substring(0, 10) + "..." : "undefined");

const app = express();
const PORT = 5000;

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Stripe Payment Route
app.post('/create-checkout-session', async (req, res) => {
  const { planId, planAmount, planCurrency, credits } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // One-time payment instead of subscription
      line_items: [
        {
          price_data: {
            currency: planCurrency || 'inr',
            product_data: {
              name: `${planId} - ${credits} Credits`,
              description: `Hair Analysis Credits Package`,
            },
            unit_amount: planAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/dashboard/analysis?payment=success&credits=${credits}`,
      cancel_url: 'http://localhost:5173/dashboard/pricing?payment=cancelled',
      metadata: {
        credits: credits, // Store credits to add after successful payment
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


// History Data File Path
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE = path.join(__dirname, 'history.json');

// Helper to read history
const readHistory = () => {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
};

// Helper to write history
const writeHistory = (data) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing history:", error);
  }
};

// GET History for a user
app.get('/api/history/:userId', (req, res) => {
  const { userId } = req.params;
  const allHistory = readHistory();
  const userHistory = allHistory.filter(item => item.userId === userId);
  res.json(userHistory);
});

// POST Save Analysis Result
app.post('/api/history', (req, res) => {
  const { userId, date, result, image } = req.body;

  if (!userId || !result) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newEntry = {
    id: Date.now().toString(),
    userId,
    date: date || new Date().toISOString(),
    result,
    image // Optional base64 or URL
  };

  const history = readHistory();
  history.push(newEntry);
  writeHistory(history);

  res.json({ success: true, entry: newEntry });
});

// Helper function to convert buffer to base64 for Gemini
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// POST Analyze Hair with Gemini
app.post('/api/analyze-hair', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // DEBUG: Initialize here to ensure latest key
    const currentKey = process.env.GEMINI_API_KEY;
    console.log("Analyze Request using Key ending in:", currentKey ? currentKey.slice(-5) : "undefined");
    const localGenAI = new GoogleGenerativeAI(currentKey);

    const model = localGenAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

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
    Ensure 'probabilities' sum to roughly 100. 'hairType' should match the highest percentage.
    IMPORTANT: Return ONLY the raw JSON string. Do not wrap it in markdown code blocks.`;

    const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the text to remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();

    // Parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw Text:", text);
      // Fallback to text-only if JSON fails
      jsonResponse = {
        analysis: text,
        hairType: "Unknown",
        confidence: 0,
        probabilities: []
      };
    }

    res.json(jsonResponse);

  } catch (error) {
    console.error('Error analyzing hair:', error);
    res.status(500).json({ error: 'Failed to analyze hair image', details: error.message });
  }
});

// POST Chat with AI Consultant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // DEBUG: Initialize here to ensure latest key
    const currentKey = process.env.GEMINI_API_KEY;
    const localGenAI = new GoogleGenerativeAI(currentKey);
    const model = localGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let formattedHistory = history ? history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Gemini requires history to start with a user message
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to chat with AI', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
