export function PostieLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-label="Postie logo"
    >
      <rect width="40" height="40" rx="10" fill="hsl(var(--primary))" />
      <path
        d="M12 28V12h6c3.3 0 6 2.7 6 6s-2.7 6-6 6h-2"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="28" cy="27" r="3" fill="white" opacity="0.8" />
    </svg>
  );
}

export function PostieLogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <PostieLogo />
      <span className="text-lg font-semibold tracking-tight">Postie</span>
    </div>
  );
}
