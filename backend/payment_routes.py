"""
Payment Routes for DowUrk AI
Implements Stripe checkout for subscription tiers
"""
from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime, timezone
import os
import logging

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionResponse, 
    CheckoutStatusResponse, CheckoutSessionRequest
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/payments", tags=["payments"])

# Global database reference
db = None

def set_database(database):
    """Set the database instance for this router"""
    global db
    db = database

# ========================================
# SUBSCRIPTION PACKAGES (SERVER-SIDE ONLY)
# ========================================
SUBSCRIPTION_PACKAGES = {
    "free": {
        "name": "Free",
        "price": 0.0,
        "currency": "usd",
        "features": ["AI Business Assistant (Limited)", "Basic Metrics Dashboard", "Strategic Resources Access"]
    },
    "professional": {
        "name": "Professional",
        "price": 29.99,
        "currency": "usd",
        "features": ["Unlimited AI Conversations", "Advanced Analytics", "Priority Support", "Custom AI Training"]
    },
    "business": {
        "name": "Business",
        "price": 99.99,
        "currency": "usd",
        "features": ["Everything in Professional", "Team Collaboration (up to 10 users)", "API Access", "White-label Options"]
    },
    "enterprise": {
        "name": "Enterprise",
        "price": 299.99,
        "currency": "usd",
        "features": ["Everything in Business", "Unlimited Team Members", "Dedicated Account Manager", "Custom Integrations", "SLA Guarantee"]
    }
}

# ========================================
# MODELS
# ========================================

class CheckoutRequest(BaseModel):
    """Request to create a checkout session"""
    package_id: str = Field(..., description="Subscription package ID (professional, business, enterprise)")
    origin_url: str = Field(..., description="Frontend origin URL for redirect")
    user_email: Optional[str] = None

class PaymentTransaction(BaseModel):
    """Payment transaction record"""
    transaction_id: str
    session_id: str
    user_email: Optional[str]
    package_id: str
    amount: float
    currency: str
    payment_status: str  # initiated, paid, failed, expired
    status: str  # open, complete, expired
    metadata: Dict[str, str]
    created_at: datetime
    updated_at: datetime

# ========================================
# ROUTES
# ========================================

@router.get("/packages")
async def get_subscription_packages():
    """Get available subscription packages"""
    return {"packages": SUBSCRIPTION_PACKAGES}

@router.post("/checkout/session", response_model=CheckoutSessionResponse)
async def create_checkout_session(checkout_req: CheckoutRequest, request: Request):
    """Create a Stripe checkout session for subscription"""
    
    try:
        # Validate package
        if checkout_req.package_id not in SUBSCRIPTION_PACKAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid package ID. Must be one of: {list(SUBSCRIPTION_PACKAGES.keys())}"
            )
        
        # Get package details (SERVER-SIDE ONLY - never trust frontend)
        package = SUBSCRIPTION_PACKAGES[checkout_req.package_id]
        amount = package["price"]
        currency = package["currency"]
        
        if amount == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Free tier does not require payment"
            )
        
        # Get Stripe API key
        api_key = os.environ.get('STRIPE_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment service not configured"
            )
        
        # Initialize Stripe checkout
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        # Build success and cancel URLs from frontend origin
        success_url = f"{checkout_req.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{checkout_req.origin_url}/payment/cancel"
        
        # Prepare metadata
        metadata = {
            "package_id": checkout_req.package_id,
            "package_name": package["name"],
            "source": "web_checkout"
        }
        if checkout_req.user_email:
            metadata["user_email"] = checkout_req.user_email
        
        # Create checkout session request
        session_request = CheckoutSessionRequest(
            amount=amount,
            currency=currency,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        # Create Stripe checkout session
        session = await stripe_checkout.create_checkout_session(session_request)
        
        # Create payment transaction record BEFORE redirecting
        transaction_doc = {
            "transaction_id": f"txn_{session.session_id}",
            "session_id": session.session_id,
            "user_email": checkout_req.user_email,
            "package_id": checkout_req.package_id,
            "amount": amount,
            "currency": currency,
            "payment_status": "initiated",
            "status": "open",
            "metadata": metadata,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payment_transactions.insert_one(transaction_doc)
        logger.info(f"Payment transaction created: {transaction_doc['transaction_id']}")
        
        return session
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )

@router.get("/checkout/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_checkout_status(session_id: str, request: Request):
    """Get the status of a checkout session and update database"""
    
    try:
        # Get Stripe API key
        api_key = os.environ.get('STRIPE_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment service not configured"
            )
        
        # Initialize Stripe checkout
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        # Get checkout status from Stripe
        checkout_status = await stripe_checkout.get_checkout_status(session_id)
        
        # Find transaction in database
        transaction = await db.payment_transactions.find_one(
            {"session_id": session_id},
            {"_id": 0}
        )
        
        if not transaction:
            logger.warning(f"Transaction not found for session: {session_id}")
            return checkout_status
        
        # Check if payment already processed (prevent duplicate processing)
        if transaction.get('payment_status') == 'paid' and checkout_status.payment_status == 'paid':
            logger.info(f"Payment already processed for session: {session_id}")
            return checkout_status
        
        # Update transaction with new status
        update_data = {
            "payment_status": checkout_status.payment_status,
            "status": checkout_status.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        # If payment is successful, update user subscription
        if checkout_status.payment_status == 'paid' and transaction.get('payment_status') != 'paid':
            await _process_successful_payment(transaction, checkout_status)
            logger.info(f"Payment processed successfully for session: {session_id}")
        
        return checkout_status
        
    except Exception as e:
        logger.error(f"Error getting checkout status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get checkout status: {str(e)}"
        )

async def _process_successful_payment(transaction: dict, checkout_status: CheckoutStatusResponse):
    """Process successful payment and update user subscription"""
    
    try:
        user_email = transaction.get('user_email')
        package_id = transaction.get('package_id')
        
        if not user_email:
            logger.warning(f"No user email for transaction: {transaction['transaction_id']}")
            return
        
        # Update user's subscription
        user = await db.users.find_one({"email": user_email})
        if user:
            await db.users.update_one(
                {"email": user_email},
                {
                    "$set": {
                        "role": package_id,
                        "subscription_status": "active",
                        "subscription_updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            logger.info(f"User subscription updated: {user_email} -> {package_id}")
        else:
            logger.warning(f"User not found for email: {user_email}")
        
    except Exception as e:
        logger.error(f"Error processing successful payment: {str(e)}")

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    
    try:
        # Get raw body and signature
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Stripe signature"
            )
        
        # Get Stripe API key
        api_key = os.environ.get('STRIPE_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment service not configured"
            )
        
        # Initialize Stripe checkout
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        logger.info(f"Webhook received: {webhook_response.event_type} for session {webhook_response.session_id}")
        
        # Update transaction based on webhook event
        if webhook_response.payment_status == 'paid':
            transaction = await db.payment_transactions.find_one(
                {"session_id": webhook_response.session_id},
                {"_id": 0}
            )
            
            if transaction and transaction.get('payment_status') != 'paid':
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {
                        "$set": {
                            "payment_status": webhook_response.payment_status,
                            "status": "complete",
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
                
                # Process payment
                status_response = CheckoutStatusResponse(
                    status="complete",
                    payment_status=webhook_response.payment_status,
                    amount_total=0,
                    currency="usd",
                    metadata=webhook_response.metadata
                )
                await _process_successful_payment(transaction, status_response)
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Error handling webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Webhook processing failed: {str(e)}"
        )
