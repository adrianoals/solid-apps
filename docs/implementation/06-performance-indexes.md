# Performance and Indexes - Solid Apps Challenge

## 1. Overview

Performance optimization is crucial to ensure good user experience, especially with large data volumes.

### Optimization Strategies
- **MongoDB Indexes**: Speed up frequent queries
- **Efficient Pagination**: Reduce data transfer
- **Cache**: Reduce server load
- **Optimized Queries**: Minimize processing

## 2. MongoDB 3.6 Indexes

### Indexes for Class `Client`

#### Main Compound Index
```javascript
// Index for user queries + sorting
db.Client.createIndex({
  "owner": 1,
  "name": 1
}, {
  "name": "owner_name_idx",
  "background": true
});
```

#### Index for Email Search
```javascript
// Index for unique email validation per user
db.Client.createIndex({
  "owner": 1,
  "email": 1
}, {
  "name": "owner_email_idx",
  "background": true,
  "unique": true
});
```

#### Index for Date Sorting
```javascript
// Index for sorting by creation date
db.Client.createIndex({
  "owner": 1,
  "createdAt": -1
}, {
  "name": "owner_createdAt_idx",
  "background": true
});
```

#### Index for Text Search
```javascript
// Text index for name search
db.Client.createIndex({
  "name": "text"
}, {
  "name": "name_text_idx",
  "background": true,
  "weights": {
    "name": 10
  }
});
```

### Indexes for Class `Note`

#### Main Compound Index
```javascript
// Index for user + client + sorting queries
db.Note.createIndex({
  "owner": 1,
  "client": 1,
  "createdAt": -1
}, {
  "name": "owner_client_createdAt_idx",
  "background": true
});
```

#### Index for Client Search
```javascript
// Index to list notes from a specific client
db.Note.createIndex({
  "client": 1,
  "createdAt": -1
}, {
  "name": "client_createdAt_idx",
  "background": true
});
```

#### Index for Text Search
```javascript
// Text index for title and content search
db.Note.createIndex({
  "title": "text",
  "content": "text"
}, {
  "name": "title_content_text_idx",
  "background": true,
  "weights": {
    "title": 10,
    "content": 5
  }
});
```

#### Index for User Filters
```javascript
// Index for general user queries
db.Note.createIndex({
  "owner": 1,
  "createdAt": -1
}, {
  "name": "owner_createdAt_idx",
  "background": true
});
```

## 3. Index Creation Script

### File: `scripts/create-indexes.js`

```javascript
const Parse = require('parse/node');

// Configuration
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;

async function createIndexes() {
  console.log('🚀 Creating indexes for performance optimization...');

  // Indexes for Client
  const clientIndexes = [
    {
      name: 'owner_name_idx',
      key: { owner: 1, name: 1 },
      options: { background: true }
    },
    {
      name: 'owner_email_idx',
      key: { owner: 1, email: 1 },
      options: { background: true, unique: true }
    },
    {
      name: 'owner_createdAt_idx',
      key: { owner: 1, createdAt: -1 },
      options: { background: true }
    },
    {
      name: 'name_text_idx',
      key: { name: 'text' },
      options: { 
        background: true,
        weights: { name: 10 }
      }
    }
  ];

  // Indexes for Note
  const noteIndexes = [
    {
      name: 'owner_client_createdAt_idx',
      key: { owner: 1, client: 1, createdAt: -1 },
      options: { background: true }
    },
    {
      name: 'client_createdAt_idx',
      key: { client: 1, createdAt: -1 },
      options: { background: true }
    },
    {
      name: 'title_content_text_idx',
      key: { title: 'text', content: 'text' },
      options: { 
        background: true,
        weights: { title: 10, content: 5 }
      }
    },
    {
      name: 'owner_createdAt_idx',
      key: { owner: 1, createdAt: -1 },
      options: { background: true }
    }
  ];

  try {
    // Create indexes via Cloud Function
    await Parse.Cloud.run('createIndexes', {
      collection: 'Client',
      indexes: clientIndexes
    });
    console.log('✅ Client class indexes created');

    await Parse.Cloud.run('createIndexes', {
      collection: 'Note',
      indexes: noteIndexes
    });
    console.log('✅ Note class indexes created');

    console.log('🎉 All indexes created successfully!');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

createIndexes();
```

