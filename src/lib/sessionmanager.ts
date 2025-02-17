import { Session } from '../models/sessions';

export async function handleSessionLimit(
  userId: string,
  sessionId: string,
  deviceInfo: string
): Promise<string[]> {
  const activeSessions = await Session.find({ userId }).sort({ createdAt: 1 });

  const invalidatedSessions: string[] = [];

  // ✅ Ensure only 2 active sessions are allowed
  while (activeSessions.length >= 2) {
    const oldestSession = activeSessions.shift(); // Remove oldest session

    if (oldestSession) {
      sendLogoutSignal(oldestSession.sessionId);
      await Session.findByIdAndDelete(oldestSession._id);
      invalidatedSessions.push(oldestSession.sessionId);
    }
  }

  await Session.create({ userId, sessionId, deviceInfo, createdAt: new Date() });

  return invalidatedSessions;
}



function sendLogoutSignal(sessionId: string) {
  console.log(`Logout signal sent for session: ${sessionId}`);
}



export async function validateSession(userId: string, sessionId: string): Promise<boolean> {
  const session = await Session.findOne({
    userId,
    sessionId
  });
  return !!session;
}

export async function removeSession(userId: string, sessionId: string): Promise<void> {
  await Session.deleteOne({
    userId,
    sessionId
  });
}
