// PaymentPlansSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPlansSection = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const plans = [
    {
      name: 'Starter Pack',
      credits: 100,
      amount: 19900, // ₹199 in paise
      description: "Perfect for trying out our hair analysis service.",
      features: [
        "100 analysis credits",
        "AI-powered hair diagnosis",
        "Product recommendations",
        "30-day validity"
      ]
    },
    {
      name: 'Popular Pack',
      credits: 500,
      amount: 79900, // ₹799 in paise
      description: "Best value for regular hair care tracking.",
      features: [
        "500 analysis credits",
        "Priority AI processing",
        "Detailed reports & history",
        "Product recommendations",
        "90-day validity"
      ],
      popular: true
    },
    {
      name: 'Premium Pack',
      credits: 1500,
      amount: 199900, // ₹1999 in paise
      description: "For comprehensive hair care monitoring.",
      features: [
        "1500 analysis credits",
        "Fastest processing",
        "Unlimited report history",
        "Premium support",
        "180-day validity"
      ]
    },
  ];

  const handleCheckout = async (plan) => {
    // Require login before checkout
    if (!isSignedIn) {
      alert('Please login or sign up to purchase credits.');
      navigate('/login');
      return;
    }

    const stripe = await stripePromise; 
    if (!stripe) {
      console.error("Stripe failed to load");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/create-checkout-session', {
        planId: plan.name,
        planAmount: plan.amount,
        planCurrency: 'inr',
        credits: plan.credits,
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("Failed to retrieve checkout URL.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <section id="pricing" className="bg-gray-100 py-16 px-6">
      <h3 className="text-3xl font-semibold text-center mb-4">
        Choose Your Hair Analysis Credits
      </h3>
      <p className="text-center text-gray-500 mb-8">
        Get AI-powered hair analysis and personalized recommendations. 
        Purchase credits that fit your needs - no monthly commitments!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-lg shadow-lg p-8 text-center border-2 ${plan.popular ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}
          >
            {plan.popular && (
              <span className="text-sm font-semibold text-red-600 bg-red-200 rounded-full px-3 py-1 inline-block mb-3">
                Most Popular
              </span>
            )}
            <h4 className="font-bold text-lg text-gray-700 mb-2">{plan.name}</h4>
            <p className="text-grey-500 text-sm mb-4">{plan.description}</p>
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-800">
                ₹{plan.amount / 100}
              </p>
              <p className="text-lg font-semibold text-green-600 mt-2">
                {plan.credits} Credits
              </p>
            </div>

            <ul className="text-left text-gray-700 mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold"
                onClick={() => handleCheckout(plan)}
            >
                Buy Credits
            </button>

            </div>
                ))}
            </div>

        </section>
      );
};

export default PaymentPlansSection;