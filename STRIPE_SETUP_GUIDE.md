# 🚀 Stripe Setup Guide for RepoRevenue AI

Complete step-by-step guide to configure Stripe payments for your RepoRevenue AI application.

---

## 📋 Prerequisites

- [ ] Stripe account (sign up at [stripe.com](https://stripe.com))
- [ ] RepoRevenue AI project cloned locally
- [ ] Node.js 18+ installed

---

## Step 1: Create Your Stripe Account

### 1.1 Sign Up
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Complete the registration process
3. Verify your email address

### 1.2 Activate Your Account (for live payments)
1. In Stripe Dashboard, go to **Settings** → **Account settings**
2. Complete the activation form with:
   - Business details
   - Bank account for payouts
   - Tax information

> ⚠️ **Note:** You can use test mode without activating your account.

---

## Step 2: Get Your API Keys

### 2.1 Access API Keys
1. Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Toggle between **Test mode** and **Live mode** (top right)
3. Copy the following keys:

| Key Name | Starts With | Used In |
|----------|-------------|---------|
| **Publishable key** | `pk_test_` or `pk_live_` | Frontend (`.env` VITE_STRIPE_PUBLISHABLE_KEY) |
| **Secret key** | `sk_test_` or `sk_live_` | Backend (`.env` STRIPE_SECRET_KEY) |

### 2.2 Update Your .env File

```bash
# Open the .env file in your project root
# Replace the placeholder values:

STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

---

## Step 3: Create Products and Prices

### 3.1 Create the Basic Plan
1. Go to [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Click **"Add product"**
3. Enter details:
   - **Name:** `RepoRevenue AI - Basic`
   - **Description:** `10 repository analyses per month with basic monetization insights`
4. In the **Pricing** section:
   - Select **Recurring**
   - **Price:** `$19.00`
   - **Billing period:** `Monthly`
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`)

### 3.2 Create the Pro Plan
1. Click **"Add product"** again
2. Enter details:
   - **Name:** `RepoRevenue AI - Pro`
   - **Description:** `Unlimited repository analyses with advanced AI insights`
3. In the **Pricing** section:
   - Select **Recurring**
   - **Price:** `$49.00`
   - **Billing period:** `Monthly`
4. Click **Save product**
5. Copy the **Price ID**

### 3.3 Update Your .env File

```bash
STRIPE_BASIC_PRICE_ID=price_1ABC123_basic_plan_id_here
STRIPE_PRO_PRICE_ID=price_1ABC123_pro_plan_id_here
```

---

## Step 4: Configure Webhook Endpoint

Webhooks allow Stripe to notify your application about payment events.

### 4.1 For Local Development (using Stripe CLI)

#### Install Stripe CLI
**Windows:**
```powershell
# Download from: https://github.com/stripe/stripe-cli/releases
# Or using scoop:
scoop install stripe
```

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download and install from releases page
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz
tar -xvf stripe_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

#### Login to Stripe CLI
```bash
stripe login
```
This will open a browser to authenticate.

#### Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

You'll see output like:
```
> Ready! You are using Stripe API version [2023-10-16].
> Your webhook signing secret is whsec_xxxxxxxxxxxxxxx (^C to quit)
```

**Copy the webhook signing secret** and add to your `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx
```

### 4.2 For Production (Vercel Deployment)

#### Deploy First
1. Deploy your app to Vercel:
```bash
npm i -g vercel
vercel --prod
```

2. Copy your production URL (e.g., `https://your-app.vercel.app`)

#### Configure Webhook in Stripe Dashboard
1. Go to [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter:
   - **Endpoint URL:** `https://your-app.vercel.app/api/webhook`
   - **Description:** `RepoRevenue AI Production Webhook`
4. Click **"Select events"** and choose:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click on the new endpoint
7. Reveal and copy the **Signing secret**
8. Add to your production environment variables in Vercel:
```bash
vercel env add STRIPE_WEBHOOK_SECRET
```

---

## Step 5: Test Your Integration

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Start Webhook Listener (in another terminal)
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 5.3 Test Checkout Flow
1. Open http://localhost:3000
2. Click **"Subscribe Now"** on either plan
3. Use Stripe test card numbers:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

- Use any future date for expiry
- Use any 3 digits for CVC
- Use any 5 digits for ZIP

### 5.4 Verify Webhook Events
Check your terminal running `stripe listen` to see webhook events being received.

---

## Step 6: Go Live Checklist

Before switching to live mode, ensure:

- [ ] All test payments work correctly
- [ ] Webhooks are receiving events
- [ ] Subscription status updates work
- [ ] Error handling is implemented
- [ ] You've activated your Stripe account
- [ ] You've switched to live API keys
- [ ] You've created live products and prices
- [ ] You've updated production environment variables
- [ ] You've configured production webhook endpoint

### Switching to Live Mode
1. Toggle to **Live mode** in Stripe Dashboard
2. Get new live API keys
3. Create live products and prices (test ones don't carry over)
4. Update `.env` with live keys
5. Update Vercel environment variables with live keys
6. Redeploy to Vercel

---

## 🔧 Troubleshooting

### Issue: "No signature found" webhook error
**Solution:** Ensure `STRIPE_WEBHOOK_SECRET` is set correctly and the webhook endpoint URL is accessible.

### Issue: Checkout session fails to create
**Solution:** 
- Verify `STRIPE_SECRET_KEY` is correct
- Check that `STRIPE_BASIC_PRICE_ID` and `STRIPE_PRO_PRICE_ID` exist in your Stripe account
- Ensure price IDs match the mode (test/live) you're using

### Issue: CORS errors
**Solution:** The API endpoints already have CORS headers configured. If issues persist, check that `APP_URL` matches your actual domain.

### Issue: "Price not found" error
**Solution:** Price IDs are different between test and live modes. Make sure you're using the correct price IDs for your current mode.

---

## 📊 Stripe Dashboard Navigation

| Task | URL |
|------|-----|
| API Keys | https://dashboard.stripe.com/apikeys |
| Products & Prices | https://dashboard.stripe.com/products |
| Webhooks | https://dashboard.stripe.com/webhooks |
| Events | https://dashboard.stripe.com/events |
| Customers | https://dashboard.stripe.com/customers |
| Subscriptions | https://dashboard.stripe.com/subscriptions |
| Payments | https://dashboard.stripe.com/payments |

---

## 🎓 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe CLI Reference](https://stripe.com/docs/stripe-cli)
- [Checkout Sessions API](https://stripe.com/docs/api/checkout/sessions)
- [Subscription Lifecycle](https://stripe.com/docs/billing/subscriptions/overview)

---

**Next Steps:** See `ROADMAP.md` for future enhancements and production-ready features.
