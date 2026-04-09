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
const PRIMARY_GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_FALLBACK_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-pro'];
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '')
  .split(',')
  .map(id => id.trim().replace(/^['\"]|['\"]$/g, ''))
  .filter(Boolean);

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
  const { planId, planAmount, planCurrency, credits, userId } = req.body;

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
        userId: userId || '',
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
const PROFILE_FILE = path.join(__dirname, 'profiles.json');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const NOTIFICATIONS_FILE = path.join(__dirname, 'notifications.json');
const PAYMENTS_FILE = path.join(__dirname, 'payments.json');
const FLAGS_FILE = path.join(__dirname, 'ai_flags.json');

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

const readJsonArray = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJsonArray = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

const isAdminUser = (userId) => {
  if (!userId) return false;
  if (ADMIN_USER_IDS.includes('*')) return true;
  if (ADMIN_USER_IDS.length === 0) return userId.toLowerCase().includes('admin');
  return ADMIN_USER_IDS.some(adminId => adminId.toLowerCase() === userId.toLowerCase());
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

// Helper for Saved Products
const SAVED_PRODUCTS_FILE = path.join(__dirname, 'saved_products.json');
const readSavedProducts = () => {
  try {
    if (!fs.existsSync(SAVED_PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(SAVED_PRODUCTS_FILE, 'utf8'));
  } catch (error) { return []; }
};
const writeSavedProducts = (data) => fs.writeFileSync(SAVED_PRODUCTS_FILE, JSON.stringify(data, null, 2));

app.get('/api/saved-products/:userId', (req, res) => {
  const all = readSavedProducts();
  res.json(all.filter(p => p.userId === req.params.userId));
});

app.post('/api/saved-products', (req, res) => {
  const { userId, product } = req.body;
  const all = readSavedProducts();
  if (!all.find(p => p.userId === userId && p.product.name === product.name)) {
    all.push({ id: Date.now().toString(), userId, product, savedAt: new Date().toISOString() });
    writeSavedProducts(all);
  }
  res.json({ success: true });
});

app.delete('/api/saved-products/:userId/:productName', (req, res) => {
  const { userId, productName } = req.params;
  let all = readSavedProducts();
  all = all.filter(p => !(p.userId === userId && p.product.name === productName));
  writeSavedProducts(all);
  res.json({ success: true });
});

// Profile preferences and goals
app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profiles = readJsonArray(PROFILE_FILE);
  const profile = profiles.find(p => p.userId === userId);
  res.json(profile || {
    userId,
    concerns: [],
    budgetRange: 'mid',
    allergies: [],
    goals: [],
    reminderTime: '20:00',
    reminderDays: ['Mon', 'Wed', 'Sat']
  });
});

app.put('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const incoming = req.body || {};
  const profiles = readJsonArray(PROFILE_FILE);
  const idx = profiles.findIndex(p => p.userId === userId);
  const profile = {
    userId,
    concerns: Array.isArray(incoming.concerns) ? incoming.concerns : [],
    budgetRange: incoming.budgetRange || 'mid',
    allergies: Array.isArray(incoming.allergies) ? incoming.allergies : [],
    goals: Array.isArray(incoming.goals) ? incoming.goals : [],
    reminderTime: incoming.reminderTime || '20:00',
    reminderDays: Array.isArray(incoming.reminderDays) ? incoming.reminderDays : ['Mon', 'Wed', 'Sat'],
    updatedAt: new Date().toISOString()
  };

  if (idx >= 0) profiles[idx] = { ...profiles[idx], ...profile };
  else profiles.push(profile);

  writeJsonArray(PROFILE_FILE, profiles);
  res.json({ success: true, profile });
});

// Progress tracking: before/after entries and trend summary from history
app.post('/api/progress/before-after', (req, res) => {
  const { userId, beforeImage, afterImage, notes, date } = req.body;
  if (!userId || !beforeImage || !afterImage) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const all = readJsonArray(PROGRESS_FILE);
  const entry = {
    id: Date.now().toString(),
    userId,
    beforeImage,
    afterImage,
    notes: notes || '',
    date: date || new Date().toISOString()
  };
  all.push(entry);
  writeJsonArray(PROGRESS_FILE, all);
  res.json({ success: true, entry });
});

app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const progressEntries = readJsonArray(PROGRESS_FILE).filter(item => item.userId === userId);
  const userHistory = readHistory().filter(item => item.userId === userId);

  const trendByType = userHistory.reduce((acc, item) => {
    const key = item.result || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const timeline = userHistory
    .map(item => ({ date: item.date, result: item.result }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  res.json({
    beforeAfter: progressEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    trends: Object.entries(trendByType).map(([name, count]) => ({ name, count })),
    timeline
  });
});

// Notification system (in-app + simulated email channel)
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const all = readJsonArray(NOTIFICATIONS_FILE);
  const items = all
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(items);
});

app.post('/api/notifications', (req, res) => {
  const { userId, title, message, type = 'in-app', channel = 'in-app' } = req.body;
  if (!userId || !title || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const all = readJsonArray(NOTIFICATIONS_FILE);
  const item = {
    id: Date.now().toString(),
    userId,
    title,
    message,
    type,
    channel,
    read: false,
    status: channel === 'email' ? 'sent-simulated' : 'delivered',
    createdAt: new Date().toISOString()
  };
  all.push(item);
  writeJsonArray(NOTIFICATIONS_FILE, all);

  if (channel === 'email') {
    console.log(`[EMAIL-SIMULATED] To user ${userId}: ${title} - ${message}`);
  }

  res.json({ success: true, notification: item });
});

app.patch('/api/notifications/:userId/:notificationId/read', (req, res) => {
  const { userId, notificationId } = req.params;
  const all = readJsonArray(NOTIFICATIONS_FILE);
  const idx = all.findIndex(n => n.userId === userId && n.id === notificationId);
  if (idx === -1) return res.status(404).json({ error: 'Notification not found' });
  all[idx].read = true;
  writeJsonArray(NOTIFICATIONS_FILE, all);
  res.json({ success: true });
});

app.post('/api/notifications/low-credit', (req, res) => {
  const { userId, credits } = req.body;
  if (!userId || typeof credits !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (credits >= 40) {
    return res.json({ success: true, skipped: true, reason: 'credits-above-threshold' });
  }

  const all = readJsonArray(NOTIFICATIONS_FILE);
  const now = Date.now();
  const recent = all.find(
    n => n.userId === userId && n.type === 'low-credit' && (now - new Date(n.createdAt).getTime()) < 24 * 60 * 60 * 1000
  );
  if (recent) {
    return res.json({ success: true, skipped: true, reason: 'already-sent-today' });
  }

  const base = {
    id: `${now}`,
    userId,
    type: 'low-credit',
    title: 'Low Credit Alert',
    message: `You have only ${credits} credits left. Refill to continue analyses.`,
    read: false,
    createdAt: new Date().toISOString()
  };

  all.push({ ...base, channel: 'in-app', status: 'delivered' });
  all.push({ ...base, id: `${now + 1}`, channel: 'email', status: 'sent-simulated' });
  writeJsonArray(NOTIFICATIONS_FILE, all);
  console.log(`[EMAIL-SIMULATED] Low credit alert for ${userId}: ${credits}`);

  res.json({ success: true });
});

// Payment logging for admin analytics
app.post('/api/payments/log', (req, res) => {
  const { userId, credits, amount, currency = 'inr', status = 'success', planId = 'credits-pack' } = req.body;
  if (!userId || !credits || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const all = readJsonArray(PAYMENTS_FILE);
  const entry = {
    id: Date.now().toString(),
    userId,
    credits,
    amount,
    currency,
    status,
    planId,
    createdAt: new Date().toISOString()
  };
  all.push(entry);
  writeJsonArray(PAYMENTS_FILE, all);
  res.json({ success: true, entry });
});

// Flag AI responses for admin review
app.post('/api/flags', (req, res) => {
  const { userId, source, reason, contentSnippet } = req.body;
  if (!userId || !source || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const all = readJsonArray(FLAGS_FILE);
  const item = {
    id: Date.now().toString(),
    userId,
    source,
    reason,
    contentSnippet: contentSnippet || '',
    status: 'open',
    createdAt: new Date().toISOString()
  };
  all.push(item);
  writeJsonArray(FLAGS_FILE, all);
  res.json({ success: true, item });
});

// Role-based admin dashboard summary
app.get('/api/admin/dashboard/:adminUserId', (req, res) => {
  const { adminUserId } = req.params;
  if (!isAdminUser(adminUserId)) {
    return res.status(403).json({ error: 'Forbidden: admin access required' });
  }

  const history = readHistory();
  const payments = readJsonArray(PAYMENTS_FILE);
  const flags = readJsonArray(FLAGS_FILE);
  const notifications = readJsonArray(NOTIFICATIONS_FILE);
  const uniqueUsers = new Set(history.map(h => h.userId));

  res.json({
    totals: {
      users: uniqueUsers.size,
      analyses: history.length,
      payments: payments.length,
      flaggedResponses: flags.length,
      unreadNotifications: notifications.filter(n => !n.read).length
    },
    recentPayments: payments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20),
    openFlags: flags
      .filter(f => f.status !== 'closed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)
  });
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

function shouldUseGeminiFallback(error) {
  const status = error?.status || error?.response?.status;
  const message = String(error?.message || '').toLowerCase();

  return (
    status === 503 ||
    message.includes('service unavailable') ||
    message.includes('high demand')
  );
}

async function generateContentWithFallback({ localGenAI, content, modelOptions = {}, endpointLabel }) {
  try {
    const primaryModel = localGenAI.getGenerativeModel({
      model: PRIMARY_GEMINI_MODEL,
      ...modelOptions
    });

    return await primaryModel.generateContent(content);
  } catch (error) {
    if (!shouldUseGeminiFallback(error)) {
      throw error;
    }

    console.warn(`[${endpointLabel}] Primary model ${PRIMARY_GEMINI_MODEL} failed (${error?.status || 'unknown'}). Trying fallback models: ${GEMINI_FALLBACK_MODELS.join(', ')}.`);

    let lastError = error;

    for (const fallbackModelName of GEMINI_FALLBACK_MODELS) {
      try {
        const fallbackModel = localGenAI.getGenerativeModel({
          model: fallbackModelName,
          ...modelOptions
        });

        return await fallbackModel.generateContent(content);
      } catch (fallbackError) {
        lastError = fallbackError;
        console.warn(`[${endpointLabel}] Fallback model ${fallbackModelName} failed (${fallbackError?.status || 'unknown'}).`);
      }
    }

    throw lastError;
  }
}

async function sendChatWithFallback({ localGenAI, history, message, modelOptions = {}, endpointLabel }) {
  try {
    const primaryModel = localGenAI.getGenerativeModel({
      model: PRIMARY_GEMINI_MODEL,
      ...modelOptions
    });

    const chat = primaryModel.startChat({ history });
    return await chat.sendMessage(message);
  } catch (error) {
    if (!shouldUseGeminiFallback(error)) {
      throw error;
    }

    console.warn(`[${endpointLabel}] Primary model ${PRIMARY_GEMINI_MODEL} failed (${error?.status || 'unknown'}). Trying fallback models: ${GEMINI_FALLBACK_MODELS.join(', ')}.`);

    let lastError = error;

    for (const fallbackModelName of GEMINI_FALLBACK_MODELS) {
      try {
        const fallbackModel = localGenAI.getGenerativeModel({
          model: fallbackModelName,
          ...modelOptions
        });

        const chat = fallbackModel.startChat({ history });
        return await chat.sendMessage(message);
      } catch (fallbackError) {
        lastError = fallbackError;
        console.warn(`[${endpointLabel}] Fallback model ${fallbackModelName} failed (${fallbackError?.status || 'unknown'}).`);
      }
    }

    throw lastError;
  }
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

    const result = await generateContentWithFallback({
      localGenAI,
      content: [prompt, imagePart],
      modelOptions: { generationConfig: { responseMimeType: "application/json" } },
      endpointLabel: 'analyze-hair'
    });
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

    const currentKey = process.env.GEMINI_API_KEY;
    const localGenAI = new GoogleGenerativeAI(currentKey);
    let formattedHistory = history ? history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Gemini requires history to start with a user message
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const result = await sendChatWithFallback({
      localGenAI,
      history: formattedHistory,
      message,
      modelOptions: {
        systemInstruction: "You are an expert trichologist and hair care consultant. IMPORTANT: Your sole purpose is to answer questions related to hair care, scalp health, hair products, and hairstyling. If the user asks a question that is NOT related to hair or these topics, you must gracefully decline to answer and simply state: 'I can only help with hair-related topics.' Do not provide any other assistance for non-hair queries."
      },
      endpointLabel: 'chat'
    });
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to chat with AI', details: error.message });
  }
});

// POST Analyze Face Shape with Gemini
app.post('/api/analyze-face', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const currentKey = process.env.GEMINI_API_KEY;
    const localGenAI = new GoogleGenerativeAI(currentKey);
    const prompt = `Analyze this face image. Return a JSON object with this structure:
    {
      "faceShape": "Short string of the dominant face shape e.g. 'Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong'",
      "description": "Short explanation of why it is this shape based on features.",
      "recommendedStyles": ["Style 1", "Style 2", "Style 3", "Style 4"],
      "confidence": 85
    }
    IMPORTANT: Return ONLY the raw JSON string. Do not wrap it in markdown code blocks.`;

    const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

    const result = await generateContentWithFallback({
      localGenAI,
      content: [prompt, imagePart],
      modelOptions: { generationConfig: { responseMimeType: "application/json" } },
      endpointLabel: 'analyze-face'
    });
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedText);

    res.json(jsonResponse);

  } catch (error) {
    console.error('Error analyzing face:', error);
    res.status(500).json({ error: 'Failed to analyze face', details: error.message });
  }
});

// POST Analyze Hair Loss Risk with Gemini
app.post('/api/analyze-risk', async (req, res) => {
  try {
    const { answers } = req.body;

    const currentKey = process.env.GEMINI_API_KEY;
    const localGenAI = new GoogleGenerativeAI(currentKey);
    const prompt = `Analyze the following user survey answers about their hair loss risk factors:
    ${JSON.stringify(answers)}
    
    Act as an expert trichologist. Return a JSON object with this structure:
    {
      "riskLevel": "Low Risk" or "Moderate Risk" or "High Risk",
      "score": 45, // Number from 0 to 100 representing risk severity
      "explanation": "A detailed 2-paragraph explanation of their specific risk factors based on their answers.",
      "actionableAdvice": ["Advice 1", "Advice 2", "Advice 3"],
      "recommendedIngredients": ["Ingredient 1", "Ingredient 2"]
    }
    IMPORTANT: Return ONLY the raw JSON string. Do not wrap it in markdown code blocks.`;

    const result = await generateContentWithFallback({
      localGenAI,
      content: prompt,
      modelOptions: { generationConfig: { responseMimeType: "application/json" } },
      endpointLabel: 'analyze-risk'
    });
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedText);

    res.json(jsonResponse);

  } catch (error) {
    console.error('Error analyzing risk:', error);
    res.status(500).json({ error: 'Failed to analyze risk', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
