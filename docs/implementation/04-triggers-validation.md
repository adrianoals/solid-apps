# Triggers and Validations - Solid Apps Challenge

## 1. Overview

Triggers implement business validations and ensure data integrity in real-time.

### Trigger Types
- **beforeSave**: Validations before saving
- **beforeDelete**: Cleanup before deleting
- **afterSave**: Actions after saving (optional)
- **afterDelete**: Actions after deleting (optional)

## 2. Trigger `beforeSave` - Client

### File: `cloud-code/triggers/beforeSave-Client.js`

```javascript
Parse.Cloud.beforeSave("Client", async (request) => {
  // 1. Check authentication
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "User not authenticated");
  }

  // 2. Field validations
  const name = request.object.get("name");
  const email = request.object.get("email");
  const phone = request.object.get("phone");

  // Validate name
  if (!name || name.trim().length < 2) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Name must have at least 2 characters");
  }

  if (name.length > 100) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Name must have at most 100 characters");
  }

  // Validate email
  if (!email || !isValidEmail(email)) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Invalid email");
  }

  // Validate phone
  if (!phone || !isValidPhone(phone)) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Invalid phone");
  }

  // 3. Check email uniqueness per user
  if (request.object.isNew()) {
    const existingClient = await new Parse.Query("Client")
      .equalTo("email", email)
      .equalTo("owner", request.user)
      .first();

    if (existingClient) {
      throw new Parse.Error(Parse.Error.DUPLICATE_VALUE, 
        "A client with this email already exists");
    }
  }

  // 4. Configure owner and ACL
  request.object.set("owner", request.user);
  
  const acl = new Parse.ACL();
  acl.setReadAccess(request.user, true);
  acl.setWriteAccess(request.user, true);
  request.object.setACL(acl);

  // 5. Normalize data
  request.object.set("name", name.trim());
  request.object.set("email", email.toLowerCase().trim());
  request.object.set("phone", normalizePhone(phone));
});

// Funções auxiliares
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}
```

## 3. Trigger `beforeSave` - Note

### File: `cloud-code/triggers/beforeSave-Note.js`

```javascript
Parse.Cloud.beforeSave("Note", async (request) => {
  // 1. Check authentication
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "User not authenticated");
  }

  // 2. Field validations
  const title = request.object.get("title");
  const content = request.object.get("content");
  const client = request.object.get("client");

  // Validate title
  if (!title || title.trim().length < 1) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Title is required");
  }

  if (title.length > 200) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Title must have at most 200 characters");
  }

  // Validate content
  if (!content || content.trim().length < 1) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Content is required");
  }

  if (content.length > 5000) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Content must have at most 5000 characters");
  }

  // Validate client
  if (!client) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Client is required");
  }

  // 3. Check if client belongs to user
  let clientObj;
  try {
    clientObj = await client.fetch();
  } catch (error) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 
      "Client not found");
  }

  if (clientObj.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Note can only be created for user's own clients");
  }

  // 4. Configure owner and ACL
  request.object.set("owner", request.user);
  
  const acl = new Parse.ACL();
  acl.setReadAccess(request.user, true);
  acl.setWriteAccess(request.user, true);
  request.object.setACL(acl);

  // 5. Normalize data
  request.object.set("title", title.trim());
  request.object.set("content", content.trim());
});
```

## 4. Trigger `beforeDelete` - Client

### File: `cloud-code/triggers/beforeDelete-Client.js`

```javascript
Parse.Cloud.beforeDelete("Client", async (request) => {
  // 1. Check authentication
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "User not authenticated");
  }

  // 2. Check if client belongs to user
  if (request.object.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Cannot delete another user's client");
  }

  // 3. Find and delete all related notes
  try {
    const notes = await new Parse.Query("Note")
      .equalTo("client", request.object)
      .equalTo("owner", request.user)
      .find();

    if (notes.length > 0) {
      console.log(`Deleting ${notes.length} notes from client ${request.object.id}`);
      await Parse.Object.destroyAll(notes);
    }
  } catch (error) {
    console.error("Error deleting client notes:", error);
    // Don't fail the operation because of notes
  }

  // 4. Log the operation
  console.log(`Client ${request.object.id} deleted by user ${request.user.id}`);
});
```

## 5. Trigger `beforeDelete` - Note

### File: `cloud-code/triggers/beforeDelete-Note.js`

```javascript
Parse.Cloud.beforeDelete("Note", async (request) => {
  // 1. Check authentication
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "User not authenticated");
  }

  // 2. Check if note belongs to user
  if (request.object.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Cannot delete another user's note");
  }

  // 3. Log the operation
  console.log(`Note ${request.object.id} deleted by user ${request.user.id}`);
});
```

## 6. Trigger `afterSave` - Client (Optional)

### File: `cloud-code/triggers/afterSave-Client.js`

```javascript
Parse.Cloud.afterSave("Client", async (request) => {
  // 1. Audit log
  const auditLog = {
    userId: request.user.id,
    operation: request.object.isNew() ? "CREATE" : "UPDATE",
    className: "Client",
    objectId: request.object.id,
    timestamp: new Date(),
    changes: request.object.dirtyKeys()
  };

  try {
    await new Parse.Object("AuditLog").save(auditLog);
  } catch (error) {
    console.error("Error saving audit log:", error);
  }

  // 2. Notification (optional)
  if (request.object.isNew()) {
    console.log(`New client created: ${request.object.get("name")}`);
  }
});
```

## 7. Trigger `afterSave` - Note (Optional)

### File: `cloud-code/triggers/afterSave-Note.js`

