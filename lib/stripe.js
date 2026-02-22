import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Subscription plan configurations
export const PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 19,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      '10 repository analyses per month',
      'Basic monetization insights',
      'Email support',
      'Community access'
    ],
    limits: {
      analysesPerMonth: 10,
      advancedFeatures: false
    }
  },
  pro: {
    name: 'Pro Plan',
    price: 49,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited repository analyses',
      'Advanced AI-powered insights',
      'Priority support',
      'Custom monetization strategies',
      'API access',
      'Team collaboration'
    ],
    limits: {
      analysesPerMonth: -1, // unlimited
      advancedFeatures: true
    }
  }
};

export const getPlanByPriceId = (priceId) => {
  return Object.values(PLANS).find(plan => plan.priceId === priceId);
};