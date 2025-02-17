import { Session } from '../models/sessions';

export async function handleSessionLimit(
  userId: string,
  newSessionId: string,
  deviceInfo: string
): Promise<string[]> {
  try {
    const activeSessions = await Session.find({ userId }).sort({ createdAt: 1 });
    
    console.log(`Current active sessions for ${userId}:`, activeSessions.map(s => s.sessionId));

    const existingSession = activeSessions.find(session => session.sessionId === newSessionId);
    if (existingSession) {
      console.log(`Session ${newSessionId} already exists`);
      return [];
    }

    const invalidatedSessions: string[] = [];

    if (activeSessions.length >= 2) {
      const oldestSession = activeSessions[0];
      
      await Session.findOneAndDelete({ sessionId: oldestSession.sessionId });
      invalidatedSessions.push(oldestSession.sessionId);
      console.log(`Invalidated session: ${oldestSession.sessionId}`);
    }

    await Session.create({
      userId,
      sessionId: newSessionId,
      deviceInfo,
      createdAt: new Date()
    });
    console.log(`Created new session: ${newSessionId}`);

    const finalCount = await Session.countDocuments({ userId });
    console.log(`Final session count for user ${userId}: ${finalCount}`);

    return invalidatedSessions;
  } catch (error) {
    console.error('Error in handleSessionLimit:', error);
    throw error;
  }
}

export async function validateSession(
  userId: string, 
  sessionId: string
): Promise<boolean> {
  if (!userId || !sessionId) return false;
  
  try {
    const session = await Session.findOne({ userId, sessionId });
    if (!session) {
      console.log(`Session ${sessionId} for user ${userId} not found - invalidated`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}

export async function removeSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  
  try {
    const result = await Session.deleteOne({ sessionId });
    console.log(`Removed session ${sessionId}. Deleted count: ${result.deletedCount}`);
  } catch (error) {
    console.error('Error removing session:', error);
    throw error;
  }
}