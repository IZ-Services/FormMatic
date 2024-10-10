import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const manageUserSessions = onRequest(async (req, res) => {
  const {userId, authTime} = req.body;
  const sessionId = Math.random().toString(36).substring(2);
  const userSessionsRef = db.collection("users").doc(userId)
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
    authTime,
  });

  res.send({sessionId});
});
