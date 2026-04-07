"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: "sm" | "md";
}

export function StarRating({ rating, onRate, size = "sm" }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate?.(star)}
          disabled={!onRate}
          className={`${onRate ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} focus:outline-none`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={`${iconSize} ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
