// apps/storefront/components/store/product/ProductTabs.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, CornerDownRight, Loader2, ArrowRight } from "lucide-react";
import { submitReview } from "@/lib/actions/reviews";

interface ProductTabsProps {
  description: string;
  productId: string;
  brandName: string;
  brandDescription?: string;
  specifications?: Record<string, string>;
  reviews: any[];
  canReview: boolean;
  canReviewReason: string | null;
  onReviewSubmitted: () => void;
}

export default function ProductTabs({
  description,
  productId,
  brandName,
  brandDescription,
  specifications = {},
  reviews,
  canReview,
  canReviewReason,
  onReviewSubmitted,
}: ProductTabsProps) {
  const tabs = ["Description", "Specifications", "About Brand", `Reviews (${reviews.length})`];
  const [activeTab, setActiveTab] = useState("Description");

  // Review Form States
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Compute rating stats
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : 0;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (rating === 0) return setSubmitError("Please select a star rating.");
    if (!title.trim()) return setSubmitError("Please enter a review title.");
    if (!comment.trim()) return setSubmitError("Please enter review comments.");

    setIsSubmitting(true);
    try {
      const res = await submitReview({
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      if (res.success) {
        setSubmitSuccess(res.message || "Review submitted successfully!");
        setRating(0);
        setTitle("");
        setComment("");
        onReviewSubmitted();
      } else {
        setSubmitError(res.error || "Failed to submit review.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full select-none bg-white dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] dark:border-neutral-800 rounded-[var(--radius-lg)] overflow-hidden mt-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Tabs list Header */}
      <div className="flex border-b border-[var(--ag-gray-200)] dark:border-neutral-800 bg-[var(--ag-gray-100)] dark:bg-neutral-900/50 overflow-x-auto no-scrollbar relative">
        {tabs.map((tab) => {
          const tabKey = tab.split(" ")[0];
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tabKey)}
              className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors relative shrink-0 cursor-pointer ${
                isActive
                  ? "text-[var(--ag-red)]"
                  : "text-zinc-650 dark:text-zinc-400 hover:text-[var(--ag-red)]"
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--ag-red)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "Description" && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-4 font-medium"
            >
              <p>{description}</p>
            </motion.div>
          )}

          {activeTab === "Specifications" && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-[var(--ag-gray-200)] dark:divide-neutral-800"
            >
              {Object.keys(specifications).length === 0 ? (
                <p className="text-xs text-zinc-450 dark:text-zinc-550 italic">No specifications provided.</p>
              ) : (
                Object.entries(specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 text-sm font-medium">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-450">{key}</span>
                    <span className="font-bold text-[var(--ag-dark)] dark:text-zinc-200">{val}</span>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "About" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium"
            >
              <h4 className="font-bold text-base text-[var(--ag-dark)] dark:text-zinc-100 mb-2">About {brandName}</h4>
              <p>
                {brandDescription || (
                  `${brandName} is a manufacturer of writing instruments and accessories. Renowned for their structural excellence and premium ergonomics, ${brandName} products represent the pinnacle of stationery design.`
                )}
              </p>
            </motion.div>
          )}

          {activeTab === "Reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Rating Summary Card */}
              <div className="flex items-center gap-5 bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-fit select-none">
                <div className="text-4xl font-black text-[var(--ag-dark)] dark:text-zinc-100 font-display">
                  {averageRating > 0 ? averageRating : "N/A"}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-4 ${
                          s <= Math.round(averageRating) ? "fill-current" : "text-zinc-200 dark:text-zinc-850"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 font-semibold">
                    Based on {reviewCount} customer review{reviewCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-5 divide-y divide-zinc-100 dark:divide-zinc-850">
                  {reviews.map((rev) => {
                    const reviewerName =
                      rev.user.firstName || rev.user.lastName
                        ? `${rev.user.firstName ?? ""} ${rev.user.lastName ?? ""}`.trim()
                        : rev.user.email;
                    
                    return (
                      <div key={rev.id} className="pt-5 first:pt-0 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{reviewerName}</p>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-650">
                            {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`size-3.5 ${s <= rev.rating ? "fill-current" : "text-zinc-200 dark:text-zinc-850"}`}
                            />
                          ))}
                        </div>

                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{rev.title}</h4>
                        <p className="text-xs text-zinc-650 dark:text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap">
                          {rev.comment}
                        </p>

                        {/* Admin reply */}
                        {rev.reply && (
                          <div className="ml-4 pl-4 border-l-2 border-red-500/20 bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-r-lg space-y-1 shadow-sm">
                            <span className="text-[9px] font-black uppercase text-red-550 tracking-wider flex items-center gap-1">
                              <CornerDownRight className="size-3 text-red-550" /> Admin Response
                            </span>
                            <p className="text-xs text-zinc-700 dark:text-zinc-350 font-medium leading-relaxed">
                              {rev.reply.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-450 dark:text-zinc-550 italic">No reviews yet for this product.</p>
              )}

              {/* Review Submit Form block */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-8">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-4">Write a Review</h4>

                {canReview ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                    {/* Rating selector */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                        Rating *
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-2xl text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            {star <= rating ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                        Review Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Summarize your experience..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900 dark:text-zinc-50 font-semibold"
                      />
                    </div>

                    {/* Review Comment */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                        Review Comments *
                      </label>
                      <textarea
                        required
                        placeholder="Share details of your experience with other customers..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900 dark:text-zinc-50 font-semibold resize-y"
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-550 font-bold">{submitError}</p>
                    )}

                    {submitSuccess && (
                      <p className="text-xs text-emerald-600 font-bold">{submitSuccess}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || rating === 0 || !title.trim() || !comment.trim()}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-5 bg-red-650 hover:bg-red-750 disabled:bg-zinc-350 dark:disabled:bg-zinc-850 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-md shadow-red-650/15"
                    >
                      {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
                      <span>Submit Review</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 text-xs text-zinc-500 dark:text-zinc-450 font-bold max-w-xl">
                    {canReviewReason === "not_logged_in" && (
                      <p className="flex items-center gap-1">
                        Please{" "}
                        <Link
                          href={`/account/login?redirect=${typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : ""}`}
                          className="text-red-650 dark:text-red-500 font-black hover:underline"
                        >
                          log in
                        </Link>{" "}
                        to review this product.
                        <ArrowRight className="size-3 text-red-650" />
                      </p>
                    )}
                    {canReviewReason === "already_reviewed" && (
                      <p>You have already submitted a review for this product.</p>
                    )}
                    {canReviewReason === "not_purchased" && (
                      <p>Only verified purchasers of this product can submit a review.</p>
                    )}
                    {canReviewReason === "error" && (
                      <p>Unable to verify reviewer permissions at this time.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
