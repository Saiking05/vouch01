"use client";

import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import { CreditCard, Check, Zap, Star, Building2, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";

const pricingPlans = [
    {
        name: "Free",
        price: 0,
        annualPrice: 0,
        icon: Zap,
        features: ["3 influencer lookups/month", "Basic engagement metrics", "1 AI brief per month", "Community support"],
        color: "bg-[var(--color-neo-white)]",
        cta: "Current Plan",
        priceId: null,
    },
    {
        name: "Pro",
        price: 10,
        annualPrice: 8.33,
        icon: Star,
        features: [
            "50 influencer lookups/month",
            "Deep-dive engagement analysis",
            "Fake engagement detection",
            "Sentiment analysis",
            "20 AI briefs per month",
            "PDF report exports",
            "Priority support",
        ],
        color: "bg-[var(--color-neo-pink)]",
        cta: "Upgrade to Pro",
        popular: true,
        priceId: "pro",
    },
    {
        name: "Agency",
        price: 20,
        annualPrice: 12.5,
        icon: Building2,
        features: [
            "Unlimited influencer lookups",
            "Full risk monitoring dashboard",
            "Real-time trend tracking",
            "Unlimited AI briefs",
            "White-label PDF exports",
            "Team collaboration",
            "API access",
            "Dedicated account manager",
        ],
        color: "bg-[var(--color-neo-yellow)]",
        cta: "Upgrade to Agency",
        priceId: "agency",
    },
];

export default function BillingPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader className="animate-spin text-[var(--color-neo-pink)]" size={32} /></div>}>
            <BillingContent />
        </Suspense>
    );
}

function BillingContent() {
    const [annual, setAnnual] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    const handleCheckout = async (plan: typeof pricingPlans[0]) => {
        if (!plan.priceId) return;
        setLoadingPlan(plan.name);

        let finalPriceId = "";
        if (plan.priceId === "pro") {
            finalPriceId = annual
                ? process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID!
                : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!;
        } else if (plan.priceId === "agency") {
            finalPriceId = annual
                ? process.env.NEXT_PUBLIC_STRIPE_AGENCY_YEARLY_PRICE_ID!
                : process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!;
        }

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId: finalPriceId,
                    userId: "user-id", // will come from auth session
                    userEmail: "user@email.com",
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Checkout failed", err);
        }
        setLoadingPlan(null);
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-2xl font-bold text-[var(--color-neo-black)]">Billing & Subscription</h1>
                <p className="text-sm text-[var(--color-neo-black)]/40 font-semibold">
                    POWERED BY STRIPE • SECURE PAYMENTS
                </p>
            </motion.div>

            {/* Success / Cancel Alerts */}
            {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neo-card rounded-2xl p-4 bg-[var(--color-neo-green)]">
                    <p className="font-bold text-[var(--color-neo-black)]">🎉 Payment successful! Your plan has been upgraded.</p>
                </motion.div>
            )}
            {canceled && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neo-card rounded-2xl p-4 bg-[var(--color-neo-yellow)]">
                    <p className="font-bold text-[var(--color-neo-black)]">Payment was canceled. You can try again anytime.</p>
                </motion.div>
            )}

            {/* Current Plan */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="neo-card rounded-2xl p-6 bg-[var(--color-neo-yellow)]"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">CURRENT PLAN</p>
                        <p className="text-2xl font-bold text-[var(--color-neo-black)]">Free Plan</p>
                        <p className="text-sm text-[var(--color-neo-black)]/60 mt-1">2 of 3 searches used this month</p>
                    </div>
                    <CreditCard size={32} className="text-[var(--color-neo-black)]/20" />
                </div>
                <div className="mt-4">
                    <div className="w-full h-3 bg-[var(--color-neo-black)]/10 rounded-full neo-border overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "66%" }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="h-full bg-[var(--color-neo-red)] rounded-full"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-3">
                <span className={`text-sm font-bold ${!annual ? "text-[var(--color-neo-black)]" : "text-[var(--color-neo-black)]/30"}`}>
                    Monthly
                </span>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAnnual(!annual)}
                    className="w-14 h-8 neo-border rounded-full p-1 flex items-center bg-[var(--color-neo-white)]"
                >
                    <motion.div
                        animate={{ x: annual ? 24 : 0 }}
                        className="w-6 h-6 rounded-full bg-[var(--color-neo-pink)] neo-border"
                    />
                </motion.button>
                <span className={`text-sm font-bold ${annual ? "text-[var(--color-neo-black)]" : "text-[var(--color-neo-black)]/30"}`}>
                    Annual
                </span>
                {annual && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="neo-badge bg-[var(--color-neo-green)] text-[10px] px-2 py-0.5 rounded-lg font-bold"
                    >
                        SAVE UP TO 37%
                    </motion.span>
                )}
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ y: 30, opacity: 0, rotate: (i - 1) * 2 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                        whileHover={{ y: -8, rotate: (i - 1) * 0.5 }}
                        className={`neo-card rounded-2xl p-6 ${plan.color} relative ${plan.popular ? "ring-4 ring-[var(--color-neo-black)]" : ""}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 neo-badge bg-[var(--color-neo-black)] text-[var(--color-neo-white)] px-4 py-1 rounded-lg text-[10px] font-bold uppercase">
                                Most Popular
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-[var(--color-neo-black)] rounded-xl">
                                <plan.icon size={18} className="text-[var(--color-neo-white)]" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-neo-black)]">{plan.name}</h3>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[var(--color-neo-black)]">
                                ${annual ? plan.annualPrice : plan.price}
                            </span>
                            <span className="text-sm text-[var(--color-neo-black)]/50">/mo</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            {plan.features.map((feat) => (
                                <div key={feat} className="flex items-center gap-2">
                                    <Check size={14} className="text-green-600" />
                                    <span className="text-sm text-[var(--color-neo-black)]/80">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleCheckout(plan)}
                            disabled={!plan.priceId || loadingPlan === plan.name}
                            className={`neo-btn w-full py-3 rounded-xl text-sm font-semibold ${plan.priceId
                                ? "bg-[var(--color-neo-black)] text-[var(--color-neo-white)]"
                                : "bg-[var(--color-neo-black)]/10 text-[var(--color-neo-black)]/50 cursor-default"
                                }`}
                        >
                            {loadingPlan === plan.name ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader size={14} className="animate-spin" /> Processing...
                                </span>
                            ) : (
                                plan.cta
                            )}
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Stripe Badge */}
            <div className="text-center">
                <p className="text-xs text-[var(--color-neo-black)]/30 font-semibold">
                    Payments securely processed by Stripe • Cancel anytime
                </p>
            </div>
        </div>
    );
}
