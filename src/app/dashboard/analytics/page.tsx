"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BarChart3, Users, TrendingUp, DollarSign, Loader } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { getAllInfluencers, formatNumber, type InfluencerProfile } from "@/lib/api-client";

const COLORS = ["#FF6B9D", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF6B6B", "#8BDAA7"];

export default function AnalyticsPage() {
    const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getAllInfluencers(50);
            setInfluencers(data.results);
        } catch {
            // Backend not running
        }
        setLoading(false);
    };

    // Calculate platform distribution from real data
    const platformData = Object.entries(
        influencers.reduce((acc, inf) => {
            acc[inf.platform] = (acc[inf.platform] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([platform, count]) => ({ platform, count }));

    // Risk distribution
    const riskData = Object.entries(
        influencers.reduce((acc, inf) => {
            acc[inf.risk_level] = (acc[inf.risk_level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([level, count]) => ({ level, count }));

    // Niche distribution
    const nicheData = Object.entries(
        influencers.reduce((acc, inf) => {
            (inf.niche || []).forEach((n) => { acc[n] = (acc[n] || 0) + 1; });
            return acc;
        }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([niche, count]) => ({ niche, count }));

    // Stats
    const totalFollowers = influencers.reduce((a, b) => a + b.followers, 0);
    const avgEngagement = influencers.length > 0
        ? (influencers.reduce((a, b) => a + b.engagement_rate, 0) / influencers.length).toFixed(1)
        : "0";
    const avgMatch = influencers.length > 0
        ? Math.round(influencers.reduce((a, b) => a + b.match_score, 0) / influencers.length)
        : 0;

    return (
        <div className="space-y-6">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-2xl font-bold text-[var(--color-neo-black)]">Analytics Overview</h1>
                <p className="text-sm text-[var(--color-neo-black)]/40 font-semibold">REAL DATA FROM YOUR DATABASE</p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-[var(--color-neo-pink)]" size={32} />
                </div>
            ) : (
                <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Influencers", value: influencers.length, icon: Users, color: "bg-[var(--color-neo-pink)]" },
                            { label: "Total Reach", value: formatNumber(totalFollowers), icon: TrendingUp, color: "bg-[var(--color-neo-blue)]" },
                            { label: "Avg Engagement", value: `${avgEngagement}%`, icon: BarChart3, color: "bg-[var(--color-neo-yellow)]" },
                            { label: "Avg Match Score", value: `${avgMatch}%`, icon: DollarSign, color: "bg-[var(--color-neo-purple)]" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="neo-card rounded-2xl p-5 bg-[var(--color-neo-white)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 ${stat.color} rounded-xl neo-border`}>
                                        <stat.icon size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">{stat.label}</p>
                                        <p className="text-xl font-bold text-[var(--color-neo-black)]">{stat.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Niche Distribution */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="neo-card rounded-2xl p-6 bg-[var(--color-neo-white)]"
                        >
                            <h3 className="text-lg font-bold text-[var(--color-neo-black)] mb-4">Niche Distribution</h3>
                            {nicheData.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={nicheData}>
                                            <XAxis dataKey="niche" tick={{ fontSize: 11, fontWeight: 600 }} />
                                            <YAxis tick={{ fontSize: 11 }} />
                                            <Tooltip />
                                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                                {nicheData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1a1a2e" strokeWidth={2} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--color-neo-black)]/40 text-center py-12">No data yet</p>
                            )}
                        </motion.div>

                        {/* Platform Distribution */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="neo-card rounded-2xl p-6 bg-[var(--color-neo-white)]"
                        >
                            <h3 className="text-lg font-bold text-[var(--color-neo-black)] mb-4">Platform Breakdown</h3>
                            {platformData.length > 0 ? (
                                <div className="h-64 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={platformData}
                                                dataKey="count"
                                                nameKey="platform"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                strokeWidth={3}
                                                stroke="#1a1a2e"
                                            >
                                                {platformData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--color-neo-black)]/40 text-center py-12">No data yet</p>
                            )}
                        </motion.div>
                    </div>

                    {/* Leaderboard */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="neo-card rounded-2xl overflow-hidden bg-[var(--color-neo-white)]"
                    >
                        <div className="p-4 border-b-3 border-[var(--color-neo-black)]">
                            <h3 className="text-lg font-bold text-[var(--color-neo-black)]">Influencer Leaderboard</h3>
                            <p className="text-xs text-[var(--color-neo-black)]/40 font-semibold">RANKED BY MATCH SCORE</p>
                        </div>
                        {influencers.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[var(--color-neo-black)]/5">
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">#</th>
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">Name</th>
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">Platform</th>
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">Followers</th>
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">Eng.</th>
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">Match</th>
                                        <th className="text-left p-3 text-[10px] font-bold uppercase text-[var(--color-neo-black)]/40">Risk</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {influencers.slice(0, 10).map((inf, i) => (
                                        <tr key={inf.id} className="border-t border-[var(--color-neo-black)]/5 hover:bg-[var(--color-neo-black)]/3">
                                            <td className="p-3 font-bold text-sm text-[var(--color-neo-black)]/20">{i + 1}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {inf.avatar_url ? (
                                                        <img src={inf.avatar_url} className="w-7 h-7 rounded-lg neo-border object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-lg bg-[var(--color-neo-pink)] flex items-center justify-center text-white text-xs font-bold neo-border">
                                                            {inf.name[0]}
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-sm">{inf.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-xs font-bold uppercase text-[var(--color-neo-black)]/40">{inf.platform}</td>
                                            <td className="p-3 text-sm font-bold">{formatNumber(inf.followers)}</td>
                                            <td className="p-3 text-sm font-bold">{inf.engagement_rate}%</td>
                                            <td className="p-3">
                                                <span className={`neo-badge px-2 py-0.5 rounded text-xs font-bold ${inf.match_score >= 85 ? "bg-[var(--color-neo-green)]" : inf.match_score >= 70 ? "bg-[var(--color-neo-yellow)]" : "bg-[var(--color-neo-red)]"
                                                    }`}>
                                                    {inf.match_score}%
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`neo-badge px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inf.risk_level === "low" ? "bg-[var(--color-neo-green)]" : inf.risk_level === "medium" ? "bg-[var(--color-neo-yellow)]" : "bg-[var(--color-neo-red)]"
                                                    }`}>
                                                    {inf.risk_level}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-sm text-[var(--color-neo-black)]/40 font-bold uppercase tracking-tight">
                                No influencers audited yet. Use the search tools to start your first verification.
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </div>
    );
}
