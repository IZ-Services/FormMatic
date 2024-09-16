import { FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const updateSubscriptionStatus = async (
  app: FirebaseApp,
  isSubscribed: boolean,
  customerId: string,
) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('User is not authenticated');
    throw new Error('User is not authenticated');
  }

  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { isSubscribed, stripeCustomerId: customerId }, { merge: true });
};

export default updateSubscriptionStatus;
