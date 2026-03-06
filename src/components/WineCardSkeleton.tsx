import { cn } from "@/lib/utils";

interface WineCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton pour une carte de vin individuelle
 * Structure: image placeholder, titre, sous-titre, prix, badge
 * Animation shimmer avec gradient qui se déplace
 */
export function WineCardSkeleton({ className }: WineCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-64 rounded-2xl overflow-hidden",
        "bg-white/[0.03] border border-white/[0.07]",
        className
      )}
    >
      {/* Image placeholder avec shimmer */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-white/10">
          {/* Shimmer animation */}
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        
        {/* Badge placeholder */}
        <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-white/10" />
        
        {/* Type badge placeholder */}
        <div className="absolute top-3 right-3 w-14 h-5 rounded-md bg-white/10" />
      </div>

      {/* Info section */}
      <div className="p-5 space-y-3">
        {/* Millésime placeholder */}
        <div className="h-3 bg-white/10 rounded w-3/4" />
        
        {/* Region placeholder */}
        <div className="h-3 bg-white/10 rounded w-1/2" />
        
        {/* Name placeholder */}
        <div className="h-5 bg-white/10 rounded w-5/6" />
        
        {/* Cuvée placeholder */}
        <div className="h-3 bg-white/10 rounded w-2/3" />
        
        {/* Grapes placeholder */}
        <div className="h-2 bg-white/10 rounded w-4/5" />
        
        {/* Price and button row */}
        <div className="flex items-center justify-between pt-2">
          {/* Price placeholder */}
          <div className="h-6 bg-white/10 rounded w-16" />
          
          {/* Button placeholder */}
          <div className="w-9 h-9 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default WineCardSkeleton;
