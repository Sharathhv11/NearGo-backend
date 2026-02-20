import express from "express";
import analyticsController from "../controllers/Business/analytics/analyticsController.js";
import authorize from "../controllers/authorization.js";

const analyticsRouter = express.Router();

/**
 * Single Dynamic Analytics Endpoint
 * GET /api/analytics/:businessId
 *
 * Query Parameters:
 * - type: "overview" | "followers" | "profile-views" | "posts" | "compare"
 * - startDate: YYYY-MM-DD (optional)
 * - endDate: YYYY-MM-DD (optional)
 * - year: YYYY (optional)
 * - month: MM (optional, 1-12)
 * - postId: ObjectId (optional, for specific post)
 * - limit: number (optional, default 5, for top posts)
 * - startDate1, endDate1, startDate2, endDate2: for compare
 */
analyticsRouter.get("/:businessId", authorize, analyticsController);

export default analyticsRouter;
