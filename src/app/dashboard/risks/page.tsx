"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, AlertOctagon, CheckCircle2, User, Search, Loader, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllRiskFlags, type RiskFlag } from "@/lib/api-client";
import Link from "next/link";

interface RiskFlagWithInfluencer extends RiskFlag {
    id: string;
    influencer_id: string;
    influencers: {
        id: string;
        name: string;
        handle: string;
        platform: string;
        avatar_url: string;
    }
}

export default function RisksPage() {
    const [risks, setRisks] = useState<RiskFlagWithInfluencer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadRisks();
    }, []);

    const loadRisks = async () => {
        setLoading(true);
        try {
            const data = await getAllRiskFlags();
            setRisks(data as RiskFlagWithInfluencer[]);
        } catch (err) {
            console.error("Failed to load risk flags", err);
        }
        setLoading(false);
    };

    const filteredRisks = risks.filter(risk =>
        risk.influencers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.influencers?.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.type.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        const priority = { critical: 0, high: 1, medium: 2, low: 3 };
        return (priority[a.severity as keyof typeof priority] || 0) - (priority[b.severity as keyof typeof priority] || 0);
    });

    const getSeverityStyles = (severity: string) => {
        switch (severity.toLowerCase()) {
            case "critical": return "bg-neo-red/10 text-neo-red border-neo-red/20";
            case "high": return "bg-neo-orange/10 text-neo-orange border-neo-orange/20";
            case "medium": return "bg-neo-yellow/10 text-amber-600 border-neo-yellow/20";
            default: return "bg-neo-green/10 text-neo-green border-neo-green/20";
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity.toLowerCase()) {
            case "critical": return <AlertOctagon size={16} />;
            case "high": return <AlertTriangle size={16} />;
            case "medium": return <Shield size={16} />;
            default: return <CheckCircle2 size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-2xl font-bold text-neo-black">Risk Monitor</h1>
                <p className="text-sm text-neo-black/40 font-semibold">REAL-TIME BRAND SAFETY ENGINE</p>
            </motion.div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-black/30" size={18} />
                    <input
                        type="text"
                        placeholder="Filter by influencer or risk type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="neo-input w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="neo-badge bg-neo-red/10 text-neo-red px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2">
                        <AlertOctagon size={14} /> {risks.filter(r => r.severity === 'critical').length} Critical
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-neo-red" size={32} />
                </div>
            ) : filteredRisks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredRisks.map((risk, i) => (
                        <motion.div
                            key={risk.id || i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="neo-card rounded-2xl p-5 bg-neo-white hover:bg-neo-black/2 transition-colors border-l-8 border-l-transparent"
                            style={{ borderLeftColor: risk.severity === 'critical' ? '#FF4141' : (risk.severity === 'high' ? '#FFAC33' : '#F4D03F') }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Influencer Info */}
                                <div className="flex items-center gap-3 w-full md:w-64">
                                    <div className="w-10 h-10 bg-neo-pink neo-border rounded-xl flex items-center justify-center overflow-hidden">
                                        {risk.influencers?.avatar_url ? (
                                            <img src={risk.influencers.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{risk.influencers?.name || "Unknown"}</p>
                                        <p className="text-[10px] text-neo-black/40 font-mono">@{risk.influencers?.handle || "system"}</p>
                                    </div>
                                </div>

                                {/* Risk Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase flex items-center gap-1 ${getSeverityStyles(risk.severity)}`}>
                                            {getSeverityIcon(risk.severity)}
                                            {risk.severity}
                                        </div>
                                        <span className="text-[10px] font-bold text-neo-black uppercase tracking-wider">{risk.type}</span>
                                    </div>
                                    <p className="text-xs text-neo-black/70 leading-relaxed font-medium">
                                        {risk.description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                    <Link
                                        href={`/dashboard/influencers/${risk.influencer_id}`}
                                        className="neo-btn bg-neo-black text-neo-white px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1"
                                    >
                                        View Detail <ExternalLink size={12} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="neo-card rounded-2xl p-12 text-center bg-neo-white">
                    <Shield size={48} className="mx-auto mb-4 text-neo-green/20" />
                    <h3 className="text-lg font-bold text-neo-black">Safe Zone</h3>
                    <p className="text-sm text-neo-black/40">No critical risks detected across your tracked influencers.</p>
                </div>
            )}
        </div>
    );
}
