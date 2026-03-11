"use client";

import { useState } from "react";

/**
 * Proxied avatar that routes Instagram CDN images through
 * our own /api/image-proxy endpoint to bypass anti-hotlinking.
 * YouTube/other images load directly.
 */
export default function AvatarImg({
    src,
    name,
    handle,
    platform,
    size = 48,
    rounded = "rounded-xl",
}: {
    src: string;
    name: string;
    handle?: string;
    platform?: string;
    size?: number;
    rounded?: string;
}) {
    const [imageError, setImageError] = useState(false);
    const [fallbackError, setFallbackError] = useState(false);
    const px = `${size}px`;
    const textSize = size >= 96 ? "text-3xl" : size >= 64 ? "text-xl" : "text-base";

    // Determine the actual image URL to use
    const imgUrl = getProxiedUrl(src);

    const cleanHandle = handle?.replace("@", "") || "";
    const showFallbackUrl = imageError && cleanHandle && platform === "instagram" && !fallbackError;
    const fallbackUrl = `https://unavatar.io/instagram/${cleanHandle}`;

    if (!src || (imageError && (!showFallbackUrl || fallbackError))) {
        return (
            <div
                style={{ width: px, height: px }}
                className={`${rounded} neo-border bg-gradient-to-br from-[var(--color-neo-pink)] to-[var(--color-neo-purple)] flex items-center justify-center text-white font-bold flex-shrink-0 ${textSize}`}
            >
                {name?.[0]?.toUpperCase() || "?"}
            </div>
        );
    }

    if (showFallbackUrl) {
        return (
            <img
                src={fallbackUrl}
                alt={name}
                style={{ width: px, height: px }}
                className={`${rounded} neo-border object-cover flex-shrink-0`}
                referrerPolicy="no-referrer"
                onError={() => setFallbackError(true)}
            />
        );
    }

    return (
        <img
            src={imgUrl}
            alt={name}
            style={{ width: px, height: px }}
            className={`${rounded} neo-border object-cover flex-shrink-0`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
        />
    );
}

/** Proxy Instagram/Facebook CDN URLs through our server. YouTube etc. load fine directly. */
function getProxiedUrl(url: string): string {
    if (!url) return "";
    // Instagram & Facebook CDN URLs need proxying
    if (
        url.includes("cdninstagram.com") ||
        url.includes("fbcdn.net") ||
        url.includes("instagram.com")
    ) {
        return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
    // YouTube, Google, and other URLs work directly
    return url;
}
