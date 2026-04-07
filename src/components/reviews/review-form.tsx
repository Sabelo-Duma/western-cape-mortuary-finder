"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import { Check, Loader2, MessageSquarePlus } from "lucide-react";

interface ReviewFormProps {
  mortuaryId: string;
  mortuaryName: string;
}

export function ReviewForm({ mortuaryId, mortuaryName }: ReviewFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !phone.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mortuary_id: mortuaryId,
          reviewer_name: name.trim(),
          reviewer_phone: phone.trim(),
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to submit review");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-green-800">Thank you for your review!</p>
        <p className="text-xs text-green-600 mt-1">
          Your review will appear once it has been approved.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 text-sm font-medium text-[#1B4965] hover:text-[#143A50] transition-colors"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Write a Review
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-900">Rate {mortuaryName}</h3>
        <div className="flex justify-center mt-2">
          <StarRating rating={rating} onRate={setRating} size="md" />
        </div>
        {rating === 0 && (
          <p className="text-xs text-red-500 mt-1">Please select a rating</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+27..."
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Your Experience (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this mortuary..."
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965] resize-vertical"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          className="bg-[#1B4965] hover:bg-[#143A50]"
          disabled={submitting || rating === 0 || !name.trim() || !phone.trim()}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