```javascript
Parse.Cloud.afterSave("Note", async (request) => {
  // 1. Audit log
  const auditLog = {
    userId: request.user.id,
    operation: request.object.isNew() ? "CREATE" : "UPDATE",
    className: "Note",
    objectId: request.object.id,
    clientId: request.object.get("client").id,
    timestamp: new Date(),
    changes: request.object.dirtyKeys()
  };

  try {
    await new Parse.Object("AuditLog").save(auditLog);
  } catch (error) {
    console.error("Error saving audit log:", error);
  }

  // 2. Update client note counter (optional)
  if (request.object.isNew()) {
    try {
      const client = await request.object.get("client").fetch();
      const currentCount = client.get("noteCount") || 0;
      client.set("noteCount", currentCount + 1);
      await client.save();
    } catch (error) {
      console.error("Error updating note counter:", error);
    }
  }
});
```

## 8. Global Validations

### File: `cloud-code/triggers/global-validations.js`

```javascript
// Expired session validation
Parse.Cloud.beforeSave(Parse.User, async (request) => {
  // This validation is applied to all classes
  if (request.user && request.user.getSessionToken()) {
    try {
      const session = await request.user.getSession();
      if (session.get("expiresAt") < new Date()) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 
          "Session expired");
      }
    } catch (error) {
      if (error.code === Parse.Error.INVALID_SESSION_TOKEN) {
        throw error;
      }
      // If can't verify session, allow (might be user creation)
    }
  }
});

// Global rate limiting
const rateLimitMap = new Map();

Parse.Cloud.beforeSave("*", async (request) => {
  if (!request.user) return;

  const userId = request.user.id;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute

  if (!rateLimitMap.has(userId)) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return;
  }

  const userLimit = rateLimitMap.get(userId);
  
  if (now > userLimit.resetTime) {
    userLimit.count = 1;
    userLimit.resetTime = now + windowMs;
    return;
  }

  if (userLimit.count >= maxRequests) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Request limit exceeded. Try again in a few minutes.");
  }

  userLimit.count++;
});
```

## 9. Trigger Deployment

### Deployment Script: `deploy-triggers.js`

```javascript
const Parse = require('parse/node');

Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;

async function deployTriggers() {
  const triggers = [
    'beforeSave-Client.js',
    'beforeSave-Note.js',
    'beforeDelete-Client.js',
    'beforeDelete-Note.js',
    'afterSave-Client.js',
    'afterSave-Note.js',
    'global-validations.js'
  ];

  for (const trigger of triggers) {
    try {
      const code = require(`./triggers/${trigger}`);
      await Parse.Cloud.define(trigger.replace('.js', ''), code);
      console.log(`✅ ${trigger} deployed successfully`);
    } catch (error) {
      console.error(`❌ Error deploying ${trigger}:`, error);
    }
  }
}

deployTriggers();
```

## 10. Trigger Tests

### File: `tests/triggers-test.js`

```javascript
const Parse = require('parse/node');

describe('Validation Triggers', () => {
  let testUser;
  let testClient;

  beforeAll(async () => {
    // Test setup
    testUser = await Parse.User.logIn("testuser", "testpass");
  });

  describe('beforeSave Client', () => {
    test('should validate required fields', async () => {
      const client = new Parse.Object("Client");
      
      await expect(client.save()).rejects.toThrow("Name must have at least 2 characters");
    });

    test('should validate unique email per user', async () => {
      const client1 = new Parse.Object("Client");
      client1.set("name", "Client 1");
      client1.set("email", "test@email.com");
      client1.set("phone", "11999999999");
      await client1.save();

      const client2 = new Parse.Object("Client");
      client2.set("name", "Client 2");
      client2.set("email", "test@email.com");
      client2.set("phone", "11888888888");
      
      await expect(client2.save()).rejects.toThrow("A client with this email already exists");
    });
  });

  describe('beforeSave Note', () => {
    test('should validate if client belongs to user', async () => {
      const note = new Parse.Object("Note");
      note.set("title", "Test");
      note.set("content", "Test content");
      note.set("client", testClient);
      
      // Simulate different user
      const otherUser = await Parse.User.logIn("otheruser", "otherpass");
      note.set("owner", otherUser);
      
      await expect(note.save()).rejects.toThrow("Note can only be created for user's own clients");
    });
  });

  describe('beforeDelete Client', () => {
    test('should delete related notes', async () => {
      const client = new Parse.Object("Client");
      client.set("name", "Test Client");
      client.set("email", "client@test.com");
      client.set("phone", "11777777777");
      await client.save();

      const note = new Parse.Object("Note");
      note.set("title", "Test Note");
      note.set("content", "Test content");
      note.set("client", client);
      await note.save();

      await client.destroy();
      
      const remainingNotes = await new Parse.Query("Note")
        .equalTo("client", client)
        .find();
      
      expect(remainingNotes).toHaveLength(0);
    });
  });
});
```

## 11. Implementation Checklist

### Trigger Creation
- [ ] Create `beforeSave-Client.js` file
- [ ] Create `beforeSave-Note.js` file
- [ ] Create `beforeDelete-Client.js` file
- [ ] Create `beforeDelete-Note.js` file
- [ ] Create `afterSave` files (optional)

### Deployment and Configuration
- [ ] Deploy triggers via MCP
- [ ] Configure triggers in Back4App
- [ ] Test trigger functionality
- [ ] Validate error logs

### Tests and Validation
- [ ] Run unit tests
- [ ] Test validation scenarios
- [ ] Validate cascade deletion
- [ ] Check audit logs

---

**Status**: ✅ Complete documentation
**Next**: [05-crud-examples.md](./05-crud-examples.md)
