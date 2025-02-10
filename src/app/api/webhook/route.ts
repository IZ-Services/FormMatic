import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initFirebase } from '../../../firebase-config';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const app = initFirebase();
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    console.error('Error verifying Stripe webhook signature:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
        const userId = customer.metadata.userId;
        console.log('Received invoice.payment_failed event:', event);

        if (userId) {
          const userDocRef = doc(db, 'users', userId);

          console.log(`Updating isSubscribed to false for user: ${userId}`);
          await updateDoc(userDocRef, { isSubscribed: false });
          console.log(`Update successful`);
          

          console.log(`Subscription payment failed for user: ${userId}`);

         if (invoice.subscription) {
    console.log(`Canceling subscription for user: ${userId}`);
    await stripe.subscriptions.cancel(invoice.subscription as string);
    console.log(`Subscription canceled`);
}

        } else {
          console.error('Customer not found');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
        const userId = customer.metadata.userId;

        if (userId) {
          const userDocRef = doc(db, 'users', userId);

          await updateDoc(userDocRef, {
            isSubscribed: false,
          });

          console.log(`Subscription canceled for user: ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling Stripe event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
