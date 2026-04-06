"""
Stripe service — handles payments and subscription management
"""
import os
import stripe
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


async def create_checkout_session(
    user_id: str,
    user_email: str,
    price_id: str,
    success_url: str | None = None,
    cancel_url: str | None = None,
) -> dict:
    """Create a Stripe checkout session for subscription"""
    base_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    if not success_url:
        success_url = f"{base_url}/dashboard/billing?success=true"
    if not cancel_url:
        cancel_url = f"{base_url}/dashboard/billing?canceled=true"
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=success_url,
        cancel_url=cancel_url,
        client_reference_id=user_id,
        customer_email=user_email,
        metadata={"user_id": user_id},
    )
    return {"checkout_url": session.url, "session_id": session.id}


async def create_portal_session(customer_id: str) -> dict:
    """Create a Stripe customer portal session for managing subscription"""
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url="http://localhost:3000/dashboard/billing",
    )
    return {"portal_url": session.url}


async def handle_webhook(payload: bytes, sig_header: str) -> dict:
    """Process Stripe webhook events"""
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.error.SignatureVerificationError:
        raise ValueError("Invalid webhook signature")
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("client_reference_id") or session.get("metadata", {}).get("user_id")
        customer_id = session["customer"]
        
        # Determine plan from price
        line_items = stripe.checkout.Session.list_line_items(session["id"])
        price_id = line_items["data"][0]["price"]["id"] if line_items["data"] else ""
        
        pro_price = os.getenv("STRIPE_PRO_PRICE_ID", "")
        agency_price = os.getenv("STRIPE_AGENCY_PRICE_ID", "")
        
        plan = "free"
        searches_limit = 3
        if price_id == pro_price:
            plan = "pro"
            searches_limit = 50
        elif price_id == agency_price:
            plan = "agency"
            searches_limit = 999999  # unlimited
        
        return {
            "action": "upgrade",
            "user_id": user_id,
            "customer_id": customer_id,
            "plan": plan,
            "searches_limit": searches_limit,
        }
    
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        
        return {
            "action": "downgrade",
            "customer_id": customer_id,
            "plan": "free",
            "searches_limit": 3,
        }
    
    return {"action": "ignored", "type": event["type"]}


def get_plan_limits(plan: str) -> dict:
    """Get search limits for each plan tier"""
    limits = {
        "free": {"searches": 3, "reports": 1, "briefs": 1, "compare": True},
        "pro": {"searches": 50, "reports": 20, "briefs": 20, "compare": True},
        "agency": {"searches": 999999, "reports": 999999, "briefs": 999999, "compare": True},
    }
    return limits.get(plan, limits["free"])
