export function getStripePublishableKey() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string; 
    if (!key) {
        throw new Error("Stripe publishable key is not defined");
    }
    return key;
}
