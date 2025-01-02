import {onCall} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, Timestamp} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const manageUserSessions = onCall(async (request) => {
  try {
    const {auth: contextAuth} = request;

    if (!contextAuth) {
      throw new Error("Unauthorized request: user is not authenticated");
    }

    const userId = contextAuth.uid;

    const authTimestamp = Timestamp.now();

    const sessionId = Math.random().toString(36).substring(2);
    const userSessionsRef = db.collection("users")
      .doc(userId)
      .collection("sessions");

    const sessionsSnapshot = await userSessionsRef
      .orderBy("authTime", "asc")
      .get();

    if (sessionsSnapshot.size >= 2) {
      const oldestSession = sessionsSnapshot.docs[0];
      await oldestSession.ref.delete();
    }

    await userSessionsRef.doc(sessionId).set({
      deviceId: sessionId,
      authTime: authTimestamp,
    });

    return {sessionId};
  } catch (error) {
    console.error("Error managing user sessions:", error);
    throw new Error("Error managing user sessions");
  }
});
