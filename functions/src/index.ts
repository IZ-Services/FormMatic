import { onCall, HttpsError } from "firebase-functions/v2/https";
// import { initializeApp } from "firebase-admin/app";
import { Timestamp, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { randomUUID } from "crypto";
import { db } from "../../src/lib/firebaseAdmin";

const MAX_SESSIONS = 2;

export const manageUserSessions = onCall(async (request) => {
  try {
    const { auth: contextAuth, rawRequest } = request;

    if (!contextAuth) {
      throw new HttpsError("unauthenticated", "User is not authenticated.");
    }

    const userId = contextAuth.uid;
    const sessionId = randomUUID();
    const authTimestamp = Timestamp.now();

    const userSessionsRef = db.collection("users").doc(userId).collection("sessions");
    const sessionsSnapshot = await userSessionsRef
      .where("isActive", "==", true)  
      .orderBy("authTime", "asc")
      .get();

    const batch = db.batch();
    
if (sessionsSnapshot.size >= MAX_SESSIONS) {
  const sessionsToDelete = sessionsSnapshot.docs.slice(0, sessionsSnapshot.size - (MAX_SESSIONS - 1));
  console.log(`Deactivating ${sessionsToDelete.length} old sessions`);

  sessionsToDelete.forEach((doc: QueryDocumentSnapshot) => {
    batch.update(doc.ref, { isActive: false });
  });
}

    const ipAddress = rawRequest.headers["x-forwarded-for"] || rawRequest.connection.remoteAddress;
    const userAgent = rawRequest.headers["user-agent"];

    const newSessionRef = userSessionsRef.doc(sessionId);
    batch.set(newSessionRef, {
      deviceId: sessionId,
      authTime: authTimestamp,
      ipAddress,
      userAgent,
      isActive: true,  
      lastSeen: authTimestamp,  
      expiresAt: Timestamp.fromMillis(authTimestamp.toMillis() + 7 * 24 * 60 * 60 * 1000),
    });

    await batch.commit();
    console.log("Successfully managed sessions for user ${userId}, new session: ${sessionId}");

    return { sessionId };
  } catch (error) {
    console.error("Error managing user sessions:", error);
    throw new HttpsError("internal", "Error managing user sessions.");
  }
});