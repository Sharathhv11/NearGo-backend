# Analytics API Documentation

Complete API reference for all analytics queries available for the BizSpot analytics system.

---

## Base URL

```
/api/analytics/:businessId
```

All endpoints require authentication with `Authorization` header.

---

## 1. OVERVIEW ANALYTICS

### Get Overall Analytics

**Endpoint:** `GET /:businessId`

Get a quick summary of all analytics for a business.

**Query Parameters:** None

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "status": "success",
  "message": "Overall analytics retrieved",
  "data": {
    "totalFollowers": 150,
    "totalProfileViews": 2500,
    "totalPosts": 45
  }
}
```

---

## 2. FOLLOWER ANALYTICS

### Get Follower Summary

**Endpoint:** `GET /:businessId/followers/summary`

Get total followers count and history entries count.

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/followers/summary
```

**Response:**

```json
{
  "status": "success",
  "message": "Follower summary retrieved",
  "data": {
    "totalFollowers": 150,
    "historyCount": 42
  }
}
```

---

### Get Follower History

**Endpoint:** `GET /:businessId/followers/history`

Get the complete follower growth history with optional date filtering.

**Query Parameters:**

- `startDate` (optional): "YYYY-MM-DD" format
- `endDate` (optional): "YYYY-MM-DD" format

**Example Requests:**

```bash
# Get all history
GET /api/analytics/507f1f77bcf86cd799439011/followers/history

# Get history for specific date range
GET /api/analytics/507f1f77bcf86cd799439011/followers/history?startDate=2026-01-01&endDate=2026-02-20

# Get history from specific date onwards
GET /api/analytics/507f1f77bcf86cd799439011/followers/history?startDate=2026-02-01
```

**Response:**

```json
{
  "status": "success",
  "message": "Follower history retrieved",
  "data": [
    {
      "date": "2026-02-20",
      "countChange": 1
    },
    {
      "date": "2026-02-19",
      "countChange": -1
    },
    {
      "date": "2026-02-18",
      "countChange": 2
    }
  ]
}
```

---

### Get Follower Statistics

**Endpoint:** `GET /:businessId/followers/stats`

Get follower gain/loss statistics for a specific month or year.

**Query Parameters:**

- `year` (required): "YYYY" format
- `month` (optional): "MM" format (1-12)

**Example Requests:**

```bash
# Get stats for entire year
GET /api/analytics/507f1f77bcf86cd799439011/followers/stats?year=2026

# Get stats for specific month
GET /api/analytics/507f1f77bcf86cd799439011/followers/stats?year=2026&month=02
```

**Response:**

```json
{
  "status": "success",
  "message": "Follower statistics retrieved",
  "data": {
    "period": "2026-02",
    "gain": 8,
    "loss": 2,
    "netChange": 6,
    "totalEntries": 10
  }
}
```

---

## 3. PROFILE VIEWS ANALYTICS

### Get Profile Views Summary

**Endpoint:** `GET /:businessId/profile-views/summary`

Get total profile views and days tracked.

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/profile-views/summary
```

**Response:**

```json
{
  "status": "success",
  "message": "Profile views summary retrieved",
  "data": {
    "totalViews": 2500,
    "daysTracked": 35
  }
}
```

---

### Get Profile Views by Date Range

**Endpoint:** `GET /:businessId/profile-views`

Get profile views for a date range with daily breakdown.

**Query Parameters:**

- `startDate` (optional): "YYYY-MM-DD"
- `endDate` (optional): "YYYY-MM-DD"

**Example Requests:**

```bash
# Get all views
GET /api/analytics/507f1f77bcf86cd799439011/profile-views

# Get views for date range
GET /api/analytics/507f1f77bcf86cd799439011/profile-views?startDate=2026-02-01&endDate=2026-02-20

# Get views from specific date
GET /api/analytics/507f1f77bcf86cd799439011/profile-views?startDate=2026-02-15
```

**Response:**

```json
{
  "status": "success",
  "message": "Profile views by date range retrieved",
  "data": {
    "views": [
      { "date": "2026-02-20", "count": 45 },
      { "date": "2026-02-19", "count": 52 },
      { "date": "2026-02-18", "count": 38 }
    ],
    "totalViews": 135,
    "daysCount": 3
  }
}
```

---

### Get Profile Views for Specific Date

**Endpoint:** `GET /:businessId/profile-views/date/:date`

Get profile views for a specific date.

**URL Parameters:**

- `date` (required): "YYYY-MM-DD"

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/profile-views/date/2026-02-20
```

