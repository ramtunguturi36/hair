import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FaCheckCircle, FaArrowLeft, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useCredits } from '../context/CreditContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PricingPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { credits } = useCredits();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment) {
      setPaymentStatus(payment);
      // Clear payment status after 5 seconds
      const timer = setTimeout(() => {
        setPaymentStatus(null);
        // Remove query params from URL
        navigate('/dashboard/pricing', { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate]);

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

  const handleCheckout = async (plan: typeof plans[0]) => {
    if (!isSignedIn) {
      alert('Please login or sign up to purchase credits.');
      navigate('/');
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to load");
      alert('Payment system failed to load. Please try again.');
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
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Payment Status Notifications */}
        {paymentStatus === 'cancelled' && (
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg flex items-center">
            <FaTimesCircle className="text-2xl mr-3" />
            <div>
              <p className="font-bold">Payment Cancelled</p>
              <p className="text-sm">Your payment was cancelled. You can try again anytime.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Buy Analysis Credits
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Get AI-powered hair analysis and personalized recommendations
            </p>
            <div className="inline-block bg-white/50 backdrop-blur-sm border border-green-200 rounded-2xl px-8 py-4 shadow-sm">
              <p className="text-green-800 font-bold flex items-center gap-3">
                <span className="text-sm uppercase tracking-wider text-green-600">Current Balance</span>
                <span className="text-3xl">{credits}</span>
                <span className="text-sm font-normal text-green-600">Credits</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl shadow-xl p-8 text-center transform transition-all hover:scale-105 ${plan.popular
                  ? 'border-4 border-green-500 bg-white'
                  : 'border-2 border-gray-200 bg-white'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                    🔥 MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ₹{plan.amount / 100}
                  </span>
                </div>
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg py-2 px-4 inline-block">
                  <p className="text-xl font-bold text-green-700">
                    {plan.credits} Credits
                  </p>
                  <p className="text-xs text-green-600">
                    ₹{((plan.amount / 100) / plan.credits).toFixed(2)} per credit
                  </p>
                </div>
              </div>

              <ul className="text-left space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl shadow-green-200'
                    : 'bg-gray-900 hover:bg-black text-white shadow-lg'
                  }`}
                onClick={() => handleCheckout(plan)}
              >
                Purchase Now
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            💡 How Credits Work
          </h3>
          <p className="text-blue-800">
            Each hair analysis costs <strong>25 credits</strong>. Credits never expire and can be used anytime.
            Purchase the package that best fits your needs – no subscriptions, no hidden fees!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
