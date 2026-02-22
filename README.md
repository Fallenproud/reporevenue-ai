# RepoRevenue AI

Transform your GitHub repositories into revenue streams with AI-powered analysis and monetization insights.

## Features

- **AI-Powered Analysis**: Get deep insights into your repository's monetization potential
- **Revenue Forecasting**: Accurate revenue predictions based on market trends
- **Monetization Strategies**: Tailored recommendations for licensing, pricing, and go-to-market strategies
- **Subscription Plans**: Choose between Basic ($19/month) and Pro ($49/month) plans

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js serverless functions (Vercel)
- **Payments**: Stripe integration for subscriptions
- **Styling**: Custom CSS with black & white SaaS aesthetic

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Fallenproud/reporevenue-ai.git
cd reporevenue-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Stripe API keys and other configuration.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret |
| `STRIPE_BASIC_PRICE_ID` | Stripe Price ID for Basic plan |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan |
| `APP_URL` | Your application URL |

## API Endpoints

- `POST /api/analyze` - Analyze a GitHub repository
- `POST /api/create-checkout` - Create Stripe checkout session
- `POST /api/webhook` - Stripe webhook handler

## Deployment

This project is configured for deployment on Vercel:

```bash
npm i -g vercel
vercel --prod
```

## Project Structure

```
reporevenue-ai/
├── api/                    # Serverless API endpoints
│   ├── analyze.js
│   ├── create-checkout.js
│   └── webhook.js
├── lib/                    # Shared backend libraries
│   ├── analyzer.js
│   └── stripe.js
├── src/                    # Frontend React app
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── vercel.json
```

## License

[MIT](LICENSE)
