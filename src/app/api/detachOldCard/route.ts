import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string; 
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) { 
  try {
    const data = await req.json();
    const { customerId, newPaymentMethodId } = data;

    if (!customerId || !newPaymentMethodId) {
      throw new Error('Customer ID or new payment method ID is not provided');
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(newPaymentMethodId);
    const customer = paymentMethod.customer;

    if (!customer) {
      throw new Error('Customer not found for the given payment method');
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer as string,
      type: 'card',
    });

    const oldPaymentMethods = paymentMethods.data.filter(pm => pm.id !== newPaymentMethodId);

    for (const paymentMethod of oldPaymentMethods) {
      await stripe.paymentMethods.detach(paymentMethod.id);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error detaching old payment methods:', error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
