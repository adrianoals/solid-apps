# Security Configuration - Solid Apps Challenge

## 1. Overview

Security is implemented in multiple layers to ensure complete data isolation per user.

### Security Layers
1. **CLP (Class Level Permissions)** - Class-level permissions
2. **ACL (Access Control Lists)** - Record-level permissions
3. **Pointer Permissions** - Ownership validation via Pointers
4. **Triggers** - Real-time business validations

## 2. CLP (Class Level Permissions)

### Class `Client`

#### Configuration JSON
```json
{
  "find": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  },
  "create": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  },
  "update": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  },
  "delete": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  }
}
```

#### Permissions Explanation
- **requiresAuthentication**: Must be logged in
- **where**: Automatic filter by `owner` = logged-in user
- **$request.user.id**: Automatic variable of the request user

### Class `Note`

#### Configuration JSON
```json
{
  "find": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  },
  "create": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  },
  "update": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  },
  "delete": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  }
}
```

## 3. ACL (Access Control Lists)

### Configuração por Registro

#### Client ACL
```javascript
// In Client beforeSave
const acl = new Parse.ACL();
acl.setReadAccess(request.user, true);
acl.setWriteAccess(request.user, true);
object.setACL(acl);
```

#### Note ACL
```javascript
// In Note beforeSave
const acl = new Parse.ACL();
acl.setReadAccess(request.user, true);
acl.setWriteAccess(request.user, true);
object.setACL(acl);
```

### Estrutura do ACL
```javascript
{
  "objectId": {
    "read": {
      "user_id": true
    },
    "write": {
      "user_id": true
    }
  }
}
```

## 4. Pointer Permissions

### Validação de Propriedade

#### Client - Ensure Owner
```javascript
// In Client beforeSave
if (object.isNew()) {
  object.set("owner", request.user);
} else {
  // Check if owner was not changed
  const original = await object.fetch();
  if (original.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Cannot change client owner");
  }
}
```

#### Note - Validate Client and Owner
```javascript
// In Note beforeSave
if (object.isNew()) {
  // Check if client belongs to user
  const client = await object.get("client").fetch();
  if (client.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Note can only be created for user's own clients");
  }
  object.set("owner", request.user);
} else {
  // Check if owner was not changed
  const original = await object.fetch();
  if (original.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Cannot change note owner");
  }
}
```

## 5. Configuração no Back4App

### Via Dashboard
1. Access **App Settings** → **Security**
2. Select the class (`Client` or `Note`)
3. Configure **Class Level Permissions**
4. Apply the JSON configurations

### Via API (Programmatic)
```javascript
// Configure CLP via API
const config = {
  "find": {
    "requiresAuthentication": true,
    "where": {
      "owner": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "$request.user.id"
      }
    }
  }
  // ... other permissions
};

// Apply configuration
await Parse.Config.save(config);
```

## 6. Validações de Segurança

### Required Authentication
```javascript
// Check if user is logged in
if (!request.user) {
  throw new Parse.Error(Parse.Error.SESSION_MISSING, 
    "User not authenticated");
}
```

### Session Validation
```javascript
// Check if session is valid
const session = await request.user.getSession();
if (!session || session.get("expiresAt") < new Date()) {
  throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 
    "Session expired");
}
```

### Rate Limiting
```javascript
// Implementar rate limiting por usuário
const userRequests = await Parse.Config.get("userRequests");
if (userRequests[request.user.id] > 1000) { // 1000 req/hora
  throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
    "Limite de requisições excedido");
}
```

## 7. Headers de Segurança

### Required Headers
```http
X-Parse-Application-Id: YOUR_APP_ID
X-Parse-Session-Token: USER_SESSION_TOKEN
Content-Type: application/json
```

### Header Validation
```javascript
// Check required headers
const appId = request.headers['x-parse-application-id'];
const sessionToken = request.headers['x-parse-session-token'];

if (!appId || appId !== process.env.APP_ID) {
  throw new Parse.Error(Parse.Error.INVALID_APPLICATION_ID, 
    "Invalid Application ID");
}

if (!sessionToken) {
  throw new Parse.Error(Parse.Error.SESSION_MISSING, 
    "Session token required");
}
```

## 8. Logs de Segurança

### Access Auditing
```javascript
// Log sensitive operations
const auditLog = {
  userId: request.user.id,
  operation: request.operation,
  className: request.className,
  objectId: request.object?.id,
  timestamp: new Date(),
  ip: request.headers['x-forwarded-for'] || request.ip
};

await new Parse.Object("AuditLog").save(auditLog);
```

### Attempt Monitoring
```javascript
// Detect suspicious attempts
const suspiciousPatterns = [
  "Multiple denied access attempts",
  "Attempt to access another user's data",
  "Rate limiting exceeded"
];

if (suspiciousPatterns.includes(pattern)) {
  // Alert administrators
  await Parse.Cloud.run("alertSecurity", { pattern, userId: request.user.id });
}
```

## 9. Testes de Segurança

### Test Scenarios
- [ ] Unauthenticated user tries to access data
- [ ] User tries to access another user's data
- [ ] Attempt to change record owner
- [ ] Creating note for another user's client
- [ ] Session expired during operation
- [ ] Invalid or missing headers

### Automatic Validation
```javascript
// Data isolation test
const testIsolation = async () => {
  const user1 = await Parse.User.logIn("user1", "pass1");
  const user2 = await Parse.User.logIn("user2", "pass2");
  
  // user1 should not be able to see user2's data
  const user2Data = await new Parse.Query("Client")
    .equalTo("owner", user2)
    .find({ sessionToken: user1.getSessionToken() });
  
  assert(user2Data.length === 0, "Data isolation failed");
};
```

## 10. Checklist de Implementação

### CLP Configuration
- [ ] Configure CLP for `Client` class
- [ ] Configure CLP for `Note` class
- [ ] Test find/create/update/delete permissions
- [ ] Validate user isolation

### ACL Implementation
- [ ] Configure ACL in `Client` beforeSave
- [ ] Configure ACL in `Note` beforeSave
- [ ] Test access to own records
- [ ] Test blocking access to others' records

### Business Validations
- [ ] Implement owner validation in `Client`
- [ ] Implement client validation in `Note`
- [ ] Test security violation scenarios
- [ ] Implement audit logs

### Security Tests
- [ ] Run isolation tests
- [ ] Validate expired session handling
- [ ] Test rate limiting
- [ ] Check security logs

---

**Status**: ✅ Complete documentation
**Next**: [04-triggers-validation.md](./04-triggers-validation.md)