### Cloud Function for Index Creation

```javascript
// File: cloud-code/functions/createIndexes.js
Parse.Cloud.define('createIndexes', async (request) => {
  const { collection, indexes } = request.params;
  
  if (!collection || !indexes) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 
      'Collection and indexes are required');
  }

  const results = [];
  
  for (const index of indexes) {
    try {
      // Use MongoDB driver directly
      const db = Parse.CoreManager.getDatabaseController().database;
      await db.collection(collection).createIndex(index.key, index.options);
      
      results.push({
        name: index.name,
        status: 'created',
        key: index.key
      });
      
      console.log(`Index ${index.name} created for ${collection}`);
    } catch (error) {
      results.push({
        name: index.name,
        status: 'error',
        error: error.message
      });
      
      console.error(`Error creating index ${index.name}:`, error);
    }
  }
  
  return results;
});
```

## 4. Optimized Queries

### Client Search with Performance

```javascript
// ❌ Slow query (without indexes)
const slowQuery = new Parse.Query("Client");
slowQuery.equalTo("owner", user);
slowQuery.matches("name", "John", "i");
slowQuery.ascending("name");
slowQuery.limit(20);

// ✅ Optimized query (with indexes)
const fastQuery = new Parse.Query("Client");
fastQuery.equalTo("owner", user);
fastQuery.matches("name", "John", "i");
fastQuery.ascending("name");
fastQuery.limit(20);
// Uses index: owner_name_idx
```

### Note Search by Client

```javascript
// ✅ Optimized query for client notes
const notesQuery = new Parse.Query("Note");
notesQuery.equalTo("client", clientPointer);
notesQuery.equalTo("owner", user);
notesQuery.descending("createdAt");
notesQuery.limit(10);
// Uses index: owner_client_createdAt_idx
```

### Efficient Text Search

```javascript
// ✅ Optimized text search
const textQuery = new Parse.Query("Note");
textQuery.equalTo("owner", user);
textQuery.fullText("title", "meeting");
textQuery.descending("createdAt");
textQuery.limit(20);
// Uses index: title_content_text_idx
```

## 5. Efficient Pagination

### Cursor Pagination (Recommended)

```javascript
// Cursor pagination implementation
class PaginationHelper {
  static async getClients(user, limit = 20, cursor = null) {
    const query = new Parse.Query("Client");
    query.equalTo("owner", user);
    query.ascending("createdAt");
    query.limit(limit);
    
    if (cursor) {
      query.greaterThan("createdAt", new Date(cursor));
    }
    
    const results = await query.find();
    
    return {
      data: results,
      nextCursor: results.length === limit ? 
        results[results.length - 1].get("createdAt").toISOString() : null,
      hasMore: results.length === limit
    };
  }
}
```

### Offset Pagination (Alternative)

```javascript
// Offset pagination implementation
class OffsetPaginationHelper {
  static async getClients(user, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const query = new Parse.Query("Client");
    query.equalTo("owner", user);
    query.ascending("name");
    query.limit(limit);
    query.skip(skip);
    
    const [results, count] = await Promise.all([
      query.find(),
      query.count()
    ]);
    
    return {
      data: results,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }
}
```

## 6. Cache Strategy

### Cache for Frequent Queries

```javascript
// Simple cache implementation
class QueryCache {
  constructor(ttl = 300000) { // 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Cache usage
const cache = new QueryCache();

async function getCachedClients(userId) {
  const cacheKey = `clients_${userId}`;
  let clients = cache.get(cacheKey);
  
  if (!clients) {
    const query = new Parse.Query("Client");
    query.equalTo("owner", { __type: "Pointer", className: "_User", objectId: userId });
    query.ascending("name");
    clients = await query.find();
    cache.set(cacheKey, clients);
  }
  
  return clients;
}
```

### Cache Invalidation

