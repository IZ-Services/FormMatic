import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initFirebase } from '../../../firebase-config';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const app = initFirebase();
const db = getFirestore(app);

async function updateUserSubscriptionStatus(
  userId: string, 
  updates: { isSubscribed: boolean; [key: string]: any }
) {
  console.log(`Attempting to update subscription status for user: ${userId}`, updates);
  
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updates);
    console.log(`Successfully updated subscription status for user: ${userId}`);
    return true;
  } catch (error) {
    console.error(`Failed to update subscription status for user: ${userId}:`, error);
    throw error;
  }
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  try {
    console.log(`Retrieving customer information for ID: ${customerId}`);
    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
    
    if (!customer.metadata?.userId) {
      console.warn(`No userId found in metadata for customer: ${customerId}`);
      return null;
    }
    
    return customer.metadata.userId;
  } catch (error) {
    console.error(`Failed to retrieve customer: ${customerId}:`, error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log('Received webhook request');
  
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    console.error('No Stripe signature found in request');
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    console.log('Constructing Stripe event from webhook payload');
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    console.log(`Successfully verified webhook signature for event: ${event.type}`);
  } catch (err) {
    console.error('Error verifying Stripe webhook signature:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    console.log(`Processing event type: ${event.type}`);
    
    switch (event.type) {
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.log(`Processing invoice payment failure for customer: ${customerId}`);

        const userId = await getUserIdFromCustomer(customerId);
        if (!userId) break;

        await updateUserSubscriptionStatus(userId, {
          isSubscribed: false,
          lastPaymentFailure: new Date().toISOString()
        });

        if (invoice.subscription) {
          console.log(`Canceling subscription: ${invoice.subscription}`);
          try {
            await stripe.subscriptions.cancel(invoice.subscription as string);
            console.log(`Successfully canceled subscription: ${invoice.subscription}`);
          } catch (error) {
            console.error(`Failed to cancel subscription: ${invoice.subscription}:`, error);
          }
        }
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        const customerId = charge.customer as string;
        console.log(`Processing charge failure for customer: ${customerId}`);

        if (!customerId) {
          console.warn('No customer ID associated with failed charge');
          break;
        }

        const userId = await getUserIdFromCustomer(customerId);
        if (!userId) break;

        await updateUserSubscriptionStatus(userId, {
          isSubscribed: false,
          lastPaymentFailure: new Date().toISOString()
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;
        console.log(`Processing payment intent failure for customer: ${customerId}`);

        if (!customerId) {
          console.warn('No customer ID associated with failed payment intent');
          break;
        }

        const userId = await getUserIdFromCustomer(customerId);
        if (!userId) break;

        await updateUserSubscriptionStatus(userId, {
          isSubscribed: false,
          lastPaymentFailure: new Date().toISOString()
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log(`Processing subscription deletion for customer: ${customerId}`);

        const userId = await getUserIdFromCustomer(customerId);
        if (!userId) break;

        await updateUserSubscriptionStatus(userId, {
          isSubscribed: false,
          subscriptionEndDate: new Date().toISOString()
        });
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling Stripe event:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}