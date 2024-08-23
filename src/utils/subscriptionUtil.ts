import { FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const updateSubscriptionStatus = async (app: FirebaseApp, isSubscribed: boolean, customerId: string) => {
  const auth = getAuth(app);
  const userEmail = auth.currentUser?.email;
  if (!userEmail) {
    console.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const db = getFirestore(app);
  const userRef = doc(db, "users", userEmail); 
  await setDoc(userRef, { isSubscribed, stripeCustomerId: customerId }, { merge: true });
};

export default updateSubscriptionStatus;
