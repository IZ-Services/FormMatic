"use client";
import { FirebaseApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import {auth} from '../../firebase-config';
import { getFunctions, httpsCallable } from "firebase/functions";

export const getCheckoutUrl = async (
  app: FirebaseApp,
  priceId: string
): Promise<string> => {

  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  const docData = {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  };

  const docRef = await addDoc(checkoutSessionRef, docData);

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const { error, url } = data as {
        error?: { message: string };
        url?: string;
      };
      if (error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        console.log("Stripe Checkout URL:", url);
        unsubscribe();
        resolve(url);
      }
    });
  });
};

export const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
  const user = auth.currentUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dataWithUrl: any;
  try {
    const functions = getFunctions(app, "us-west2");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: window.location.origin,
    });

    dataWithUrl = data as { url: string };
  } catch (error) {
    console.error(error);
  }

  return new Promise<string>((resolve, reject) => {
    if (dataWithUrl?.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};