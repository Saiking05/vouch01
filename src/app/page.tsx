"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  BarChart3,
  Shield,
  Brain,
  TrendingUp,
  Users,
  FileText,
  Star,
  ChevronRight,
  Sparkles,
  Target,
  Eye,
  Gauge,
} from "lucide-react";
import VouchLogo from "@/components/vouch-logo";

const features = [
  {
    icon: Eye,
    title: "Fake Engagement Heatmap",
    description: "Visual timeline showing when followers were purchased vs. organic growth",
    color: "bg-neo-red",
  },
  {
    icon: Target,
    title: "Brand-Influencer Match",
    description: "AI-powered % score based on content history and brand niche alignment",
    color: "bg-neo-green",
  },
  {
    icon: Gauge,
    title: "Predictive ROI Calculator",
    description: "Estimate rupee value of posts based on historical engagement quality",
    color: "bg-neo-blue",
  },
  {
    icon: Brain,
    title: "Sentiment Deep-Dive",
    description: "Go beyond positive/negative — discover common themes in comments",
    color: "bg-neo-purple",
  },
  {
    icon: Shield,
    title: "Risk Level Guardrails",
    description: "Flags for controversial content, high bot %, and competitor promotion",
    color: "bg-neo-orange",
  },
  {
    icon: FileText,
    title: "Decision Matrix PDF",
    description: "One-click downloadable report for marketing managers",
    color: "bg-neo-yellow",
  },
  {
    icon: Users,
    title: "Competitor Benchmarking",
    description: "Side-by-side comparison of Influencer A vs. Influencer B",
    color: "bg-neo-cyan",
  },
  {
    icon: Sparkles,
    title: "AI Brief Generator",
    description: "LLM-generated custom marketing briefs based on brand goals",
    color: "bg-neo-pink",
  },
  {
    icon: TrendingUp,
    title: "Trend Tracking",
    description: "Real-time monitoring of who's trending or fading in their niche",
    color: "bg-neo-lime",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive dashboard with all metrics in one beautiful interface",
    color: "bg-neo-lavender",
  },
];

const stats = [
  { label: "Influencers Analyzed", value: "2.4M+" },
  { label: "Brands Trust Us", value: "12K+" },
  { label: "Fake Accounts Detected", value: "890K+" },
  { label: "ROI Improvement", value: "340%" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neo-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-neo-white/80 backdrop-blur-md border-b-3 border-neo-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <VouchLogo size={48} className="neo-shadow-sm" />
            <span className="text-2xl font-black tracking-tighter uppercase">Vouch</span>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/login"
              className="neo-btn bg-neo-white px-5 py-2.5 rounded-xl text-sm font-bold border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="neo-btn bg-neo-pink text-white px-5 py-2.5 rounded-xl text-sm font-bold border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Sign Up Free
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 px-6">
        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-neo-yellow neo-border rounded-2xl opacity-50 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-40 right-16 w-16 h-16 bg-neo-pink neo-border rounded-full opacity-50 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 w-14 h-14 bg-neo-blue neo-border rounded-xl opacity-40 hidden lg:block"
        />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 neo-badge bg-neo-purple text-neo-white px-4 py-2 rounded-xl mb-8">
              <Sparkles size={14} />
              <span>AI-Powered Influencer Intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
          >
            Know who to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">hire</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-2 left-0 h-4 bg-neo-yellow -z-0 -rotate-1"
              />
            </span>
            .
            <br />
            <span className="text-neo-pink">Before</span> you spend{" "}
            <span className="relative inline-block">
              <span className="relative z-10">a dime</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute bottom-2 left-0 h-4 bg-neo-blue -z-0 rotate-1"
              />
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-neo-black/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Vouch uses AI to analyze engagement quality, detect fake followers,
            predict ROI, and give you a clear <strong>Hire / Don&apos;t Hire</strong> signal
            for every influencer.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="neo-btn bg-neo-black text-neo-white px-10 py-5 rounded-2xl text-xl font-bold border-3 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3"
            >
              <Zap size={24} className="text-neo-yellow" />
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y-3 border-neo-black bg-neo-black py-4 overflow-hidden">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-8">
              {[
                "FAKE ENGAGEMENT DETECTION",
                "★",
                "SENTIMENT ANALYSIS",
                "★",
                "ROI PREDICTION",
                "★",
                "BRAND SAFETY",
                "★",
                "COMPETITOR BENCHMARKING",
                "★",
                "AI BRIEF GENERATOR",
                "★",
                "TREND TRACKING",
                "★",
              ].map((text, i) => (
                <span
                  key={i}
                  className={`text-sm font-bold tracking-wider ${text === "★" ? "text-neo-pink" : "text-neo-white"
                    }`}
                >
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="neo-card rounded-2xl p-6 text-center bg-neo-white"
            >
              <p className="text-3xl md:text-4xl font-bold text-neo-black">{stat.value}</p>
              <p className="text-xs font-bold text-neo-black/40 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-neo-black/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="neo-badge bg-neo-pink text-neo-white px-4 py-2 rounded-xl mb-4 inline-block">
              10 KILLER FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Everything you need.
              <br />
              <span className="text-neo-pink">Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 40, opacity: 0, rotate: -2 }}
                whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", bounce: 0.3 }}
                whileHover={{ y: -6, rotate: 1 }}
                className="neo-card rounded-2xl p-6"
              >
                <div className={`w-12 h-12 ${feature.color} neo-border rounded-xl flex items-center justify-center mb-4 neo-shadow-sm`}>
                  <feature.icon size={22} className="text-neo-black" />
                </div>
                <h3 className="text-lg font-bold text-neo-black mb-2">{feature.title}</h3>
                <p className="text-sm text-neo-black/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto neo-card rounded-3xl p-12 bg-neo-gradient-bg text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-neo-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neo-white/10 rounded-full" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Star size={48} className="text-neo-black" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-neo-black mb-4">
              Ready to find your perfect influencer?
            </h2>
            <p className="text-lg text-neo-black/60 mb-8 max-w-xl mx-auto">
              Join 12,000+ brands making smarter influencer decisions with AI.
            </p>
            <Link
              href="/signup"
              className="neo-btn bg-neo-black text-neo-white px-10 py-4 rounded-2xl text-lg inline-flex items-center gap-2"
            >
              <Zap size={20} />
              Start Free — No Card Required
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-neo-black py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VouchLogo size={40} className="neo-shadow-sm" />
            <span className="font-black text-xl tracking-tighter uppercase">Vouch</span>
          </div>
          <p className="text-sm text-neo-black/40 font-bold">
            © 2026 Vouch. Data, Validated.
          </p>
        </div>
      </footer>
    </div>
  );
}
