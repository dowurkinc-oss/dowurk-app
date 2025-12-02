# PayPal Subscription Integration Guide

## Overview
This guide provides the complete implementation for PayPal subscription-based monetization for The DowUrk FramewUrk platform.

## Subscription Plans
As per user requirements, implement tiered subscription model:
- **Basic Plan:** $29/month
- **Professional Plan:** $49/month  
- **Enterprise Plan:** $99/month

## Implementation Steps

### Step 1: Create PayPal Product

**API Endpoint:** POST https://api-m.sandbox.paypal.com/v1/catalogs/products

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/catalogs/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS-TOKEN" \
  -H "PayPal-Request-Id: UNIQUE-REQUEST-ID" \
  -d '{
  "name": "DowUrk FramewUrk Membership",
  "description": "Access to premium business resources, AI tools, and community features",
  "type": "SERVICE",
  "category": "SOFTWARE",
  "image_url": "https://customer-assets.emergentagent.com/job_equity-focus/artifacts/875dlk3n_dowurk_color_shield.png",
  "home_url": "https://dowurktoday.com"
}'
```

**Response:** Save the `product_id` (e.g., "PROD-XXXXX")

---

### Step 2: Create Subscription Plans

Create 3 plans for different tiers:

#### Basic Plan ($29/month)
```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS-TOKEN" \
  -H "PayPal-Request-Id: UNIQUE-REQUEST-ID-2" \
  -d '{
  "product_id": "YOUR_PRODUCT_ID",
  "name": "Basic Plan",
  "description": "Essential business resources and AI assistant access",
  "billing_cycles": [
    {
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": 0,
      "pricing_scheme": {
        "fixed_price": {
          "value": "29",
          "currency_code": "USD"
        }
      }
    }
  ],
  "payment_preferences": {
    "auto_bill_outstanding": true,
    "setup_fee_failure_action": "CONTINUE",
    "payment_failure_threshold": 3
  }
}'
```

#### Professional Plan ($49/month)
```bash
# Same as above but change:
# - name: "Professional Plan"
# - description: "Advanced features, priority support, and exclusive content"
# - value: "49"
```

#### Enterprise Plan ($99/month)
```bash
# Same as above but change:
# - name: "Enterprise Plan"
# - description: "Full platform access, white-label options, dedicated support"
# - value: "99"
```

**Response:** Save each `plan_id` (e.g., "P-XXXXX")

---

### Step 3: Add PayPal JavaScript SDK to Frontend

Update `/app/frontend/public/index.html`:

```html
<!-- Add before closing </head> tag -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&vault=true&intent=subscription"></script>
```

---

### Step 4: Create Subscription Page Component

Create `/app/frontend/src/pages/Pricing.js`:

```javascript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: 29,
      plan_id: 'P-BASIC-PLAN-ID',
      features: [
        'AI Business Assistant',
        'Business Directory Listing',
        'Community Access',
        'Monthly Newsletter',
        'Resource Library Access'
      ]
    },
    {
      name: 'Professional',
      price: 49,
      plan_id: 'P-PRO-PLAN-ID',
      popular: true,
      features: [
        'Everything in Basic',
        'Priority AI Support',
        'Grant Matching Service',
        'Virtual Booth Listing',
        'Weekly Training Sessions',
        'Business Certification Assistance'
      ]
    },
    {
      name: 'Enterprise',
      price: 99,
      plan_id: 'P-ENTERPRISE-PLAN-ID',
      features: [
        'Everything in Professional',
        'Dedicated Account Manager',
        'Custom AI Training',
        'White-label Solutions',
        'API Access',
        '1-on-1 Consulting Sessions',
        'Premium Event Access'
      ]
    }
  ];

  const handleSubscribe = (planId) => {
    window.paypal.Buttons({
      createSubscription: function(data, actions) {
        return actions.subscription.create({
          'plan_id': planId
        });
      },
      onApprove: function(data, actions) {
        alert('Subscription successful! ID: ' + data.subscriptionID);
        // TODO: Save subscription to your backend
      },
      onError: function(err) {
        console.error('Subscription error:', err);
        alert('Subscription failed. Please try again.');
      }
    }).render('#paypal-button-' + planId);
  };

  return (
    <div className="space-y-12">
      <h1 className="text-5xl font-bold text-center">
        <span className="bg-gradient-to-r from-[#A4D65E] to-[#006847] bg-clip-text text-transparent">
          Membership Plans
        </span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? 'border-4 border-[#A4D65E]' : ''}>
            <CardHeader>
              {plan.popular && <Badge className="mb-2">Most Popular</Badge>}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold mt-4">
                ${plan.price}<span className="text-lg text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div id={`paypal-button-${plan.plan_id}`}></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
```

---

### Step 5: Backend Integration

Create `/app/backend/subscription_handler.py`:

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import requests
import os

subscription_router = APIRouter(prefix="/api/subscriptions")

class SubscriptionWebhook(BaseModel):
    event_type: str
    resource: dict

@subscription_router.post("/webhook")
async def paypal_webhook(webhook_data: SubscriptionWebhook):
    """Handle PayPal subscription webhooks"""
    event_type = webhook_data.event_type
    
    if event_type == "BILLING.SUBSCRIPTION.CREATED":
        # New subscription created
        subscription_id = webhook_data.resource.get("id")
        # TODO: Save to database
        
    elif event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
        # Subscription activated - grant access
        pass
        
    elif event_type == "BILLING.SUBSCRIPTION.CANCELLED":
        # Subscription cancelled - revoke access
        pass
        
    elif event_type == "PAYMENT.SALE.COMPLETED":
        # Payment received
        pass
    
    return {"status": "received"}

@subscription_router.get("/status/{user_id}")
async def get_subscription_status(user_id: str):
    """Check user's subscription status"""
    # TODO: Query database for user's active subscription
    return {"active": False, "plan": None}
```

---

### Step 6: Testing

**Sandbox Testing:**
1. Use PayPal sandbox credentials
2. Test subscription flow: https://www.sandbox.paypal.com
3. Create test buyer account
4. Complete subscription purchase
5. Verify webhook events received

**Live Deployment:**
1. Replace sandbox URLs with production URLs
2. Update client_id to production credentials
3. Set up webhook URL in PayPal Dashboard
4. Test with real account before going live

---

## API Credentials Needed

**Required from PayPal:**
- Client ID (sandbox and production)
- Secret Key (sandbox and production)
- Webhook ID

**Get credentials:**
1. Go to https://developer.paypal.com
2. Create app
3. Get Client ID and Secret
4. Set up webhooks

---

## Environment Variables

Add to `/app/backend/.env`:
```
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret_key
PAYPAL_MODE=sandbox  # or 'production'
```

---

## Security Considerations

1. **Verify webhooks** - Validate PayPal webhook signatures
2. **Store subscriptions** - Save subscription IDs in database
3. **Handle failures** - Retry logic for payment failures
4. **Cancel flow** - Allow users to cancel subscriptions
5. **Upgrade/downgrade** - Handle plan changes

---

## User Flow

1. User visits `/pricing` page
2. Selects subscription plan
3. Clicks PayPal button
4. Completes payment on PayPal
5. Returns to site with active subscription
6. Backend receives webhook
7. User gains access to premium features

---

**Status:** Documentation complete. Ready for implementation when you're ready to activate subscriptions.
