# Integration Guide - Adding Analytics Routes to Your App

## Step 1: Add Import to app.js

In your main `app.js` file, add this import at the top with your other route imports:

```javascript
import analyticsRoute from "./routes/analyticsRoute.js";
```

## Step 2: Register the Route

Add this middleware registration in your `app.js` file (typically after other route registrations):

```javascript
// ==================== ANALYTICS ROUTES ====================
app.use("/api/analytics", analyticsRoute);
```

## Example Integration in app.js

```javascript
import express from "express";
import businessRoute from "./routes/businessRoute.js";
import userRoute from "./routes/userRoute.js";
import followRoute from "./routes/followRoute.js";
import payment from "./routes/payment.js";
import analyticsRoute from "./routes/analyticsRoute.js"; // Add this

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/business", businessRoute);
app.use("/api/users", userRoute);
app.use("/api/follow", followRoute);
app.use("/api/payment", payment);
app.use("/api/analytics", analyticsRoute); // Add this line

export default app;
```

## Step 3: Update app.js for Authentication Middleware

The `analyticsRoute` uses the `isAuthenticated` middleware. Make sure it's imported:

In `analyticsRoute.js`, the import statement is:

```javascript
import { isAuthenticated } from "../controllers/authorization.js";
```

Ensure your `authorization.js` exports this middleware correctly.

## Verification Checklist

- ✅ Import `analyticsRoute` in `app.js`
- ✅ Register route with `app.use("/api/analytics", analyticsRoute)`
- ✅ Ensure `isAuthenticated` middleware exists in `controllers/authorization.js`
- ✅ Ensure `Analytics` model is properly exported from `models/analyticsModel.js`
- ✅ Ensure `analyticsService.js` is imported in relevant controllers
- ✅ Ensure all controllers are tracking analytics (follow, unfollow, views)

## Testing the Routes

After integration, test with these commands:

```bash
# Test overview endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/analytics/507f1f77bcf86cd799439011

# Test follower summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/analytics/507f1f77bcf86cd799439011/followers/summary

# Test profile views
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/analytics/507f1f77bcf86cd799439011/profile-views/summary
```

## File Structure

After implementation, your structure should look like:

```
BizSpot-backend/
├── app.js                          (ADD: import analyticsRoute)
├── controllers/
│   └── Business/
│       ├── analytics/
│       │   └── analyticsController.js    (NEW: all query functions)
│       └── ...                           (UPDATED: follow, tweets, business)
├── models/
│   └── analyticsModel.js           (NEW: analytics schema)
├── routes/
│   ├── analyticsRoute.js           (NEW: all route mappings)
│   ├── ANALYTICS_API_DOCS.md       (NEW: full documentation)
│   └── ANALYTICS_QUICK_REFERENCE.md (NEW: quick reference)
├── service/
│   └── analyticsService.js         (NEW: tracking functions)
└── ...
```

## Available Controllers

The `analyticsController.js` exports the following functions:

1. `getOverallAnalytics` - Overview dashboard data
2. `getFollowerSummary` - Total followers
3. `getFollowerHistory` - Follower growth over time
4. `getFollowerStats` - Monthly/yearly follower statistics
5. `getProfileViewsSummary` - Total profile views
6. `getProfileViewsByDateRange` - Views for date range
7. `getProfileViewsByDate` - Views for specific date
8. `getProfileViewsMonthly` - Monthly profile view stats
9. `getPostsAnalyticsSummary` - All posts overview
10. `getPostAnalytics` - Specific post analytics
11. `getPostViewsByDateRange` - Post views for date range
12. `getPostsSortedByViews` - Posts ranked by popularity
13. `getTopPosts` - Top N performing posts
14. `getPostViewsMonthly` - Monthly post statistics
15. `compareAnalytics` - Compare two date ranges

## Notes

- All endpoints require user authentication
- The `isAuthenticated` middleware validates the JWT token
- Business owner should only access their own business analytics
- Consider adding authorization check to verify the user owns the business
- All data is retrieved asynchronously using `async/await`
- Errors are handled by the `Handler` function wrapper

## Optional: Add Authorization Check

For production, you should verify that the authenticated user owns the business:

```javascript
// Add this to each route handler (example)
import { isAuthenticated } from "../controllers/authorization.js";
import businessModel from "../models/BusinessModels/business.js";

const isBusinessOwner = async (req, res, next) => {
  const { businessId } = req.params;
  const business = await businessModel.findById(businessId);

  if (business.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "error",
      message: "You don't have permission to view this analytics",
    });
  }
  next();
};

// Then use in routes:
router.get(
  "/:businessId",
  isAuthenticated,
  isBusinessOwner,
  getOverallAnalytics,
);
```

This ensures only the business owner can view their analytics.
