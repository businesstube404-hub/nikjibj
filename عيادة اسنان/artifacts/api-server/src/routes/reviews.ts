import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import {
  CreateReviewBody,
  ListReviewsResponse,
  ListReviewsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .orderBy(desc(reviewsTable.createdAt));
  res.json(ListReviewsResponse.parse(reviews));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid review body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(ListReviewsResponseItem.parse(review));
});

export default router;
