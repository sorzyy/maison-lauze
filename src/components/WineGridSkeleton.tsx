import { WineCardSkeleton } from "./WineCardSkeleton";
import { cn } from "@/lib/utils";

interface WineGridSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Grid de skeletons pour la section "Nos coups de cœur"
 * Responsive: 2 cols mobile, 4 cols desktop
 * Défilement horizontal sur mobile, grid sur desktop
 */
export function WineGridSkeleton({ 
  count = 4,
  className 
}: WineGridSkeletonProps) {
  return (
    <div
      className={cn(
        // Mobile: scroll horizontal avec snap
        "flex gap-5 overflow-x-auto pb-4",
        // Desktop: grid responsive
        "md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible",
        className
      )}
      style={{
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="scroll-snap-start"
          style={{ scrollSnapAlign: "start" }}
        >
          <WineCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export default WineGridSkeleton;
