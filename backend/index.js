import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = 5000;

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Middleware
app.use(cors());
app.use(express.json()); 

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
