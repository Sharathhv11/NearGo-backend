import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import CustomError from "../../../utils/customError.js";
import { Analytics } from "../../../models/analyticsModel.js";

/**
 * Dynamic Analytics Controller
 * Single endpoint that returns all data based on query parameters
 *
 * Query Parameters:
 * - type: "followers" | "profile-views" | "posts" | "compare" | "overview"
 * - startDate: "YYYY-MM-DD"
 * - endDate: "YYYY-MM-DD"
 * - year: "YYYY"
 * - month: "MM" (1-12)
 * - postId: ObjectId of specific post
 * - limit: number of top posts to show
 * - startDate1, endDate1, startDate2, endDate2: for compare queries
 */
const analyticsController = handelAsyncFunction(async (req, res, next) => {
  const { businessId } = req.params;
  const {
    type = "overview",
    startDate,
    endDate,
    year,
    month,
    postId,
    limit = 5,
    startDate1,
    endDate1,
    startDate2,
    endDate2,
  } = req.query;

  // ==================== PREMIUM USER CHECK ====================
  const user = req.user;
  const isPremiumExpired =
    user.account?.type === "premium" &&
    user.account?.expiresAt &&
    user.account.expiresAt <= Date.now();

  if (user.account?.type === "free" || isPremiumExpired) {
    return next(
      new CustomError(403, "Upgrade to premium to access analytics", {
        code: "SUBSCRIPTION_REQUIRED",
      }),
    );
  }

  const analytics = await Analytics.findOne({ businessID: businessId });

  if (!analytics) {
    return res.status(200).json({
      status: "success",
      message: "No analytics data yet",
      data: null,
    });
  }

  // ==================== OVERVIEW ====================
  if (type === "overview") {
    return res.status(200).json({
      status: "success",
      message: "Overall analytics retrieved",
      data: {
        totalFollowers: analytics.followers.totalFollowers,
        totalProfileViews: analytics.profileViews.totalViews,
        totalPosts: analytics.posts.length,
        totalPostViews: analytics.posts.reduce(
          (sum, p) => sum + p.totalViews,
          0,
        ),
        averageViewsPerPost:
          analytics.posts.length > 0
            ? Math.round(
                analytics.posts.reduce((sum, p) => sum + p.totalViews, 0) /
                  analytics.posts.length,
              )
            : 0,
        followerHistoryCount: analytics.followers.history.length,
        profileViewsDaysTracked: analytics.profileViews.viewsByDate.length,
      },
    });
  }

  // ==================== FOLLOWERS ====================
  if (type === "followers") {
    let history = [...analytics.followers.history];

    // Filter by date range
    if (startDate || endDate) {
      history = history.filter((entry) => {
        if (startDate && entry.date < startDate) return false;
        if (endDate && entry.date > endDate) return false;
        return true;
      });
    }

    // Filter by month/year
    if (year && month) {
      history = history.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getFullYear() === parseInt(year) &&
          entryDate.getMonth() + 1 === parseInt(month)
        );
      });
    } else if (year) {
      history = history.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === parseInt(year);
      });
    }

    const gain = history.filter((h) => h.countChange > 0).length;
    const loss = history.filter((h) => h.countChange < 0).length;
    const netChange = history.reduce((sum, h) => sum + h.countChange, 0);

    return res.status(200).json({
      status: "success",
      message: "Follower analytics retrieved",
      data: {
        totalFollowers: analytics.followers.totalFollowers,
        summary: {
          gain,
          loss,
          netChange,
          period:
            year && month
              ? `${year}-${month}`
              : year
                ? year
                : startDate && endDate
                  ? `${startDate} to ${endDate}`
                  : "All time",
        },
        history: history.map((h) => ({
          date: h.date,
          countChange: h.countChange,
        })),
        historyCount: history.length,
      },
    });
  }

  // ==================== PROFILE VIEWS ====================
  if (type === "profile-views") {
    let views = [...analytics.profileViews.viewsByDate];

    // Filter by date range
    if (startDate || endDate) {
      views = views.filter((entry) => {
        if (startDate && entry.date < startDate) return false;
        if (endDate && entry.date > endDate) return false;
        return true;
      });
    }

    // Filter by month/year
    if (year && month) {
      views = views.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getFullYear() === parseInt(year) &&
          entryDate.getMonth() + 1 === parseInt(month)
        );
      });
    } else if (year) {
      views = views.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === parseInt(year);
      });
    }

    const totalViews = views.reduce((sum, v) => sum + v.count, 0);
    const averagePerDay =
      views.length > 0 ? Math.round(totalViews / views.length) : 0;
    const peakDay =
      views.length > 0
        ? views.reduce((max, v) => (v.count > max.count ? v : max))
        : null;

    return res.status(200).json({
      status: "success",
      message: "Profile views analytics retrieved",
      data: {
        totalViews: analytics.profileViews.totalViews,
        summary: {
          viewsInPeriod: totalViews,
          averagePerDay,
          peakDay,
          daysWithViews: views.length,
          period:
            year && month
              ? `${year}-${month}`
              : year
                ? year
                : startDate && endDate
                  ? `${startDate} to ${endDate}`
                  : "All time",
        },
        viewsByDate: views.map((v) => ({
          date: v.date,
          count: v.count,
        })),
      },
    });
  }

  // ==================== POSTS ====================
  if (type === "posts") {
    // If specific postId requested
    if (postId) {
      const post = analytics.posts.find(
        (p) => p.postId.toString() === postId.toString(),
      );

      if (!post) {
        return res.status(200).json({
          status: "success",
          message: "Post not found",
          data: null,
        });
      }

      let views = [...post.viewsByDate];

      // Filter by date range
      if (startDate || endDate) {
        views = views.filter((entry) => {
          if (startDate && entry.date < startDate) return false;
          if (endDate && entry.date > endDate) return false;
          return true;
        });
      }

      // Filter by month/year
      if (year && month) {
        views = views.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getFullYear() === parseInt(year) &&
            entryDate.getMonth() + 1 === parseInt(month)
          );
        });
      } else if (year) {
        views = views.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate.getFullYear() === parseInt(year);
        });
      }

      const totalViews = views.reduce((sum, v) => sum + v.count, 0);
      const averagePerDay =
        views.length > 0 ? Math.round(totalViews / views.length) : 0;

      return res.status(200).json({
        status: "success",
        message: "Post analytics retrieved",
        data: {
          postId,
          totalViews: post.totalViews,
          summary: {
            viewsInPeriod: totalViews,
            averagePerDay,
            daysActive: views.length,
            period:
              year && month
                ? `${year}-${month}`
                : year
                  ? year
                  : startDate && endDate
                    ? `${startDate} to ${endDate}`
                    : "All time",
          },
          viewsByDate: views.map((v) => ({
            date: v.date,
            count: v.count,
          })),
        },
      });
    }

    // All posts summary
    const totalPostViews = analytics.posts.reduce(
      (sum, p) => sum + p.totalViews,
      0,
    );
    const topPosts = analytics.posts
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, parseInt(limit));

    return res.status(200).json({
      status: "success",
      message: "Posts analytics retrieved",
      data: {
        summary: {
          totalPosts: analytics.posts.length,
          totalPostViews,
          averageViewsPerPost:
            analytics.posts.length > 0
              ? Math.round(totalPostViews / analytics.posts.length)
              : 0,
        },
        topPosts: topPosts.map((post) => ({
          postId: post.postId,
          totalViews: post.totalViews,
          daysActive: post.viewsByDate.length,
          peakDay: post.viewsByDate.reduce(
            (max, v) => (v.count > max.count ? v : max),
            post.viewsByDate[0],
          ),
        })),
        allPosts: analytics.posts.map((post) => ({
          postId: post.postId,
          totalViews: post.totalViews,
          daysActive: post.viewsByDate.length,
        })),
      },
    });
  }

  // ==================== COMPARE ====================
  if (type === "compare") {
    if (!startDate1 || !endDate1 || !startDate2 || !endDate2) {
      return next(
        new CustomError(
          400,
          "startDate1, endDate1, startDate2, and endDate2 are required for compare",
        ),
      );
    }

    // Period 1
    const period1ProfileViews = analytics.profileViews.viewsByDate.filter(
      (v) => v.date >= startDate1 && v.date <= endDate1,
    );
    const period1Followers = analytics.followers.history.filter(
      (h) => h.date >= startDate1 && h.date <= endDate1,
    );

    // Period 2
    const period2ProfileViews = analytics.profileViews.viewsByDate.filter(
      (v) => v.date >= startDate2 && v.date <= endDate2,
    );
    const period2Followers = analytics.followers.history.filter(
      (h) => h.date >= startDate2 && h.date <= endDate2,
    );

    const period1Views = period1ProfileViews.reduce((s, v) => s + v.count, 0);
    const period2Views = period2ProfileViews.reduce((s, v) => s + v.count, 0);
    const period1FollowerGrowth = period1Followers.reduce(
      (s, f) => s + f.countChange,
      0,
    );
    const period2FollowerGrowth = period2Followers.reduce(
      (s, f) => s + f.countChange,
      0,
    );

    const viewsGrowthPercent =
      period1Views > 0
        ? (((period2Views - period1Views) / period1Views) * 100).toFixed(2)
        : "N/A";
    const followerGrowthPercent =
      period1FollowerGrowth > 0
        ? (
            ((period2FollowerGrowth - period1FollowerGrowth) /
              period1FollowerGrowth) *
            100
          ).toFixed(2)
        : "N/A";

    return res.status(200).json({
      status: "success",
      message: "Comparative analytics retrieved",
      data: {
        period1: {
          range: `${startDate1} to ${endDate1}`,
          profileViews: period1Views,
          followerGrowth: period1FollowerGrowth,
          daysTracked: period1ProfileViews.length,
        },
        period2: {
          range: `${startDate2} to ${endDate2}`,
          profileViews: period2Views,
          followerGrowth: period2FollowerGrowth,
          daysTracked: period2ProfileViews.length,
        },
        comparison: {
          viewsGrowthPercent: `${viewsGrowthPercent}%`,
          followerGrowthPercent: `${followerGrowthPercent}%`,
          viewsDifference: period2Views - period1Views,
          followerDifference: period2FollowerGrowth - period1FollowerGrowth,
        },
      },
    });
  }

  // Default response if type not recognized
  return res.status(400).json({
    status: "error",
    message:
      "Invalid type. Use: overview, followers, profile-views, posts, or compare",
  });
});

export default analyticsController;
