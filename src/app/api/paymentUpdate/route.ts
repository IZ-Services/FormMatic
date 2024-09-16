import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, email } = data;

    if (!userId) {
      throw new Error('User ID is not provided');
    }

    let customer: Stripe.Customer | null = null;

    if (email) {
      const customers = await stripe.customers.list({ email: email });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      }
    }

    if (!customer) {
      throw new Error('Customer not found');
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (!subscriptions.data.length) {
      throw new Error('No active subscription found for this customer');
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret }, { status: 200 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
