import { Analytics } from "../models/analyticsModel.js";

// Update when user follows a business
export const trackFollowAction = async (businessId, isFollow = true) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "2026-02-20"

    const analytics = await Analytics.findOne({ businessID: businessId });

    if (!analytics) {
      // Create new analytics if doesn't exist
      const newAnalytics = new Analytics({
        businessID: businessId,
        followers: {
          totalFollowers: isFollow ? 1 : 0,
          history: [{ date: today, countChange: isFollow ? 1 : -1 }],
        },
      });
      await newAnalytics.save();
      return;
    }

    // Update total followers
    const newTotal = isFollow
      ? analytics.followers.totalFollowers + 1
      : Math.max(0, analytics.followers.totalFollowers - 1);

    // Check if entry for today exists
    const todayEntry = analytics.followers.history.find(
      (h) => h.date === today
    );

    if (todayEntry) {
      // Update existing entry
      todayEntry.countChange += isFollow ? 1 : -1;
    } else {
      // Add new entry for today
      analytics.followers.history.push({
        date: today,
        countChange: isFollow ? 1 : -1,
      });
    }

    analytics.followers.totalFollowers = newTotal;
    await analytics.save();
  } catch (error) {
    console.error("Error tracking follow action:", error);
  }
};

// Update when someone views a post/tweet
export const trackTweetView = async (businessId, postId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const analytics = await Analytics.findOne({ businessID: businessId });

    if (!analytics) {
      // Create new analytics with tweet view
      const newAnalytics = new Analytics({
        businessID: businessId,
        posts: [
          {
            postId: postId,
            totalViews: 1,
            viewsByDate: [{ date: today, count: 1 }],
          },
        ],
      });
      await newAnalytics.save();
      return;
    }

    // Find the post
    let post = analytics.posts.find((p) => p.postId.toString() === postId.toString());

    if (!post) {
      // Create new post entry
      analytics.posts.push({
        postId: postId,
        totalViews: 1,
        viewsByDate: [{ date: today, count: 1 }],
      });
    } else {
      // Update existing post
      post.totalViews += 1;

      const dateEntry = post.viewsByDate.find((v) => v.date === today);
      if (dateEntry) {
        dateEntry.count += 1;
      } else {
        post.viewsByDate.push({ date: today, count: 1 });
      }
    }

    await analytics.save();
  } catch (error) {
    console.error("Error tracking tweet view:", error);
  }
};

// Update when someone views a business profile
export const trackBusinessProfileView = async (businessId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const analytics = await Analytics.findOne({ businessID: businessId });

    if (!analytics) {
      // Create new analytics with profile view
      const newAnalytics = new Analytics({
        businessID: businessId,
        profileViews: {
          totalViews: 1,
          viewsByDate: [{ date: today, count: 1 }],
        },
      });
      await newAnalytics.save();
      return;
    }

    // Update profile views
    analytics.profileViews.totalViews += 1;

    const dateEntry = analytics.profileViews.viewsByDate.find(
      (v) => v.date === today
    );

    if (dateEntry) {
      dateEntry.count += 1;
    } else {
      analytics.profileViews.viewsByDate.push({ date: today, count: 1 });
    }

    await analytics.save();
  } catch (error) {
    console.error("Error tracking profile view:", error);
  }
};
