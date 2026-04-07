"use client";

import { StarRating } from "./star-rating";
import { User } from "lucide-react";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No reviews yet. Be the first to share your experience.</p>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <StarRating rating={Math.round(avgRating)} />
        <span className="text-sm font-semibold text-gray-900">
          {avgRating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B4965]/10 text-[#1B4965]">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-gray-900">{review.reviewer_name}</span>
              </div>
              <StarRating rating={review.rating} />
            </div>
            {review.comment && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.created_at).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
