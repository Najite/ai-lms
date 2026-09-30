import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  CapstoneReview,
  CapstoneReviewType,
  CapstoneReviewResult,
} from "../models";
import { logger } from "@/lib/logger";

type ReviewRow = Database["public"]["Tables"]["capstone_reviews"]["Row"] & {
  capstone_feedback?: Database["public"]["Tables"]["capstone_feedback"]["Row"][];
};

export class CapstoneReviewRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates a review and optional feedback
   */
  public async createReview(
    capstoneId: string,
    userId: string,
    reviewType: CapstoneReviewType,
    reviewResult: CapstoneReviewResult,
    score?: number | null,
    feedbackText?: string,
    reviewerId?: string | null,
    submissionId?: string | null
  ): Promise<CapstoneReview | null> {
    try {
      const { data: reviewData, error: reviewError } = await this.supabase
        .from("capstone_reviews")
        .insert({
          capstone_id: capstoneId,
          user_id: userId,
          reviewer_id: reviewerId || null,
          submission_id: submissionId || null,
          review_type: reviewType,
          review_result: reviewResult,
          score: score !== undefined ? score : null,
        })
        .select("*")
        .single();

      if (reviewError || !reviewData) {
        logger.error("Failed to create capstone review", reviewError);
        return null;
      }

      if (feedbackText && feedbackText.trim()) {
        await this.supabase.from("capstone_feedback").insert({
          review_id: reviewData.id,
          feedback_text: feedbackText.trim(),
        });
      }

      logger.info("capstone.reviewed", {
        capstoneId,
        userId,
        reviewId: reviewData.id,
        reviewResult,
      });

      return await this.getReviewById(reviewData.id);
    } catch (err) {
      logger.error("Unexpected error in createReview", err);
      return null;
    }
  }

  /**
   * Retrieves review by ID with feedback
   */
  public async getReviewById(id: string): Promise<CapstoneReview | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_reviews")
        .select(`
          *,
          capstone_feedback (*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        if (error) logger.error("Failed to fetch capstone review by ID", error);
        return null;
      }

      return this.mapReview(data as unknown as ReviewRow);
    } catch (err) {
      logger.error("Unexpected error in getReviewById", err);
      return null;
    }
  }

  /**
   * Retrieves all reviews for a user on a capstone
   */
  public async getReviews(capstoneId: string, userId: string): Promise<CapstoneReview[]> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_reviews")
        .select(`
          *,
          capstone_feedback (*)
        `)
        .eq("capstone_id", capstoneId)
        .eq("user_id", userId)
        .order("reviewed_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch capstone reviews", error);
        return [];
      }

      return (data || []).map((row) => this.mapReview(row as unknown as ReviewRow));
    } catch (err) {
      logger.error("Unexpected error in getReviews", err);
      return [];
    }
  }

  /**
   * Retrieves the latest review for a user on a capstone
   */
  public async getLatestReview(
    capstoneId: string,
    userId: string
  ): Promise<CapstoneReview | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_reviews")
        .select(`
          *,
          capstone_feedback (*)
        `)
        .eq("capstone_id", capstoneId)
        .eq("user_id", userId)
        .order("reviewed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapReview(data as unknown as ReviewRow);
    } catch (err) {
      logger.error("Unexpected error in getLatestReview", err);
      return null;
    }
  }

  private mapReview(row: ReviewRow): CapstoneReview {
    return {
      id: row.id,
      capstoneId: row.capstone_id,
      submissionId: row.submission_id,
      userId: row.user_id,
      reviewerId: row.reviewer_id,
      reviewType: row.review_type as CapstoneReviewType,
      reviewResult: row.review_result as CapstoneReviewResult,
      score: row.score,
      reviewedAt: row.reviewed_at,
      feedback: (row.capstone_feedback || []).map((f) => ({
        id: f.id,
        reviewId: f.review_id,
        feedbackText: f.feedback_text,
        createdAt: f.created_at,
      })),
    };
  }
}
