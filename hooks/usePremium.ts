import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getUserData, createUser } from '@/lib/firestore';

interface PremiumStatus {
  isPremium: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  loading: boolean;
}

export function usePremium(user: User | null): PremiumStatus {
  const [isPremium, setIsPremium] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        setIsPremium(false);
        setIsTrialActive(false);
        setTrialDaysLeft(0);
        setLoading(false);
        return;
      }

      try {
        let userData = await getUserData(user.uid);
        
        // Create user document if it doesn't exist
        if (!userData) {
          await createUser(user.uid, user.email || '');
          userData = { isPremium: false, trialStart: new Date() };
        }

        // Check if user is premium
        if (userData.isPremium) {
          setIsPremium(true);
          setIsTrialActive(false);
          setTrialDaysLeft(0);
          setLoading(false);
          return;
        }

        // Calculate trial status
        if (userData.trialStart) {
          const trialStartDate = userData.trialStart.toDate ? userData.trialStart.toDate() : new Date(userData.trialStart);
          const now = new Date();
          const daysSinceStart = Math.floor((now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
          const daysLeft = Math.max(0, 30 - daysSinceStart);
          
          setIsTrialActive(daysLeft > 0);
          setTrialDaysLeft(daysLeft);
        } else {
          setIsTrialActive(false);
          setTrialDaysLeft(0);
        }

        setIsPremium(false);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
        setIsTrialActive(false);
        setTrialDaysLeft(0);
      } finally {
        setLoading(false);
      }
    }

    checkPremiumStatus();
  }, [user]);

  return { isPremium, isTrialActive, trialDaysLeft, loading };
}
