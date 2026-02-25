export default function VouchLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* The "V" Stamped Block */}
            <rect x="2" y="2" width="36" height="36" rx="4" fill="var(--color-neo-black)" />

            {/* The Stylized "V" with a sharp cut */}
            <path
                d="M10 12L20 28L30 12"
                stroke="#EFFF00"
                strokeWidth="6"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />

            {/* The "Verified" Dash */}
            <path
                d="M26 24L34 24"
                stroke="#EFFF00"
                strokeWidth="3"
                strokeLinecap="square"
            />
        </svg>
    );
}
