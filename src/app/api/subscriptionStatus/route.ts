import { NextResponse, NextRequest } from 'next/server';
import updateSubscriptionStatus from '../../../utils/subscriptionUtil';
import { initFirebase } from '../../../firebase-config';

const app = initFirebase();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { isSubscribed } = data;

    if (typeof isSubscribed !== 'boolean') {
      throw new Error('Invalid subscription status');
    }

    await updateSubscriptionStatus(app, isSubscribed);
    
    return NextResponse.json({ message: 'Subscription status updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}