**Response:**

```json
{
  "status": "success",
  "message": "Profile views for specific date retrieved",
  "data": {
    "date": "2026-02-20",
    "count": 45
  }
}
```

---

### Get Profile Views by Month/Year

**Endpoint:** `GET /:businessId/profile-views/monthly`

Get aggregated profile views statistics for a month or year.

**Query Parameters:**

- `year` (required): "YYYY"
- `month` (optional): "MM" (1-12)

**Example Requests:**

```bash
# Get stats for entire year
GET /api/analytics/507f1f77bcf86cd799439011/profile-views/monthly?year=2026

# Get stats for specific month
GET /api/analytics/507f1f77bcf86cd799439011/profile-views/monthly?year=2026&month=02
```

**Response:**

```json
{
  "status": "success",
  "message": "Monthly profile views retrieved",
  "data": {
    "period": "2026-02",
    "totalViews": 1250,
    "averagePerDay": 43,
    "peakDay": {
      "date": "2026-02-15",
      "count": 89
    },
    "daysWithViews": 29
  }
}
```

---

## 4. POST ANALYTICS

### Get Posts Analytics Summary

**Endpoint:** `GET /:businessId/posts/summary`

Get total posts count, total views, and average views per post.

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/posts/summary
```

**Response:**

```json
{
  "status": "success",
  "message": "Posts analytics summary retrieved",
  "data": {
    "totalPosts": 45,
    "totalPostViews": 5300,
    "averageViewsPerPost": 118
  }
}
```

---

### Get Specific Post Analytics

**Endpoint:** `GET /:businessId/posts/:postId`

Get detailed analytics for a specific post.

**URL Parameters:**

- `postId` (required): ObjectId of the post/tweet

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/posts/507f1f77bcf86cd799439012
```

**Response:**

```json
{
  "status": "success",
  "message": "Post analytics retrieved",
  "data": {
    "postId": "507f1f77bcf86cd799439012",
    "totalViews": 234,
    "viewsByDate": [
      { "date": "2026-02-20", "count": 45 },
      { "date": "2026-02-19", "count": 67 },
      { "date": "2026-02-18", "count": 80 }
    ],
    "daysActive": 8
  }
}
```

---

### Get Post Views by Date Range

**Endpoint:** `GET /:businessId/posts/:postId/date-range`

Get post views for a specific date range.

**URL Parameters:**

- `postId` (required): ObjectId

**Query Parameters:**

- `startDate` (optional): "YYYY-MM-DD"
- `endDate` (optional): "YYYY-MM-DD"

**Example Request:**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/posts/507f1f77bcf86cd799439012/date-range?startDate=2026-02-10&endDate=2026-02-20
```

**Response:**

```json
{
  "status": "success",
  "message": "Post views by date range retrieved",
  "data": {
    "postId": "507f1f77bcf86cd799439012",
    "views": [
      { "date": "2026-02-20", "count": 45 },
      { "date": "2026-02-19", "count": 67 }
    ],
    "totalViews": 112,
    "daysActive": 2
  }
}
```

---

### Get Posts Sorted by Popularity

**Endpoint:** `GET /:businessId/posts/sorted/popularity`

Get all posts sorted by view count (highest first).

**Query Parameters:**

- `limit` (optional): Number of posts to return (default: 10)

**Example Requests:**

```bash
# Get top 10 posts
GET /api/analytics/507f1f77bcf86cd799439011/posts/sorted/popularity

# Get top 20 posts
GET /api/analytics/507f1f77bcf86cd799439011/posts/sorted/popularity?limit=20
```

**Response:**

```json
{
  "status": "success",
  "message": "Posts sorted by views retrieved",
  "data": [
    {
      "postId": "507f1f77bcf86cd799439012",
      "totalViews": 450,
      "viewsByDate": [...]
    },
    {
      "postId": "507f1f77bcf86cd799439013",
      "totalViews": 380,
      "viewsByDate": [...]
    }
  ]
}
```

---

### Get Top Posts

**Endpoint:** `GET /:businessId/posts/top`

Get top performing posts with peak day information.

**Query Parameters:**

- `limit` (optional): Number of posts to return (default: 5)

**Example Requests:**

```bash
# Get top 5 posts
GET /api/analytics/507f1f77bcf86cd799439011/posts/top

