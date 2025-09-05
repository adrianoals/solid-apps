# CRUD REST Examples - Solid Apps Challenge

## 1. Overview

This documentation contains complete examples of CRUD operations via Back4App REST API.

### Base URL
```
https://parseapi.back4app.com/classes/
```

### Required Headers
```http
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json
```

## 2. Authentication

### User Login
```http
POST https://parseapi.back4app.com/login
Content-Type: application/json

{
  "username": "user@email.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "objectId": "USER_ID",
  "username": "user@email.com",
  "email": "user@email.com",
  "sessionToken": "r:abc123def456",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### User Registration
```http
POST https://parseapi.back4app.com/users
Content-Type: application/json

{
  "username": "new@email.com",
  "email": "new@email.com",
  "password": "password123"
}
```

## 3. CRUD - Client

### CREATE Client

```http
POST https://parseapi.back4app.com/classes/Client
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json

{
  "name": "John Silva",
  "email": "john@company.com",
  "phone": "11999999999"
}
```

**Success Response:**
```json
{
  "objectId": "CLIENT_ID",
  "name": "John Silva",
  "email": "john@company.com",
  "phone": "11999999999",
  "owner": {
    "__type": "Pointer",
    "className": "_User",
    "objectId": "USER_ID"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### READ Client (List with Pagination)

```http
GET https://parseapi.back4app.com/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&order=name&limit=20&skip=0
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

**Success Response:**
```json
{
  "results": [
    {
      "objectId": "CLIENT_ID_1",
      "name": "Ana Santos",
      "email": "ana@company.com",
      "phone": "11888888888",
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "USER_ID"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### READ Client (Search by Name)

```http
GET https://parseapi.back4app.com/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"},"name":{"$regex":"John","$options":"i"}}
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

### READ Client (By ID)

```http
GET https://parseapi.back4app.com/classes/Client/CLIENT_ID
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

### UPDATE Client

```http
PUT https://parseapi.back4app.com/classes/Client/CLIENT_ID
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json

{
  "name": "John Santos Silva",
  "phone": "11999999988"
}
```

**Success Response:**
```json
{
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

### DELETE Client

```http
DELETE https://parseapi.back4app.com/classes/Client/CLIENT_ID
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

**Success Response:**
```json
{}
```

## 4. CRUD - Note

### CREATE Note

```http
POST https://parseapi.back4app.com/classes/Note
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json

{
  "title": "First meeting",
  "content": "Client showed interest in product X. Schedule next meeting for next week.",
  "client": {
    "__type": "Pointer",
    "className": "Client",
    "objectId": "CLIENT_ID"
  }
}
```

**Success Response:**
```json
{
  "objectId": "NOTE_ID",
  "title": "First meeting",
  "content": "Client showed interest in product X. Schedule next meeting for next week.",
  "client": {
    "__type": "Pointer",
    "className": "Client",
    "objectId": "CLIENT_ID"
  },
  "owner": {
    "__type": "Pointer",
    "className": "_User",
    "objectId": "USER_ID"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### READ Note (By Client)

```http
GET https://parseapi.back4app.com/classes/Note?where={"client":{"__type":"Pointer","className":"Client","objectId":"CLIENT_ID"},"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&order=-createdAt&limit=10&skip=0
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

**Success Response:**
```json
{
  "results": [
    {
      "objectId": "NOTE_ID_1",
      "title": "First meeting",
      "content": "Client showed interest in product X...",
      "client": {
        "__type": "Pointer",
        "className": "Client",
        "objectId": "CLIENT_ID"
      },
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "USER_ID"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### READ Note (Text Search)

```http
GET https://parseapi.back4app.com/classes/Note?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"},"$or":[{"title":{"$regex":"meeting","$options":"i"}},{"content":{"$regex":"meeting","$options":"i"}}]}
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

### READ Note (By ID)

```http
GET https://parseapi.back4app.com/classes/Note/NOTE_ID
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

### UPDATE Note

```http
PUT https://parseapi.back4app.com/classes/Note/NOTE_ID
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json

{
  "title": "First meeting - Updated",
  "content": "Client showed interest in product X. Schedule next meeting for next week. Client requested commercial proposal."
}
```

### DELETE Note

```http
DELETE https://parseapi.back4app.com/classes/Note/NOTE_ID
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

## 5. Advanced Queries

### Search with Multiple Filters

```http
GET https://parseapi.back4app.com/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"},"name":{"$regex":"John","$options":"i"},"email":{"$regex":"@company.com","$options":"i"}}&order=-createdAt&limit=10
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

### Record Count

```http
GET https://parseapi.back4app.com/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&count=1&limit=0
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

**Response:**
```json
{
  "results": [],
  "count": 25
}
```

### Include Related Data

```http
GET https://parseapi.back4app.com/classes/Note?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&include=client&limit=10
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
```

**Response:**
```json
{
  "results": [
    {
      "objectId": "NOTE_ID",
      "title": "First meeting",
      "content": "Note content...",
      "client": {
        "objectId": "CLIENT_ID",
        "name": "John Silva",
        "email": "john@company.com",
        "phone": "11999999999"
      },
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "USER_ID"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 6. Batch Operations

### CREATE Multiple Clients

```http
POST https://parseapi.back4app.com/batch
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json

{
  "requests": [
    {
      "method": "POST",
      "path": "/classes/Client",
      "body": {
        "name": "Client 1",
        "email": "client1@email.com",
        "phone": "11111111111"
      }
    },
    {
      "method": "POST",
      "path": "/classes/Client",
      "body": {
        "name": "Client 2",
        "email": "client2@email.com",
        "phone": "22222222222"
      }
    }
  ]
}
```

### UPDATE Multiple Notes

```http
POST https://parseapi.back4app.com/batch
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json

{
  "requests": [
    {
      "method": "PUT",
      "path": "/classes/Note/NOTE_ID_1",
      "body": {
        "title": "Updated title 1"
      }
    },
    {
      "method": "PUT",
      "path": "/classes/Note/NOTE_ID_2",
      "body": {
        "title": "Updated title 2"
      }
    }
  ]
}
```

## 7. Efficient Pagination

### Cursor Pagination Implementation

```javascript
// First page
const firstPage = await fetch('/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&order=createdAt&limit=20');

// Next page using createdAt of last item
const lastItem = firstPage.results[firstPage.results.length - 1];
const nextPage = await fetch(`/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"},"createdAt":{"$gt":{"__type":"Date","iso":"${lastItem.createdAt}"}}}&order=createdAt&limit=20`);
```

### Offset Pagination Implementation

```javascript
// Page 1 (offset 0)
const page1 = await fetch('/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&limit=20&skip=0');

// Page 2 (offset 20)
const page2 = await fetch('/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"USER_ID"}}&limit=20&skip=20');
```

## 8. Error Handling

### Common Error Codes

```javascript
// 400 - Bad Request
{
  "code": 400,
  "error": "Invalid JSON"
}

// 401 - Unauthorized
{
  "code": 209,
  "error": "invalid session token"
}

// 403 - Forbidden
{
  "code": 119,
  "error": "Note can only be created for user's own clients"
}

// 404 - Not Found
{
  "code": 101,
  "error": "Object not found"
}

// 409 - Conflict
{
  "code": 137,
  "error": "A client with this email already exists"
}

// 422 - Validation Error
{
  "code": 142,
  "error": "Name must have at least 2 characters"
}
```

### Retry Implementation

```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401) {
        // Session expired - redirect to login
        window.location.href = '/login';
        return;
      }
      
      if (response.status >= 500) {
        // Server error - try again
        if (i === maxRetries - 1) throw new Error('Max retries exceeded');
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## 9. Bubble Integration Examples

### API Connector Configuration

```javascript
// Base configuration
const baseURL = 'https://parseapi.back4app.com';
const headers = {
  'X-Parse-Application-Id': 'YOUR_APP_ID',
  'X-Parse-Session-Token': '[Session Token]',
  'Content-Type': 'application/json'
};
```

### Login Workflow

```javascript
// 1. Login
const loginResponse = await fetch(`${baseURL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: '[Email]',
    password: '[Password]'
  })
});

const userData = await loginResponse.json();

// 2. Save session token
localStorage.setItem('sessionToken', userData.sessionToken);
localStorage.setItem('userId', userData.objectId);
```

### Client List Workflow

```javascript
// Fetch clients
const clientsResponse = await fetch(`${baseURL}/classes/Client?where={"owner":{"__type":"Pointer","className":"_User","objectId":"${localStorage.getItem('userId')}"}}&order=name&limit=20`, {
  headers: {
    'X-Parse-Application-Id': 'YOUR_APP_ID',
    'X-Parse-Session-Token': localStorage.getItem('sessionToken')
  }
});

const clients = await clientsResponse.json();
```

## 10. Implementation Checklist

### API Configuration
- [ ] Configure Back4App base URL
- [ ] Configure required headers
- [ ] Implement error handling
- [ ] Configure retry logic

### CRUD Operations
- [ ] Implement CREATE for Client and Note
- [ ] Implement READ with pagination
- [ ] Implement UPDATE for both
- [ ] Implement DELETE for both

### Advanced Features
- [ ] Implement text search
- [ ] Implement sorting
- [ ] Implement multiple filters
- [ ] Implement batch operations

### Frontend Integration
- [ ] Configure API Connector in Bubble
- [ ] Implement authentication workflows
- [ ] Implement CRUD workflows
- [ ] Implement error handling in UI

---

**Status**: ✅ Complete documentation
**Next**: [06-performance-indexes.md](./06-performance-indexes.md)
