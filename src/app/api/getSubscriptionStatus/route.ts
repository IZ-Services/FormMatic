import { FirebaseApp } from "firebase/app";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {auth} from '../../firebase-config';

export const getSubscriptionStatus = async (app: FirebaseApp) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "in", ["trialing", "active"])
  );

  return new Promise<boolean>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          console.log("No active or trialing subscriptions found");
          resolve(false);
        } else {
          console.log("Active or trialing subscription found");
          resolve(true);
        }
        unsubscribe();
      },
      reject
    );
  });
};