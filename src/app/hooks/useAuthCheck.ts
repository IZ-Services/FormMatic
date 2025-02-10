import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuthCheck = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/checkSession');
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser ?? null);
      if (!authUser) checkSession();
    });
  }, []);

  return user;
};
