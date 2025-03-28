import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { priceId, userId, email } = data;

    if (!userId || !email) {
      throw new Error('User ID or email is not provided');
    }

    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        metadata: {
          userId: userId,
        },
        email: email,
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      collection_method: 'charge_automatically',
      expand: ['latest_invoice.payment_intent'],
      payment_settings: {
        payment_method_types: ['card'],
      },
    });

    const latestInvoice = subscription.latest_invoice;
    if (!latestInvoice || typeof latestInvoice === 'string') {
      throw new Error('Latest invoice is not available or is of unexpected type');
    }

    const paymentIntent = latestInvoice.payment_intent;
    if (!paymentIntent || typeof paymentIntent === 'string') {
      throw new Error('Payment intent is not available or is of unexpected type');
    }

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
