import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const { priceId, userId, userEmail } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
            client_reference_id: userId,
            customer_email: userEmail,
            metadata: { user_id: userId },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Checkout failed" },
            { status: 500 }
        );
    }
}
