# 🧠 Tweet Feed Queue Flow (Optimized Design)

## Overview
This document outlines the optimized **feed queue and caching mechanism** for serving user tweets efficiently using Redis and MongoDB.  
The system ensures smooth pagination, avoids repeated tweets, and preloads future content before the cache runs out.

---

## ⚙️ Core Concept
The feed operates using a **queue-based caching system**:
- Tweets are fetched in batches based on the user’s **geographical proximity** (within 10 km).
- Only **recent tweets (within 7 days)** are considered.
- Redis is used to store tweet IDs temporarily as a **feed queue** for each user.
- New tweet batches are continuously **added (topped up)** to the queue while older tweets are being consumed.

---

## 🔁 Flow Logic

### ✅ Page = 1
1. **Fetch 10 nearest businesses** based on user location.  
2. **Fetch all tweets (7-day window)** from those businesses (approx. 50 tweets).  
3. **Store all 50 tweet IDs** in Redis (queue/cache).  
4. **Send the first 10 tweets** to the user.  
5. **Keep the remaining 40 tweets** in the cache for subsequent requests.

---

### ✅ Page = 2
1. **Before serving Page 2**, fetch the **next 10 nearest businesses** (skip previously processed ones).  
2. **Fetch their tweets (7-day window)** → approx. 30 tweets.  
3. **Append these 30 tweet IDs** to the existing queue  
   → Cache now has `40 (old) + 30 (new) = 70 tweets`.  
4. **Send the next 10 tweets** from the queue to the user.  
5. **Cache now holds 60 tweets remaining.**

---

### ✅ Page = 3
- Continue the same process:
  - **Top up** the cache by prefetching the next batch of businesses and their recent tweets.  
  - **Serve 10 tweets per page** (or whatever `limit` the user sets).  
  - **Never wait** for the queue to empty before fetching new tweets.  
  - Maintain a **rolling buffer** of tweets ready to serve.

---

## 💡 Key Benefits
| Advantage | Description |
|------------|-------------|
| ⚡ **Smooth Pagination** | Tweets are always ready in cache — no delay between pages. |
| 🧠 **Prefetch Ahead** | New tweets are loaded before cache depletion. |
| 🚫 **No Repetition** | Tweet IDs are unique per queue session. |
| 🗺️ **Geo + Time Relevance** | Only nearby and recent tweets are fetched. |
| 🔄 **Rolling Cache** | Feed queue continuously grows and trims dynamically. |
| 🧩 **Scalable** | Redis list operations ensure constant-time performance. |

---

## 🧱 Redis Structure
| Key | Type | Purpose |
|-----|------|----------|
| `feed:<userId>` | List | Stores tweet IDs in display order. |
| `feed:cursor:<userId>` | Integer | Tracks how many businesses have been processed. |

---

## 🕒 Cache Management
- **TTL (Time-To-Live):** Each user’s feed queue expires automatically after ~1 hour (or per session).  
- **Queue Cap:** Optionally trim the queue to 100–150 items to prevent memory overflow:  
  ```js
  await redisClient.lTrim(`feed:${userId}`, -100, -1);
