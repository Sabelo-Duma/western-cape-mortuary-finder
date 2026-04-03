"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/v1/mortuaries/${slug}/track-view`, {
      method: "POST",
    }).catch(() => {
      // Non-blocking — silently fail
    });
  }, [slug]);

  return null;
}
