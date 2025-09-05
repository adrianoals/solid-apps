# Error Scenarios and Edge Cases - Solid Apps Challenge

## 1. Overview

This documentation covers all possible error scenarios and how to handle them properly in frontend and backend.

### Error Categories
- **Authentication**: Expired session, invalid credentials
- **Authorization**: Access denied, insufficient permissions
- **Validation**: Invalid data, required fields
- **Resources**: Object not found, conflicts
- **System**: Timeout, rate limiting, unavailability

## 2. Parse/Back4App Error Codes

### Authentication Errors (200-299)

#### 209 - Invalid Session Token
```json
{
  "code": 209,
  "error": "invalid session token"
}
```

**Cause**: Expired session or invalid token
**Frontend Treatment**:
```javascript
if (error.code === 209) {
  // Clear local data
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('userId');
  
  // Redirect to login
  window.location.href = '/login';
}
```

#### 208 - Session Missing
```json
{
  "code": 208,
  "error": "session token missing"
}
```

**Cause**: Missing session header
**Treatment**: Add session token to requests

### Validation Errors (100-199)

#### 142 - Validation Error
```json
{
  "code": 142,
  "error": "Name must have at least 2 characters"
}
```

**Cause**: Field validation failed
**Frontend Treatment**:
```javascript
if (error.code === 142) {
  // Show specific validation error
  showValidationError(error.error);
}
```

#### 137 - Duplicate Value
```json
{
  "code": 137,
  "error": "A client with this email already exists"
}
```

**Cause**: Uniqueness violation
**Treatment**: Check data before sending

### Authorization Errors (300-399)

#### 119 - Operation Forbidden
```json
{
  "code": 119,
  "error": "Note can only be created for user's own clients"
}
```

**Cause**: Attempt to access another user's data
**Treatment**: Check permissions before operation

#### 101 - Object Not Found
```json
{
  "code": 101,
  "error": "Object not found"
}
```

**Cause**: Object doesn't exist or doesn't belong to user
**Treatment**: Check if object exists and is accessible

## 3. Specific Error Scenarios

### Attempt to Create Note for Another User's Client

#### Scenario
```javascript
// User A tries to create note for User B's client
const note = new Parse.Object("Note");
note.set("title", "Test Note");
note.set("content", "Test content");
note.set("client", userBClient); // ❌ Another user's client
await note.save();
```

#### Server Response
```json
{
  "code": 119,
  "error": "Note can only be created for user's own clients"
}
```

#### Frontend Treatment
```javascript
try {
  await note.save();
} catch (error) {
  if (error.code === 119) {
    showError("You can only create notes for your own clients");
    // Reload valid clients list
    loadUserClients();
  }
}
```

### Session Expired During Operation

#### Scenario
```javascript
// User is working and session expires
const clients = await new Parse.Query("Client").find();
// ❌ Session expired during operation
```

#### Server Response
```json
{
  "code": 209,
  "error": "invalid session token"
}
```

#### Automatic Treatment
```javascript
class APIClient {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 1;
  }

  async makeRequest(url, options) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401) {
        const error = await response.json();
        if (error.code === 209) {
          return this.handleSessionExpired();
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async handleSessionExpired() {
    // Clear local data
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userId');
    
    // Show session expired modal
    showSessionExpiredModal();
    
    // Redirect to login after confirmation
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
}
```

### Rate Limiting Exceeded

#### Scenario
```javascript
// Too many requests in short time
for (let i = 0; i < 1000; i++) {
  await new Parse.Query("Client").find(); // ❌ Rate limit exceeded
}
```

#### Server Response
```json
{
  "code": 155,
  "error": "Request limit exceeded. Try again in a few minutes."
}
```

#### Treatment with Retry
```javascript
async function apiCallWithRetry(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.code === 155) { // Rate limiting
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        console.log(`Rate limit exceeded. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Duplicate Email Validation

