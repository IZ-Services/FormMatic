import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

initializeApp();
const db = getFirestore();

export const manageUserSessions = onCall(async (request) => {
  try {
    const { auth: contextAuth, rawRequest } = request;

    if (!contextAuth) {
      throw new HttpsError("unauthenticated", "User is not authenticated.");
    }

    const userId = contextAuth.uid;

    const authTimestamp = Timestamp.now();
    const sessionId = randomUUID();

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

    const ipAddress = rawRequest.headers["x-forwarded-for"] || rawRequest.connection.remoteAddress;
    const userAgent = rawRequest.headers["user-agent"];

    await userSessionsRef.doc(sessionId).set({
      deviceId: sessionId,
      authTime: authTimestamp,
      ipAddress,
      userAgent,
      expiresAt: Timestamp.fromMillis(authTimestamp.toMillis() + 7 * 24 * 60 * 60 * 1000), 
    });

    return { sessionId };
  } catch (error) {
    console.error("Error managing user sessions:", error);
    throw new HttpsError("internal", "Error managing user sessions.");
  }
});
