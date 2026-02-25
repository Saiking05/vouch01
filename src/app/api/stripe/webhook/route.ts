import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.user_id;
        const customerId = session.customer as string;

        if (userId) {
            const supabase = await createClient();

            // Determine plan from line items
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const priceId = lineItems.data[0]?.price?.id || "";

            let plan = "free";
            let searchesLimit = 3;

            if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
                plan = "pro";
                searchesLimit = 50;
            } else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
                plan = "agency";
                searchesLimit = 999999;
            }

            await supabase
                .from("user_profiles")
                .update({
                    plan,
                    searches_limit: searchesLimit,
                    stripe_customer_id: customerId,
                    searches_used: 0,
                })
                .eq("id", userId);
        }
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const supabase = await createClient();
        await supabase
            .from("user_profiles")
            .update({ plan: "free", searches_limit: 3 })
            .eq("stripe_customer_id", customerId);
    }

    return NextResponse.json({ received: true });
}