#### Scenario
```javascript
// Attempt to create client with existing email
const client1 = new Parse.Object("Client");
client1.set("name", "Client 1");
client1.set("email", "test@email.com");
await client1.save(); // ✅ Success

const client2 = new Parse.Object("Client");
client2.set("name", "Client 2");
client2.set("email", "test@email.com"); // ❌ Duplicate email
await client2.save();
```

#### Server Response
```json
{
  "code": 137,
  "error": "A client with this email already exists"
}
```

#### Frontend Treatment
```javascript
async function createClient(data) {
  try {
    const client = new Parse.Object("Client");
    client.set("name", data.name);
    client.set("email", data.email);
    client.set("phone", data.phone);
    
    await client.save();
    showSuccess("Client created successfully!");
    
  } catch (error) {
    if (error.code === 137) {
      showError("A client with this email already exists. Choose another email.");
      // Highlight email field
      highlightField('email');
    } else if (error.code === 142) {
      showValidationError(error.error);
    } else {
      showError("Unexpected error. Try again.");
    }
  }
}
```

## 4. Tratamento de Erros no Frontend

### Classe de Tratamento de Erros

```javascript
class ErrorHandler {
  static handle(error) {
    console.error('API Error:', error);
    
    switch (error.code) {
      case 209:
        return this.handleSessionExpired();
      
      case 208:
        return this.handleSessionMissing();
      
      case 119:
        return this.handleForbidden(error.error);
      
      case 101:
        return this.handleNotFound(error.error);
      
      case 142:
        return this.handleValidationError(error.error);
      
      case 137:
        return this.handleDuplicateValue(error.error);
      
      case 155:
        return this.handleRateLimit(error.error);
      
      default:
        return this.handleGenericError(error);
    }
  }

  static handleSessionExpired() {
    // Limpar dados locais
    localStorage.clear();
    
    // Mostrar modal de sessão expirada
    this.showModal({
      title: 'Sessão Expirada',
      message: 'Sua sessão expirou. Você será redirecionado para o login.',
      type: 'warning',
      onConfirm: () => {
        window.location.href = '/login';
      }
    });
  }

  static handleValidationError(message) {
    this.showToast({
      message: message,
      type: 'error',
      duration: 5000
    });
  }

  static handleForbidden(message) {
    this.showToast({
      message: 'Acesso negado: ' + message,
      type: 'error',
      duration: 5000
    });
  }

  static handleNotFound(message) {
    this.showToast({
      message: 'Recurso não encontrado: ' + message,
      type: 'warning',
      duration: 3000
    });
  }

  static handleDuplicateValue(message) {
    this.showToast({
      message: message,
      type: 'error',
      duration: 5000
    });
  }

  static handleRateLimit(message) {
    this.showToast({
      message: 'Muitas requisições. Aguarde um momento e tente novamente.',
      type: 'warning',
      duration: 5000
    });
  }

  static handleGenericError(error) {
    this.showToast({
      message: 'Erro inesperado. Tente novamente.',
      type: 'error',
      duration: 5000
    });
  }

  static showModal({ title, message, type, onConfirm }) {
    // Implementar modal de erro
    console.log(`Modal [${type}]: ${title} - ${message}`);
    if (onConfirm) onConfirm();
  }

  static showToast({ message, type, duration }) {
    // Implementar toast de notificação
    console.log(`Toast [${type}]: ${message}`);
  }
}
```

### Interceptor de Requisições

```javascript
class APIInterceptor {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Interceptar todas as requisições Parse
    const originalFetch = Parse.CoreManager.getRESTController().request;
    
    Parse.CoreManager.getRESTController().request = async (method, url, data, options) => {
      try {
        const response = await originalFetch.call(this, method, url, data, options);
        return response;
      } catch (error) {
        ErrorHandler.handle(error);
        throw error;
      }
    };
  }
}

// Inicializar interceptor
new APIInterceptor();
```

## 5. Validação de Dados no Frontend

### Validação de Cliente

