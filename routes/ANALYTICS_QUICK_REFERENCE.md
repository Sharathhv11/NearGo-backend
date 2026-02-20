# Analytics API Quick Reference

## All Available Endpoints

### Overview

```
GET /api/analytics/:businessId
```

### Follower Analytics

```
GET /api/analytics/:businessId/followers/summary
GET /api/analytics/:businessId/followers/history?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET /api/analytics/:businessId/followers/stats?year=YYYY&month=MM
```

### Profile Views Analytics

```
GET /api/analytics/:businessId/profile-views/summary
GET /api/analytics/:businessId/profile-views?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET /api/analytics/:businessId/profile-views/date/:date
GET /api/analytics/:businessId/profile-views/monthly?year=YYYY&month=MM
```

### Post Analytics

```
GET /api/analytics/:businessId/posts/summary
GET /api/analytics/:businessId/posts/top?limit=5
GET /api/analytics/:businessId/posts/sorted/popularity?limit=10
GET /api/analytics/:businessId/posts/:postId
GET /api/analytics/:businessId/posts/:postId/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET /api/analytics/:businessId/posts/:postId/monthly?year=YYYY&month=MM
```

### Comparative Analytics

```
GET /api/analytics/:businessId/compare?startDate1=YYYY-MM-DD&endDate1=YYYY-MM-DD&startDate2=YYYY-MM-DD&endDate2=YYYY-MM-DD
```

---

## Common Query Patterns

### Get This Month's Data

```bash
GET /api/analytics/:businessId/profile-views/monthly?year=2026&month=02
GET /api/analytics/:businessId/followers/stats?year=2026&month=02
GET /api/analytics/:businessId/posts/:postId/monthly?year=2026&month=02
```

### Get This Year's Data

```bash
GET /api/analytics/:businessId/profile-views/monthly?year=2026
GET /api/analytics/:businessId/followers/stats?year=2026
GET /api/analytics/:businessId/posts/:postId/monthly?year=2026
```

### Get Date Range Data

```bash
GET /api/analytics/:businessId/followers/history?startDate=2026-01-01&endDate=2026-02-20
GET /api/analytics/:businessId/profile-views?startDate=2026-01-01&endDate=2026-02-20
GET /api/analytics/:businessId/posts/:postId/date-range?startDate=2026-01-01&endDate=2026-02-20
```

### Get Top Performance

```bash
GET /api/analytics/:businessId/posts/top?limit=5
GET /api/analytics/:businessId/posts/sorted/popularity?limit=20
```

### Compare Periods

```bash
# Last 7 days vs Previous 7 days
GET /api/analytics/:businessId/compare?startDate1=2026-02-07&endDate1=2026-02-13&startDate2=2026-02-14&endDate2=2026-02-20

# Last month vs Previous month
GET /api/analytics/:businessId/compare?startDate1=2026-01-01&endDate1=2026-01-31&startDate2=2026-02-01&endDate2=2026-02-28
```

---

## Response Data Structure

### Follower Response

```json
{
  "date": "2026-02-20",
  "countChange": 1 // +1 for follow, -1 for unfollow
}
```

### Profile Views Response

```json
{
  "date": "2026-02-20",
  "count": 45
}
```

### Post View Response

```json
{
  "postId": "507f1f77bcf86cd799439012",
  "totalViews": 234,
  "viewsByDate": [
    { "date": "2026-02-20", "count": 45 },
    { "date": "2026-02-19", "count": 67 }
  ]
}
```

---

## Date Format

Always use: **YYYY-MM-DD**

Examples:

- `2026-02-20` ✓
- `2026-2-20` ✗
- `02/20/2026` ✗
- `20-02-2026` ✗