```javascript
// Invalidate cache after write operations
Parse.Cloud.afterSave("Client", async (request) => {
  const userId = request.user.id;
  cache.invalidate(`clients_${userId}`);
});

Parse.Cloud.afterDelete("Client", async (request) => {
  const userId = request.user.id;
  cache.invalidate(`clients_${userId}`);
});
```

## 7. Performance Monitoring

### Query Metrics

```javascript
// Cloud Function to monitor performance
Parse.Cloud.define('getQueryStats', async (request) => {
  const { className, timeRange = 24 } = request.params;
  
  // Simulate metrics collection
  const stats = {
    className,
    timeRange: `${timeRange}h`,
    totalQueries: 0,
    avgResponseTime: 0,
    slowQueries: [],
    indexUsage: {}
  };
  
  return stats;
});
```

### Performance Logs

```javascript
// Middleware for query logging
Parse.Cloud.beforeFind("*", async (request) => {
  const startTime = Date.now();
  request.startTime = startTime;
});

Parse.Cloud.afterFind("*", async (request) => {
  const endTime = Date.now();
  const duration = endTime - request.startTime;
  
  if (duration > 1000) { // Queries > 1s
    console.warn(`Slow query detected: ${request.className} took ${duration}ms`);
  }
  
  // Log for analysis
  console.log(`Query: ${request.className}, Duration: ${duration}ms, Results: ${request.objects.length}`);
});
```

## 8. Specific Optimizations

### Result Limitation

```javascript
// Limit results to avoid heavy queries
const MAX_RESULTS = 1000;

Parse.Cloud.beforeFind("*", async (request) => {
  if (request.limit > MAX_RESULTS) {
    request.limit = MAX_RESULTS;
  }
});
```

### Field Selection

```javascript
// Select only necessary fields
const query = new Parse.Query("Client");
query.equalTo("owner", user);
query.select("name", "email", "createdAt"); // Only necessary fields
query.limit(20);
```

### Efficient Aggregations

```javascript
// Use aggregations for counts
Parse.Cloud.define('getClientStats', async (request) => {
  const pipeline = [
    {
      $match: {
        owner: Parse.Object.extend("_User").createWithoutData(request.user.id).toPointer()
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        recent: {
          $sum: {
            $cond: [
              { $gte: ["$createdAt", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        }
      }
    }
  ];
  
  // Execute aggregation
  const result = await Parse.Cloud.run('aggregate', {
    collection: 'Client',
    pipeline: pipeline
  });
  
  return result[0] || { total: 0, recent: 0 };
});
```

## 9. Performance Configurations

### Back4App Configurations

```javascript
// Recommended configurations
const performanceConfig = {
  // Query limits
  maxQueryLimit: 1000,
  defaultQueryLimit: 20,
  
  // Timeouts
  queryTimeout: 30000, // 30s
  requestTimeout: 60000, // 60s
  
  // Cache
  enableQueryCache: true,
  cacheTTL: 300000, // 5 minutes
  
  // Indexes
  autoCreateIndexes: true,
  backgroundIndexCreation: true
};
```

### Client Configurations

```javascript
// Frontend configurations
const clientConfig = {
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Cache
  enableLocalCache: true,
  cacheExpiry: 300000, // 5 minutes
  
  // Retry
  maxRetries: 3,
  retryDelay: 1000, // 1s
  
  // Debounce for search
  searchDebounce: 300 // 300ms
};
```

## 10. Performance Checklist

### Index Creation
- [ ] Create compound indexes for frequent queries
- [ ] Create text indexes for search
- [ ] Create unique indexes for validations
- [ ] Configure background creation

### Query Optimization
- [ ] Implement efficient pagination
- [ ] Select only necessary fields
- [ ] Use appropriate filters
- [ ] Avoid N+1 queries

### Cache Implementation
- [ ] Configure query cache
- [ ] Implement cache invalidation
- [ ] Monitor cache hit rate
- [ ] Adjust TTL as needed

### Monitoring
- [ ] Implement performance logs
- [ ] Configure alerts for slow queries
- [ ] Monitor index usage
- [ ] Analyze usage metrics

---

**Status**: ✅ Complete documentation
**Next**: [07-error-scenarios.md](./07-error-scenarios.md)
