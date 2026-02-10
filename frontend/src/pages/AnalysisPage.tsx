import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { prof, tube1, tube2, tube3, tube4, tube5 } from '../assets/index';
import { useCredits } from '../context/CreditContext';
import { useUser } from '@clerk/clerk-react';

import styles from '../styles/AnalysisPageStyles'; // Import styles

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { addCredits, refreshCredits } = useCredits();
  const { user, isLoaded } = useUser();
  const hasProcessedPayment = useRef(false);

  useEffect(() => {
    console.log('[AnalysisPage useEffect] Running...');
    console.log('[AnalysisPage useEffect] isLoaded:', isLoaded, 'user exists:', !!user);
    console.log('[AnalysisPage useEffect] hasProcessedPayment:', hasProcessedPayment.current);
    console.log('[AnalysisPage useEffect] payment param:', searchParams.get('payment'));
    console.log('[AnalysisPage useEffect] credits param:', searchParams.get('credits'));
    
    // Check if payment was successful
    if (searchParams.get('payment') === 'success') {
      console.log('[AnalysisPage useEffect] ✅ Payment success detected!');
      
      // Wait for user to be loaded before processing payment
      if (!isLoaded) {
        console.log('[AnalysisPage useEffect] ⏳ Waiting for Clerk to load user...');
        return;
      }
      
      if (!user) {
        console.log('[AnalysisPage useEffect] ❌ No user found after Clerk loaded!');
        return;
      }
      
      // Prevent duplicate processing
      if (hasProcessedPayment.current) {
        console.log('[AnalysisPage useEffect] ⚠️ Payment already processed, skipping...');
        return;
      }
      
      const creditsToAdd = searchParams.get('credits');
      
      if (creditsToAdd) {
        // Mark as processed immediately to prevent duplicates
        hasProcessedPayment.current = true;
        
        // Add credits to user account
        const amount = parseInt(creditsToAdd);
        console.log(`[AnalysisPage useEffect] 💰 User loaded! Attempting to add ${amount} credits to account`);
        
        addCredits(amount)
          .then(() => {
            console.log(`[AnalysisPage useEffect] ✅ Successfully added ${amount} credits`);
            // Force refresh credits from server
            console.log('[AnalysisPage useEffect] 🔄 Calling refreshCredits...');
            return refreshCredits();
          })
          .then(() => {
            console.log('[AnalysisPage useEffect] ✅ Credits refreshed from server');
          })
          .catch((error) => {
            console.error('[AnalysisPage useEffect] ❌ Error in credit flow:', error);
            console.error('[AnalysisPage useEffect] Error stack:', error instanceof Error ? error.stack : 'No stack');
            // Reset on error so user can try again
            hasProcessedPayment.current = false;
          });
      } else {
        console.log('[AnalysisPage useEffect] ⚠️ No credits parameter found in URL');
      }
      
      console.log('[AnalysisPage useEffect] 🎉 Showing success message');
      setShowSuccessMessage(true);
      // Remove the payment parameters from URL
      console.log('[AnalysisPage useEffect] 🧹 Cleaning up URL parameters');
      searchParams.delete('payment');
      searchParams.delete('credits');
      setSearchParams(searchParams);
      
      // Hide message after 5 seconds
      setTimeout(() => {
        console.log('[AnalysisPage useEffect] ⏰ Hiding success message');
        setShowSuccessMessage(false);
      }, 5000);
    } else {
      console.log('[AnalysisPage useEffect] ℹ️ No payment success in URL');
    }
  }, [searchParams, setSearchParams, addCredits, refreshCredits, isLoaded, user]);

  const handleButtonClick = () => {
    navigate('/dashboard/photo');
  };

  return (
    <div className={styles.container}>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-semibold">✅ Payment Successful!</p>
          <p className="text-sm">Your credits have been added to your account.</p>
        </div>
      )}

      {/* Colorful background circles */}
      <div className={styles.backgroundCircles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      {/* Test tubes and Scientist image */}
      <div className={styles.content}>
        {/* Test tubes */}
        <img src={tube1} alt="Test tube 1" className={styles.tube1} />
        <img src={tube2} alt="Test tube 2" className={styles.tube2} />
        <img src={tube4} alt="Test tube 3" className={styles.tube3} />
        <img src={tube5} alt="Test tube 4" className={styles.tube4} />

        {/* Scientist image */}
        <img src={prof} alt="Scientist" className={styles.scientistImage} />

        {/* Start Analysis button */}
        <button onClick={handleButtonClick} className={styles.startButton}>
          Start Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisPage;
