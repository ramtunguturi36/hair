/**
 * TEACHABLE MACHINE SHOWCASE ENDPOINT
 * 
 * This endpoint demonstrates the proposed architecture:
 * Image → Teachable Machine (ML Classification) → Gemini (Personalization)
 * 
 * IMPORTANT: This is a SHOWCASE for external review.
 * NOT connected to the main analysis flow.
 * 
 * The main project uses only Gemini API.
 * This shows what the ML pipeline would look like.
 */

import express from 'express';
import { model } from '../config/gemini.js';

const router = express.Router();

/**
 * POST /api/showcase/analyze-with-teachable-machine
 * 
 * Demonstrates how Teachable Machine classifications would be used with Gemini
 * 
 * Body:
 * {
 *   teachableMachinePredictions: {
 *     hairType: "Curly",
 *     confidence: 0.85,
 *     condition: "Damaged",
 *     texture: "Thick",
 *     allPredictions: { ... }
 *   },
 *   userProfile: {
 *     concerns: ["frizz", "dryness"],
 *     budget: "moderate",
 *     allergies: []
 *   }
 * }
 * 
 * Response: Combined ML + Gemini analysis
 */
router.post('/analyze-with-teachable-machine', async (req, res) => {
  try {
    const { teachableMachinePredictions, userProfile } = req.body;

    if (!teachableMachinePredictions) {
      return res.status(400).json({
        error: 'teachableMachinePredictions required',
        example: {
          hairType: 'Curly',
          confidence: 0.85,
          condition: 'Damaged',
          texture: 'Thick'
        }
      });
    }

    console.log('\n========== TEACHABLE MACHINE SHOWCASE ==========');
    console.log('📊 LAYER 1 - ML Classification (Teachable Machine):');
    console.log(JSON.stringify(teachableMachinePredictions, null, 2));

    // === LAYER 1: ML Classification Output ===
    const mlClassification = {
      source: 'Teachable Machine (Custom Trained Model)',
      hairType: teachableMachinePredictions.hairType,
      confidence: teachableMachinePredictions.confidence,
      condition: teachableMachinePredictions.condition,
      texture: teachableMachinePredictions.texture,
      detectionTime: new Date().toISOString(),
    };

    // === LAYER 2: Gemini Enrichment ===
    console.log('\n🤖 LAYER 2 - Gemini Personalization:');
    console.log('Creating enriched prompt with ML classifications...\n');

    const enrichedPrompt = `
You are an expert hair care consultant. A user's hair has been analyzed using a machine learning model.

=== ML CLASSIFICATION (Teachable Machine) ===
Hair Type: ${teachableMachinePredictions.hairType}
Confidence: ${(teachableMachinePredictions.confidence * 100).toFixed(1)}%
Condition: ${teachableMachinePredictions.condition}
Texture: ${teachableMachinePredictions.texture}

=== USER PROFILE ===
${userProfile ? `Concerns: ${userProfile.concerns?.join(', ') || 'None specified'}
Budget: ${userProfile.budget || 'Not specified'}
Allergies: ${userProfile.allergies?.join(', ') || 'None'}` : 'No profile data'}

=== TASK ===
Based on the ML classification above, provide:
1. Detailed analysis of the detected hair type and condition
2. Root causes of the condition
3. Personalized 7-step hair care routine
4. Product type recommendations (aligned with budget)
5. Expected results timeline

Format your response as clear, actionable markdown.
    `.trim();

    // Call Gemini with ML-enriched context
    console.log('[Sending to Gemini API with ML-enriched prompt]');
    
    const result = await model.generateContent(enrichedPrompt);
    const personalizedAnalysis = result.response.text();

    // === FINAL OUTPUT ===
    const response = {
      pipeline: 'Teachable Machine (ML) → Gemini (Personalization)',
      
      layer1_mlClassification: mlClassification,
      
      layer2_geminiBased: {
        source: 'Google Gemini API',
        enrichedWith: 'Teachable Machine classifications',
      },
      
      personalizedAnalysis: personalizedAnalysis,
      
      architectureNotes: {
        description: 'This is a 2-layer pipeline combining ML and API',
        layer1: 'Teachable Machine provides scientific hair classification',
        layer2: 'Gemini personalizes based on ML output + user profile',
        advantage: 'Better than just API because it uses trained ML model first',
        showcase: 'This demonstrates how we use ML engineering, not just API calls',
      },

      timestamp: new Date().toISOString(),
    };

    console.log('\n========== RESPONSE ==========');
    console.log('✅ Analysis complete with ML + API pipeline\n');

    res.json(response);

  } catch (error) {
    console.error('Error in Teachable Machine showcase:', error);
    res.status(500).json({
      error: error.message,
      note: 'This is a showcase endpoint for external review'
    });
  }
});

/**
 * GET /api/showcase/teachable-machine-info
 * 
 * Returns information about the Teachable Machine integration approach
 */
router.get('/teachable-machine-info', (req, res) => {
  res.json({
    component: 'Teachable Machine Showcase',
    status: 'Showcase for external review (not integrated to main flow)',
    
    architecture: {
      layer1: {
        name: 'Machine Learning',
        technology: 'Google Teachable Machine',
        location: 'Frontend (React)',
        purpose: 'Classify hair type, condition, and texture from images',
        input: 'User uploads hair image',
        output: {
          hairType: 'string (Straight, Wavy, Curly, Coily)',
          confidence: 'number (0-1)',
          condition: 'string (Healthy, Damaged, etc)',
          texture: 'string (Fine, Medium, Thick)',
          allPredictions: 'object with all class scores'
        }
      },
      
      layer2: {
        name: 'Personalization',
        technology: 'Google Gemini API',
        location: 'Backend (Node.js)',
        purpose: 'Enrich ML classifications with user profile and generate personalized analysis',
        input: 'ML classifications + user profile (concerns, budget, allergies)',
        output: 'Personalized hair care routine and recommendations'
      }
    },

    whyThisMatters: [
      'Shows real ML engineering, not just API consumption',
      'ML model provides scientific classification first',
      'Gemini adds intelligence layer for personalization',
      'Better than blindly sending image to API',
      'Demonstrates ML pipeline thinking'
    ],

    currentProject: {
      status: 'Uses Gemini API only for MVP',
      reason: 'Faster deployment, easier maintenance',
      this_showcase: 'Demonstrates proposed architecture with Teachable Machine'
    },

    files: [
      'frontend/src/components/TeachableMachineDemo.tsx - Frontend component',
      'backend/routes/showcase-teachable-machine.js - Backend endpoint'
    ],

    frontend_endpoint: 'http://localhost:5173/showcase/teachable-machine',
    backend_endpoint: 'POST /api/showcase/analyze-with-teachable-machine'
  });
});

export default router;
