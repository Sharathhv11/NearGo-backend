# Single Analytics Endpoint Documentation

## Base Endpoint

```
GET /api/analytics/:businessId
```

All queries use this single endpoint with different query parameters.

---

## Query Parameters

| Parameter    | Type   | Required | Description                                                           |
| ------------ | ------ | -------- | --------------------------------------------------------------------- |
| `type`       | string | Yes      | Type of analytics: overview, followers, profile-views, posts, compare |
| `startDate`  | string | Optional | Start date in YYYY-MM-DD format                                       |
| `endDate`    | string | Optional | End date in YYYY-MM-DD format                                         |
| `year`       | string | Optional | Year in YYYY format                                                   |
| `month`      | string | Optional | Month in MM format (1-12)                                             |
| `postId`     | string | Optional | Post/Tweet ID (for specific post analytics)                           |
| `limit`      | number | Optional | Number of top posts (default: 5)                                      |
| `startDate1` | string | Optional | First period start date (for compare type)                            |
| `endDate1`   | string | Optional | First period end date (for compare type)                              |
| `startDate2` | string | Optional | Second period start date (for compare type)                           |
| `endDate2`   | string | Optional | Second period end date (for compare type)                             |

---

## Usage Examples

### 1. Get Overview

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=overview
```

**Response:**

```json
{
  "status": "success",
  "message": "Overall analytics retrieved",
  "data": {
    "totalFollowers": 150,
    "totalProfileViews": 2500,
    "totalPosts": 45,
    "totalPostViews": 5300,
    "averageViewsPerPost": 118,
    "followerHistoryCount": 42,
    "profileViewsDaysTracked": 35
  }
}
```

---

### 2. Get Follower Analytics

#### All follower data

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=followers
```

#### Follower data for date range

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=followers&startDate=2026-02-01&endDate=2026-02-20
```

#### Follower stats for specific month

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=followers&year=2026&month=02
```

#### Follower stats for entire year

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=followers&year=2026
```

**Response:**

```json
{
  "status": "success",
  "message": "Follower analytics retrieved",
  "data": {
    "totalFollowers": 150,
    "summary": {
      "gain": 8,
      "loss": 2,
      "netChange": 6,
      "period": "2026-02"
    },
    "history": [
      { "date": "2026-02-20", "countChange": 1 },
      { "date": "2026-02-19", "countChange": -1 },
      { "date": "2026-02-18", "countChange": 2 }
    ],
    "historyCount": 10
  }
}
```

---

### 3. Get Profile Views Analytics

#### All profile views

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=profile-views
```

#### Profile views for date range

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=profile-views&startDate=2026-02-01&endDate=2026-02-20
```

#### Profile views for month

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=profile-views&year=2026&month=02
```

#### Profile views for year

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=profile-views&year=2026
```

**Response:**

```json
{
  "status": "success",
  "message": "Profile views analytics retrieved",
  "data": {
    "totalViews": 2500,
    "summary": {
      "viewsInPeriod": 250,
      "averagePerDay": 25,
      "peakDay": { "date": "2026-02-15", "count": 89 },
      "daysWithViews": 10,
      "period": "2026-02"
    },
    "viewsByDate": [
      { "date": "2026-02-20", "count": 45 },
      { "date": "2026-02-19", "count": 52 }
    ]
  }
}
```

---

### 4. Get Posts Analytics

#### Summary of all posts

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=posts
```

#### Top 5 posts summary

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=posts&limit=5
```

#### Top 10 posts

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=posts&limit=10
```

#### Specific post analytics

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=posts&postId=507f1f77bcf86cd799439012
```

#### Specific post analytics for date range

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=posts&postId=507f1f77bcf86cd799439012&startDate=2026-02-01&endDate=2026-02-20
```

#### Specific post analytics for month

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=posts&postId=507f1f77bcf86cd799439012&year=2026&month=02
```

**Response (all posts):**

```json
{
  "status": "success",
  "message": "Posts analytics retrieved",
  "data": {
    "summary": {
      "totalPosts": 45,
      "totalPostViews": 5300,
      "averageViewsPerPost": 118
    },
    "topPosts": [
      {
        "postId": "507f1f77bcf86cd799439012",
        "totalViews": 450,
        "daysActive": 8,
        "peakDay": { "date": "2026-02-15", "count": 120 }
      }
    ],
    "allPosts": [
      {
        "postId": "507f1f77bcf86cd799439012",
        "totalViews": 450,
        "daysActive": 8
      }
    ]
  }
}
```

**Response (specific post):**

```json
{
  "status": "success",
  "message": "Post analytics retrieved",
  "data": {
    "postId": "507f1f77bcf86cd799439012",
    "totalViews": 450,
    "summary": {
      "viewsInPeriod": 120,
      "averagePerDay": 12,
      "daysActive": 10,
      "period": "2026-02"
    },
    "viewsByDate": [
      { "date": "2026-02-20", "count": 15 },
      { "date": "2026-02-19", "count": 12 }
    ]
  }
}
```

---

### 5. Compare Two Date Ranges

#### Month-over-month comparison

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=compare&startDate1=2026-01-01&endDate1=2026-01-31&startDate2=2026-02-01&endDate2=2026-02-28
```

