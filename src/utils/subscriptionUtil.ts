import { FirebaseApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const updateSubscriptionStatus = async (app: FirebaseApp, isSubscribed: boolean) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const db = getFirestore(app);
  const userRef = doc(db, "customers", userId); 
  await setDoc(userRef, { isSubscribed }, { merge: true });
};

export default updateSubscriptionStatus;
