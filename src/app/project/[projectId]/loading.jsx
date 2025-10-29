import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-muted/50 p-4 md:p-6">
      <div className="min-h-[calc(100vh-2rem)] space-y-6 rounded-xl border bg-background p-4 md:min-h-[calc(100vh-3rem)] md:p-6">
        <div>
          <Skeleton className="h-8 w-44 rounded-md" />
        </div>

        <div className="space-y-2 text-center">
          <div className="mx-auto h-7 w-56 rounded-md">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="mx-auto h-4 w-40 rounded-md">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex gap-2 rounded-lg bg-muted p-1">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
