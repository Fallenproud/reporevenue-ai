import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PricingPlan {
  name: string;
  price: number;
  priceId: string;
  features: string[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Basic',
    price: 19,
    priceId: 'price_basic',
    features: [
      'Up to 10 repository analyses per month',
      'Basic revenue insights',
      'Email support',
      'Export reports (PDF)',
    ],
  },
  {
    name: 'Pro',
    price: 49,
    priceId: 'price_pro',
    features: [
      'Unlimited repository analyses',
      'Advanced revenue insights & predictions',
      'Priority support',
      'Export reports (PDF, CSV, JSON)',
      'API access',
      'Custom integrations',
    ],
    popular: true,
  },
];

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      setAnalysisError('Please enter a GitHub repository URL');
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      setAnalysisError(
        error instanceof Error ? error.message : 'Failed to analyze repository'
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string, planName: string) => {
    setCheckoutLoading(priceId);
    setCheckoutError('');

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Failed to initiate checkout'
      );
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">RepoRevenue AI</h1>
          <p className="tagline">
            Transform GitHub repositories into revenue insights
          </p>
        </div>
      </header>

      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h2 className="hero-title">
              Analyze Your Repository's Revenue Potential
            </h2>
            <p className="hero-description">
              Get AI-powered insights on monetization strategies, market
              potential, and revenue forecasts for any GitHub repository.
            </p>

            <div className="input-section">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="github-input"
                  placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={analysisLoading}
                />
                <button
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={analysisLoading}
                >
                  {analysisLoading ? (
                    <span className="button-loading">
                      <span className="spinner"></span>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>

              {analysisError && (
                <div className="error-message">{analysisError}</div>
              )}

              {analysisResult && (
                <div className="analysis-result">
                  <h3>Analysis Complete</h3>
                  <div className="result-content">
                    <p>
                      <strong>Repository:</strong> {analysisResult.repository}
                    </p>
                    <p>
                      <strong>Revenue Potential:</strong>{' '}
                      {analysisResult.revenuePotential}
                    </p>
                    <p>
                      <strong>Recommended Strategy:</strong>{' '}
                      {analysisResult.strategy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing">
          <div className="container">
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-description">
              Select the plan that best fits your needs. All plans include a
              14-day money-back guarantee.
            </p>

            {checkoutError && (
              <div className="error-message checkout-error">
                {checkoutError}
              </div>
            )}

            <div className="pricing-cards">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.priceId}
                  className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                >
                  {plan.popular && (
                    <div className="popular-badge">Most Popular</div>
                  )}
                  <div className="card-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="price-amount">${plan.price}</span>
                      <span className="price-period">/month</span>
                    </div>
                  </div>

                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <svg
                          className="check-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`subscribe-button ${
                      plan.popular ? 'primary' : 'secondary'
                    }`}
                    onClick={() => handleSubscribe(plan.priceId, plan.name)}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === plan.priceId ? (
                      <span className="button-loading">
                        <span className="spinner"></span>
                        Processing...
                      </span>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">Why RepoRevenue AI?</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">📊</div>
                <h3>AI-Powered Analysis</h3>
                <p>
                  Advanced machine learning algorithms analyze your repository's
                  code, documentation, and market positioning.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">💰</div>
                <h3>Revenue Forecasting</h3>
                <p>
                  Get accurate revenue predictions based on similar projects and
                  market trends.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <h3>Monetization Strategies</h3>
                <p>
                  Receive tailored recommendations for licensing, pricing, and
                  go-to-market strategies.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">📈</div>
                <h3>Market Insights</h3>
                <p>
                  Understand your competitive landscape and identify untapped
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 RepoRevenue AI. All rights reserved.</p>
          <div className="footer-links">
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
