import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
