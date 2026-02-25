export default function AuraLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* The "Aura" Ring - A vibrant, flowing gradient circle */}
            <circle cx="20" cy="20" r="18" stroke="url(#aura_gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />

            {/* The Stylized "A" */}
            <path
                d="M12 28L20 8L28 28"
                stroke="var(--color-neo-black)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 22H24"
                stroke="var(--color-neo-pink)"
                strokeWidth="4"
                strokeLinecap="round"
            />

            <defs>
                <linearGradient id="aura_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF3366" /> {/* Neo Pink */}
                    <stop offset="0.5" stopColor="#A855F7" /> {/* Neo Purple */}
                    <stop offset="1" stopColor="#0EA5E9" /> {/* Neo Cyan */}
                </linearGradient>
            </defs>
        </svg>
    );
}
