import { Skeleton } from "@/components/ui/skeleton";

export function MortuaryCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function MortuaryListSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading mortuaries">
      <MortuaryCardSkeleton />
      <MortuaryCardSkeleton />
      <MortuaryCardSkeleton />
    </div>
  );
}
