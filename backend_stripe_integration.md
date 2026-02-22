> **Generated**: 2026-02-22T15:02:11.760Z
> **Language**: English
> **Purpose**: Generate a simple backend setup using Node.js and Express for RepoRevenue AI, including API endpoints for GitHub repo analysis (mock for now, integrate with Google AI API later), and Stripe integration for handling subscriptions ($19/month basic, $49/month pro). Include necessary files: server.js, package.json for backend, Stripe webhook handler, and frontend integration code to update App.tsx for payment buttons. Output in structured Markdown with code blocks for each file. Ensure it's deployable to Vercel or similar serverless platform.

# RepoRevenue AI - Backend Setup Documentation

## Architecture Overview

This document provides a complete backend implementation for RepoRevenue AI using Node.js, Express, and Stripe integration. The architecture is designed for serverless deployment on Vercel with support for GitHub repository analysis and subscription management.

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Payment Processing**: Stripe
- **Deployment**: Vercel (serverless functions)
- **API Integration**: Google AI API (placeholder for future integration)

---

## Project Structure

```
repo-revenue-ai/
├── api/
│   ├── analyze.js          # GitHub repo analysis endpoint
│   ├── create-checkout.js  # Stripe checkout session
│   ├── webhook.js          # Stripe webhook handler
│   └── subscription.js     # Subscription management
├── lib/
│   ├── stripe.js           # Stripe configuration
│   └── analyzer.js         # Analysis logic (mock)
├── src/
│   └── App.tsx             # Updated frontend
├── package.json
├── vercel.json
└── .env.example
```

---

## Backend Implementation

### 1. Package Configuration

**File: `package.json`**

```json
{
  "name": "reporevenue-ai-backend",
  "version": "1.0.0",
  "description": "Backend API for RepoRevenue AI - GitHub repository monetization analysis",
  "main": "api/index.js",
  "type": "module",
  "scripts": {
    "dev": "vercel dev",
    "build": "echo 'No build step required for serverless'",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "express": "^4.18.2",
    "stripe": "^14.14.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "axios": "^1.6.5",
    "@google/generative-ai": "^0.2.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.5",
    "vercel": "^33.2.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Vercel Configuration

**File: `vercel.json`**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Environment Variables

**File: `.env.example`**

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs
STRIPE_BASIC_PRICE_ID=price_basic_monthly_id
STRIPE_PRO_PRICE_ID=price_pro_monthly_id

# Google AI API
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Application
APP_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# Node Environment
NODE_ENV=development
```

---

## Core Library Files

### 4. Stripe Configuration

**File: `lib/stripe.js`**

```javascript
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
```

### 5. Repository Analyzer (Mock Implementation)

**File: `lib/analyzer.js`**

```javascript
/**
 * Mock repository analyzer
 * TODO: Integrate with Google AI API for real analysis
 */

export const analyzeRepository = async (repoUrl, plan = 'basic') => {
  // Validate GitHub URL
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/?$/;
  if (!githubRegex.test(repoUrl)) {
    throw new Error('Invalid GitHub repository URL');
  }

  // Extract owner and repo name
  const urlParts = repoUrl.replace(/\/$/, '').split('/');
  const owner = urlParts[urlParts.length - 2];
  const repo = urlParts[urlParts.length - 1];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis data
  const mockAnalysis = {
    repository: {
      owner,
      name: repo,
      url: repoUrl,
      analyzedAt: new Date().toISOString()
    },
    monetizationScore: Math.floor(Math.random() * 40) + 60, // 60-100
    insights: {
      strengths: [
        'Active community engagement with consistent contributions',
        'Well-documented codebase with comprehensive README',
        'Clear value proposition for potential users',
        'Growing star count indicating market interest'
      ],
      opportunities: [
        'Consider offering premium support packages',
        'Develop enterprise-tier features for B2B customers',
        'Create educational content and tutorials (monetizable)',
        'Implement sponsorship tiers on GitHub Sponsors'
      ],
      recommendations: [
        'Set up GitHub Sponsors with tiered benefits',
        'Create a landing page highlighting commercial use cases',
        'Develop a freemium model with advanced features',
        'Build partnerships with complementary tools'
      ]
    },
    monetizationStrategies: [
      {
        strategy: 'GitHub Sponsors',
        potential: 'Medium',
        effort: 'Low',
        timeline: '1-2 months',
        estimatedRevenue: '$500-2000/month'
      },
      {
        strategy: 'Premium Support',
        potential: 'High',
        effort: 'Medium',
        timeline: '2-3 months',
        estimatedRevenue: '$2000-5000/month'
      },
      {
        strategy: 'Enterprise Licensing',
        potential: 'High',
        effort: 'High',
        timeline: '3-6 months',
        estimatedRevenue: '$5000-20000/month'
      }
    ],
    metrics: {
      communitySize: Math.floor(Math.random() * 5000) + 1000,
      activityLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      commercialPotential: ['Medium', 'High', 'Very High'][Math.floor(Math.random() * 3)]
    }
  };

  // Add advanced insights for Pro plan
  if (plan === 'pro') {
    mockAnalysis.advancedInsights = {
      competitorAnalysis: [
        'Similar projects generating $3k-10k/month through sponsorships',
        'Market gap identified in enterprise segment',
        'Opportunity for SaaS wrapper with 3x pricing potential'
      ],
      marketTrends: [
        'Growing demand in target industry (15% YoY)',
        'Increasing enterprise adoption of similar tools',
        'Emerging use cases in AI/ML workflows'
      ],
      customStrategy: {
        phase1: 'Launch GitHub Sponsors with 3 tiers ($10, $50, $200/month)',
        phase2: 'Develop premium support offering for businesses',
        phase3: 'Create enterprise version with SLA and custom features',
        projectedRevenue: '$15k-30k/month within 12 months'
      }
    };
  }

  return mockAnalysis;
};

/**
 * Future: Integrate Google AI API
 * 
 * import { GoogleGenerativeAI } from '@google/generative-ai';
 * 
 * const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
 * const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
 * 
 * // Use model.generateContent() with repository data
 */
```

---

## API Endpoints

### 6. Repository Analysis Endpoint

**File: `api/analyze.js`**

```javascript
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
```

### 7. Stripe Checkout Session Creation

**File: `api/create-checkout.js`**

```javascript
import { stripe, PLANS } from '../lib/stripe.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, customerEmail } = req.body;

    if (!plan || !['basic', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const selectedPlan = PLANS[plan];
    const successUrl = `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.APP_URL}/pricing`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan: plan,
      },
      subscription_data: {
        metadata: {
          plan: plan,
        },
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}
```

### 8. Stripe Webhook Handler

**File: `api/webhook.js`**

```javascript
import { stripe } from '../lib/stripe.js';
import { buffer } from 'micro';

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        
        // TODO: Store subscription info in your database
        // const subscription = await stripe.subscriptions.retrieve(session.subscription);
        // await db.users.update({ email: session.customer_email }, { subscriptionId: subscription.id });
        
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('Subscription created:', subscription.id);
        
        // TODO: Update user record with subscription details
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        
        // Handle plan changes, status updates
        if (subscription.status === 'active') {
          

---
*Generated by Flowith OS Deep Thinking*