import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getUserData, createUser } from '@/lib/firestore';

export function usePremium(user: User | null) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        let userData = await getUserData(user.uid);
        
        // Create user document if it doesn't exist
        if (!userData) {
          await createUser(user.uid, user.email || '');
          userData = { isPremium: false };
        }

        setIsPremium(userData.isPremium || false);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    }

    checkPremiumStatus();
  }, [user]);

  return { isPremium, loading };
}
