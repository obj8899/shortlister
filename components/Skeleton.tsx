export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-[var(--surface-soft)] ${className}`} />;
}