```javascript
class ClienteValidator {
  static validate(dados) {
    const errors = {};

    // Validar nome
    if (!dados.name || dados.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (dados.name && dados.name.length > 100) {
      errors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    // Validar email
    if (!dados.email) {
      errors.email = 'Email é obrigatório';
    } else if (!this.isValidEmail(dados.email)) {
      errors.email = 'Email inválido';
    }

    // Validar telefone
    if (!dados.phone) {
      errors.phone = 'Telefone é obrigatório';
    } else if (!this.isValidPhone(dados.phone)) {
      errors.phone = 'Telefone inválido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}
```

### Validação de Nota

```javascript
class NotaValidator {
  static validate(dados) {
    const errors = {};

    // Validar título
    if (!dados.title || dados.title.trim().length < 1) {
      errors.title = 'Título é obrigatório';
    }

    if (dados.title && dados.title.length > 200) {
      errors.title = 'Título deve ter no máximo 200 caracteres';
    }

    // Validar conteúdo
    if (!dados.content || dados.content.trim().length < 1) {
      errors.content = 'Conteúdo é obrigatório';
    }

    if (dados.content && dados.content.length > 5000) {
      errors.content = 'Conteúdo deve ter no máximo 5000 caracteres';
    }

    // Validar cliente
    if (!dados.client) {
      errors.client = 'Cliente é obrigatório';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
```

## 6. Tratamento de Erros no Backend

### Logs de Erro

```javascript
// Cloud Function para logging de erros
Parse.Cloud.define('logError', async (request) => {
  const { error, context, userId } = request.params;
  
  const errorLog = {
    error: {
      message: error.message,
      code: error.code,
      stack: error.stack
    },
    context: context,
    userId: userId,
    timestamp: new Date(),
    userAgent: request.headers['user-agent'],
    ip: request.headers['x-forwarded-for'] || request.ip
  };
  
  try {
    await new Parse.Object("ErrorLog").save(errorLog);
  } catch (logError) {
    console.error('Erro ao salvar log:', logError);
  }
});
```

### Monitoramento de Erros

```javascript
// Middleware para capturar erros
Parse.Cloud.beforeSave("*", async (request) => {
  try {
    // Operação normal
  } catch (error) {
    // Log do erro
    await Parse.Cloud.run('logError', {
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack
      },
      context: {
        className: request.className,
        operation: 'beforeSave',
        objectId: request.object?.id
      },
      userId: request.user?.id
    });
    
    throw error;
  }
});
```

## 7. Error Scenario Tests

### Unit Tests

```javascript
describe('Error Scenarios', () => {
  test('should block note creation for another user\'s client', async () => {
    // Create user A and client
    const userA = await createTestUser('userA');
    const clientA = await createTestClient(userA, 'Client A');
    
    // Create user B
    const userB = await createTestUser('userB');
    
    // User B tries to create note for user A's client
    const note = new Parse.Object("Note");
    note.set("title", "Test Note");
    note.set("content", "Test content");
    note.set("client", clientA);
    
    // Should fail
    await expect(note.save({ sessionToken: userB.getSessionToken() }))
      .rejects.toThrow('Note can only be created for user\'s own clients');
  });

  test('should handle expired session', async () => {
    // Simulate expired session
    const expiredToken = 'expired_token';
    
    const query = new Parse.Query("Client");
    query.equalTo("owner", { __type: "Pointer", className: "_User", objectId: "user_id" });
    
    await expect(query.find({ sessionToken: expiredToken }))
      .rejects.toThrow('invalid session token');
  });
});
```

## 8. Error Handling Checklist

### Frontend
- [ ] Implement error handler class
- [ ] Configure request interceptors
- [ ] Implement data validation
- [ ] Configure retry logic
- [ ] Implement visual error feedback

### Backend
- [ ] Configure error logs
- [ ] Implement monitoring
- [ ] Configure error alerts
- [ ] Implement rate limiting
- [ ] Configure timeouts

### Tests
- [ ] Test common error scenarios
- [ ] Test expired session handling
- [ ] Test data validations
- [ ] Test rate limiting
- [ ] Test network scenarios

---

**Status**: ✅ Complete documentation
**Next**: Back4App Implementation
