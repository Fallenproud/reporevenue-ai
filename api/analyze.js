import { analyzeRepository } from '../lib/analyzer.js';
import { stripe } from '../lib/stripe.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { repoUrl, subscriptionId } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Determine user's plan
    let userPlan = 'basic';
    let subscription = null;

    if (subscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        if (subscription.status !== 'active') {
          return res.status(403).json({ 
            error: 'Subscription is not active',
            status: subscription.status 
          });
        }

        // Determine plan based on price ID
        const priceId = subscription.items.data[0].price.id;
        userPlan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro' : 'basic';

      } catch (error) {
        console.error('Subscription verification error:', error);
        return res.status(403).json({ error: 'Invalid subscription' });
      }
    }

    // Perform analysis
    const analysis = await analyzeRepository(repoUrl, userPlan);

    return res.status(200).json({
      success: true,
      plan: userPlan,
      analysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to analyze repository' 
    });
  }
}