"use client";

import { motion } from "framer-motion";
import { type SentimentData } from "@/lib/api-client";
import { MessageCircle, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface SentimentPanelProps {
    data: SentimentData;
}

export default function SentimentPanel({ data }: SentimentPanelProps) {
    const sentimentConfig = {
        positive: { icon: ThumbsUp, color: "bg-neo-green", textColor: "text-green-700" },
        negative: { icon: ThumbsDown, color: "bg-neo-red", textColor: "text-red-700" },
        neutral: { icon: Minus, color: "bg-neo-yellow", textColor: "text-yellow-700" },
    };

    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="neo-card rounded-2xl p-6 bg-neo-white"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-neo-purple neo-border rounded-lg">
                    <MessageCircle size={18} className="text-neo-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-neo-black">Comment Sentiment</h3>
                    <p className="text-xs text-neo-black/40 font-semibold">DEEP-DIVE ANALYSIS</p>
                </div>
            </div>

            {/* Sentiment Bar */}
            <div className="mb-6">
                <div className="flex rounded-xl neo-border overflow-hidden h-10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.positive}%` }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        className="bg-neo-green flex items-center justify-center"
                    >
                        <span className="text-xs font-bold text-neo-black">{data.positive}%</span>
                    </motion.div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.neutral}%` }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                        className="bg-neo-yellow flex items-center justify-center border-x-2 border-neo-black"
                    >
                        <span className="text-xs font-bold text-neo-black">{data.neutral}%</span>
                    </motion.div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.negative}%` }}
                        transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                        className="bg-neo-red flex items-center justify-center"
                    >
                        <span className="text-xs font-bold text-neo-white">{data.negative}%</span>
                    </motion.div>
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-green-600 uppercase">Positive</span>
                    <span className="text-[10px] font-bold text-yellow-600 uppercase">Neutral</span>
                    <span className="text-[10px] font-bold text-red-600 uppercase">Negative</span>
                </div>
            </div>

            {/* Common Themes */}
            <div>
                <h4 className="text-sm font-bold text-neo-black mb-3 uppercase tracking-wider">
                    Common Themes
                </h4>
                <div className="space-y-2">
                    {data.themes.map((theme, i) => {
                        const config = sentimentConfig[theme.sentiment as keyof typeof sentimentConfig];
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className={`flex items-center gap-3 p-3 rounded-xl ${config.color}/20 border-2 border-neo-black/10`}
                            >
                                <Icon size={14} className={config.textColor} />
                                <span className="text-sm font-medium text-neo-black flex-1 truncate">
                                    &ldquo;{theme.label}&rdquo;
                                </span>
                                <span className="neo-badge bg-neo-white px-2 py-0.5 rounded-md text-[10px]">
                                    {theme.count} mentions
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
