import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

interface CreditContextType {
  credits: number;
  isLoading: boolean;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState<number>(150); // Default starting credits
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedInitialCredits = useRef(false);
  const userId = user?.id;

  // Load credits from Clerk user metadata - only run once when user loads
  useEffect(() => {
    const loadCredits = async () => {
      console.log('[USEEFFECT] loadCredits called. hasLoadedInitialCredits:', hasLoadedInitialCredits.current, 'isLoaded:', isLoaded, 'userId:', userId);
      
      // Only load initial credits once to prevent overwriting after updates
      if (hasLoadedInitialCredits.current) {
        console.log('[USEEFFECT] ⚠️ Skipping initial load - already loaded');
        return;
      }

      if (isLoaded && user) {
        try {
          const userCredits = user.unsafeMetadata?.credits as number;
          const hasReceivedInitialCredits = user.unsafeMetadata?.hasReceivedInitialCredits as boolean;
          console.log('[USEEFFECT] 📥 Initial load - Loading credits from Clerk:', userCredits);
          console.log('[USEEFFECT] Has received initial credits:', hasReceivedInitialCredits);
          console.log('[USEEFFECT] Full metadata:', JSON.stringify(user.unsafeMetadata, null, 2));
          
          // Only give free 150 credits to brand new users who have never received initial credits
          if (!hasReceivedInitialCredits && (userCredits === undefined || userCredits === null)) {
            console.log('[USEEFFECT] 🆕 New user detected, giving 150 free trial credits');
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
                credits: 150,
                hasReceivedInitialCredits: true,
              },
            });
            setCredits(150);
            console.log('[USEEFFECT] ✅ Set new user credits to 150');
          } else {
            // Existing user - use their current credits (even if 0)
            const currentCredits = userCredits || 0;
            console.log('[USEEFFECT] 👤 Existing user, setting credits to:', currentCredits);
            setCredits(currentCredits);
            console.log('[USEEFFECT] ✅ Credits set in state');
          }
          hasLoadedInitialCredits.current = true;
          console.log('[USEEFFECT] 🔒 hasLoadedInitialCredits set to true');
        } catch (error) {
          console.error('[USEEFFECT] ❌ Error loading credits:', error);
          setCredits(150);
          hasLoadedInitialCredits.current = true;
        }
      } else if (isLoaded && !user) {
        // Not logged in, use local state
        console.log('[USEEFFECT] 🚫 Not logged in, using local state');
        setCredits(150);
        hasLoadedInitialCredits.current = true;
      }
      setIsLoading(false);
      console.log('[USEEFFECT] ✅ loadCredits complete');
    };

    loadCredits();
  }, [isLoaded, userId]); // Only depend on userId, not the full user object

  const refreshCredits = useCallback(async () => {
    console.log('[refreshCredits] 🔄 Starting refresh...');
    if (user) {
      try {
        console.log('[refreshCredits] Reloading user from Clerk...');
        await user.reload();
        const userCredits = user.unsafeMetadata?.credits as number;
        console.log('[refreshCredits] 📥 Refreshed credits from Clerk:', userCredits);
        console.log('[refreshCredits] Full metadata after reload:', JSON.stringify(user.unsafeMetadata, null, 2));
        setCredits(userCredits || 0);
        console.log('[refreshCredits] ✅ Local state updated to:', userCredits || 0);
      } catch (error) {
        console.error('[refreshCredits] ❌ Error refreshing credits:', error);
      }
    } else {
      console.log('[refreshCredits] ⚠️ No user found, skipping refresh');
    }
  }, [user]);

  const deductCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (credits < amount) {
      return false; // Insufficient credits
    }

    const newCredits = credits - amount;
    setCredits(newCredits);

    // Save to Clerk if user is logged in
    if (user) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            credits: newCredits,
          },
        });
        return true;
      } catch (error) {
        console.error('Error updating credits:', error);
        // Rollback on error
        setCredits(credits);
        return false;
      }
    }

    return true;
  }, [credits, user]);

  const addCredits = useCallback(async (amount: number): Promise<void> => {
    console.log(`[addCredits] 💰 Called with amount: ${amount}`);
    console.log('[addCredits] Current user object exists:', !!user);
    
    // Save to Clerk if user is logged in
    if (user) {
      try {
        // Get current credits without reload to avoid timing issues
        const currentCredits = (user.unsafeMetadata?.credits as number) || 0;
        console.log(`[addCredits] 📊 Current credits in metadata: ${currentCredits}`);
        console.log('[addCredits] Current metadata before update:', JSON.stringify(user.unsafeMetadata, null, 2));
        
        const newCredits = currentCredits + amount;
        console.log(`[addCredits] 🎯 New credits will be: ${newCredits} (${currentCredits} + ${amount})`);
        
        // Update local state immediately for responsive UI
        console.log('[addCredits] ⚡ Updating local state to:', newCredits);
        setCredits(newCredits);
        
        // Update Clerk with new credits
        console.log('[addCredits] 📤 Sending update to Clerk...');
        const updateResult = await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            credits: newCredits,
            hasReceivedInitialCredits: true, // Ensure this is set
          },
        });
        console.log('[addCredits] ✅ Successfully updated Clerk metadata');
        console.log('[addCredits] Update result metadata:', JSON.stringify(updateResult.unsafeMetadata, null, 2));
        console.log('[addCredits] 🎉 addCredits complete!');
        
      } catch (error) {
        console.error('[addCredits] ❌ Error adding credits:', error);
        console.error('[addCredits] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        // Rollback on error
        console.log('[addCredits] 🔙 Rolling back local state');
        setCredits(prevCredits => prevCredits - amount);
        throw error;
      }
    } else {
      // Not logged in, just update local state
      console.log('[addCredits] 🚫 Not logged in, updating local state only');
      setCredits(prevCredits => prevCredits + amount);
      console.log('[addCredits] ✅ Local state updated');
    }
  }, [user]);

  return (
    <CreditContext.Provider value={{ credits, isLoading, deductCredits, addCredits, refreshCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within CreditProvider');
  }
  return context;
};