#### Week-over-week comparison

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=compare&startDate1=2026-02-07&endDate1=2026-02-13&startDate2=2026-02-14&endDate2=2026-02-20
```

#### Custom period comparison

```bash
GET /api/analytics/507f1f77bcf86cd799439011?type=compare&startDate1=2026-01-15&endDate1=2026-01-31&startDate2=2026-02-01&endDate2=2026-02-15
```

**Response:**

```json
{
  "status": "success",
  "message": "Comparative analytics retrieved",
  "data": {
    "period1": {
      "range": "2026-01-01 to 2026-01-31",
      "profileViews": 1840,
      "followerGrowth": 12,
      "daysTracked": 31
    },
    "period2": {
      "range": "2026-02-01 to 2026-02-28",
      "profileViews": 2250,
      "followerGrowth": 18,
      "daysTracked": 28
    },
    "comparison": {
      "viewsGrowthPercent": "22.28%",
      "followerGrowthPercent": "50.00%",
      "viewsDifference": 410,
      "followerDifference": 6
    }
  }
}
```

---

## Quick Reference

| What you want                  | Query                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| Dashboard overview             | `?type=overview`                                                                                    |
| Total followers                | `?type=followers`                                                                                   |
| Follower growth this month     | `?type=followers&year=2026&month=02`                                                                |
| Follower growth this year      | `?type=followers&year=2026`                                                                         |
| Follower changes in date range | `?type=followers&startDate=2026-02-01&endDate=2026-02-20`                                           |
| Total profile views            | `?type=profile-views`                                                                               |
| Profile views this month       | `?type=profile-views&year=2026&month=02`                                                            |
| Profile views in date range    | `?type=profile-views&startDate=2026-02-01&endDate=2026-02-20`                                       |
| All posts summary              | `?type=posts`                                                                                       |
| Top 5 posts                    | `?type=posts&limit=5`                                                                               |
| Specific post views            | `?type=posts&postId=<ID>`                                                                           |
| Post views in date range       | `?type=posts&postId=<ID>&startDate=2026-02-01&endDate=2026-02-20`                                   |
| Post views this month          | `?type=posts&postId=<ID>&year=2026&month=02`                                                        |
| Month-over-month compare       | `?type=compare&startDate1=2026-01-01&endDate1=2026-01-31&startDate2=2026-02-01&endDate2=2026-02-28` |
| Week-over-week compare         | `?type=compare&startDate1=2026-02-07&endDate1=2026-02-13&startDate2=2026-02-14&endDate2=2026-02-20` |

---

## Error Handling

**Invalid type:**

```json
{
  "status": "error",
  "message": "Invalid type. Use: overview, followers, profile-views, posts, or compare"
}
```

**Missing required parameters for compare:**

```json
{
  "status": "error",
  "message": "startDate1, endDate1, startDate2, and endDate2 are required for compare"
}
```

---

## Integration in Frontend

### JavaScript/Fetch Example

```javascript
// Get overview
const getAnalyticsOverview = async (businessId) => {
  const response = await fetch(`/api/analytics/${businessId}?type=overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

// Get follower data for specific month
const getMonthlyFollowers = async (businessId, year, month) => {
  const response = await fetch(
    `/api/analytics/${businessId}?type=followers&year=${year}&month=${month}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return await response.json();
};

// Get top posts
const getTopPosts = async (businessId, limit = 5) => {
  const response = await fetch(
    `/api/analytics/${businessId}?type=posts&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return await response.json();
};
```

### Using URL Builder

```javascript
const buildAnalyticsUrl = (businessId, options) => {
  const params = new URLSearchParams(options);
  return `/api/analytics/${businessId}?${params.toString()}`;
};

// Usage
const url = buildAnalyticsUrl("507f1f77bcf86cd799439011", {
  type: "followers",
  year: 2026,
  month: 2,
});
```

---

## Notes

- All endpoints require authentication
- Dates must be in YYYY-MM-DD format
- Single endpoint simplifies API consumption
- All data is returned in a single response based on type parameter