# Get top 10 posts
GET /api/analytics/507f1f77bcf86cd799439011/posts/top?limit=10
```

**Response:**

```json
{
  "status": "success",
  "message": "Top posts retrieved",
  "data": [
    {
      "postId": "507f1f77bcf86cd799439012",
      "totalViews": 450,
      "peakDay": {
        "date": "2026-02-15",
        "count": 120
      }
    },
    {
      "postId": "507f1f77bcf86cd799439013",
      "totalViews": 380,
      "peakDay": {
        "date": "2026-02-14",
        "count": 95
      }
    }
  ]
}
```

---

### Get Post Views by Month/Year

**Endpoint:** `GET /:businessId/posts/:postId/monthly`

Get aggregated post analytics for a specific month or year.

**URL Parameters:**

- `postId` (required): ObjectId

**Query Parameters:**

- `year` (required): "YYYY"
- `month` (optional): "MM" (1-12)

**Example Requests:**

```bash
# Get post stats for entire year
GET /api/analytics/507f1f77bcf86cd799439011/posts/507f1f77bcf86cd799439012/monthly?year=2026

# Get post stats for specific month
GET /api/analytics/507f1f77bcf86cd799439011/posts/507f1f77bcf86cd799439012/monthly?year=2026&month=02
```

**Response:**

```json
{
  "status": "success",
  "message": "Post views for period retrieved",
  "data": {
    "postId": "507f1f77bcf86cd799439012",
    "period": "2026-02",
    "totalViews": 234,
    "averagePerDay": 8,
    "daysActive": 29,
    "dailyBreakdown": [
      { "date": "2026-02-20", "count": 15 },
      { "date": "2026-02-19", "count": 12 }
    ]
  }
}
```

---

## 5. COMPARATIVE ANALYTICS

### Compare Two Date Ranges

**Endpoint:** `GET /:businessId/compare`

Compare analytics between two different periods to measure growth.

**Query Parameters (All Required):**

- `startDate1`: First period start "YYYY-MM-DD"
- `endDate1`: First period end "YYYY-MM-DD"
- `startDate2`: Second period start "YYYY-MM-DD"
- `endDate2`: Second period end "YYYY-MM-DD"

**Example Request (Feb vs Jan):**

```bash
GET /api/analytics/507f1f77bcf86cd799439011/compare?startDate1=2026-01-01&endDate1=2026-01-31&startDate2=2026-02-01&endDate2=2026-02-20
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
      "followerGrowth": 12
    },
    "period2": {
      "range": "2026-02-01 to 2026-02-20",
      "profileViews": 2250,
      "followerGrowth": 18
    },
    "comparison": {
      "viewsGrowthPercentage": "22.28%",
      "followerGrowthPercentage": "50.00%"
    }
  }
}
```

---

## Usage Examples

### Example 1: Build a Dashboard

```bash
# Get overview
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011"

# Get follower summary
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/followers/summary"

# Get profile views this month
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/profile-views/monthly?year=2026&month=02"

# Get top 5 posts
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/posts/top?limit=5"
```

### Example 2: Track Post Performance

```bash
# Get specific post analytics
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/posts/507f1f77bcf86cd799439012"

# Get post views for this week
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/posts/507f1f77bcf86cd799439012/date-range?startDate=2026-02-14&endDate=2026-02-20"
```

### Example 3: Compare Performance

```bash
# Week-over-week comparison
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/compare?startDate1=2026-02-07&endDate1=2026-02-13&startDate2=2026-02-14&endDate2=2026-02-20"

# Month-over-month comparison
curl -H "Authorization: Bearer TOKEN" \
  "https://api.bizspot.com/api/analytics/507f1f77bcf86cd799439011/compare?startDate1=2026-01-01&endDate1=2026-01-31&startDate2=2026-02-01&endDate2=2026-02-28"
```

---

## Error Responses

### 404 - Not Found

```json
{
  "status": "error",
  "message": "Analytics not found"
}
```

### 400 - Bad Request

```json
{
  "status": "error",
  "message": "startDate1, endDate1, startDate2, and endDate2 are required"
}
```

---

## Notes

- All endpoints require authentication
- Dates should be in "YYYY-MM-DD" format
- All responses include a status field ("success" or "error")
- Empty/zero data is returned gracefully, not as errors
