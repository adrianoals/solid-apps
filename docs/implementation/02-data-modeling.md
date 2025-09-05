# Data Modeling - Solid Apps Challenge

## 1. Overview

The system uses 3 main classes to manage Clients and Notes with complete user isolation.

### Data Architecture
```
_User (Back4App System)
    ↓ (1:N)
Client (owner: Pointer<_User>)
    ↓ (1:N)
Note (owner: Pointer<_User>, client: Pointer<Client>)
```

## 2. Classe `_User` (Sistema Nativo)

### Descrição
Classe nativa do Back4App/Parse para gerenciamento de usuários e autenticação.

### Campos Nativos (Automáticos)
```javascript
{
  objectId: String,           // ObjectId único
  username: String,           // Nome de usuário único
  email: String,              // Email único
  password: String,           // Senha hasheada
  createdAt: Date,            // Data de criação
  updatedAt: Date,            // Data de atualização
  sessionToken: String,       // Token de sessão (gerenciado automaticamente)
  emailVerified: Boolean,     // Status de verificação de email
  authData: Object            // Dados de autenticação social (opcional)
}
```

### Configurações
- **ACL Padrão**: Público para leitura, proprietário para escrita
- **Validações**: Email único, username único
- **Segurança**: Senhas hasheadas automaticamente

## 3. Class `Client`

### Description
Stores information about each authenticated user's clients.

### Fields
```javascript
{
  objectId: String,           // Unique ObjectId (automatic)
  owner: Pointer<_User>,      // Owner (required)
  name: String,               // Client name (required)
  email: String,              // Client email (required)
  phone: String,              // Client phone (required)
  createdAt: Date,            // Creation date (automatic)
  updatedAt: Date             // Update date (automatic)
}
```

### Validations
- **name**: Required, minimum 2 characters, maximum 100
- **email**: Required, valid format, unique per user
- **phone**: Required, valid format
- **owner**: Required, must be the logged-in user

### Relations
- **owner**: Pointer to `_User` (1:N)
- **Notes**: Reverse relation with `Note` (1:N)

## 4. Class `Note`

### Description
Stores notes related to each user's clients.

### Fields
```javascript
{
  objectId: String,           // Unique ObjectId (automatic)
  owner: Pointer<_User>,      // Owner (required)
  client: Pointer<Client>,    // Related client (required)
  title: String,              // Note title (required)
  content: String,            // Note content (required)
  createdAt: Date,            // Creation date (automatic)
  updatedAt: Date             // Update date (automatic)
}
```

### Validations
- **title**: Required, minimum 1 character, maximum 200
- **content**: Required, minimum 1 character, maximum 5000
- **client**: Required, must belong to the logged-in user
- **owner**: Required, must be the logged-in user

### Relations
- **owner**: Pointer to `_User` (1:N)
- **client**: Pointer to `Client` (N:1)

## 5. Esquemas de Validação

### Client Schema
```javascript
const ClientSchema = {
  fields: {
    owner: {
      type: "Pointer",
      targetClass: "_User",
      required: true
    },
    name: {
      type: "String",
      required: true,
      minLength: 2,
      maxLength: 100
    },
    email: {
      type: "String",
      required: true,
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    },
    phone: {
      type: "String",
      required: true,
      pattern: "^[\\d\\s\\-\\+\\(\\)]+$"
    }
  }
};
```

### Note Schema
```javascript
const NoteSchema = {
  fields: {
    owner: {
      type: "Pointer",
      targetClass: "_User",
      required: true
    },
    client: {
      type: "Pointer",
      targetClass: "Client",
      required: true
    },
    title: {
      type: "String",
      required: true,
      minLength: 1,
      maxLength: 200
    },
    content: {
      type: "String",
      required: true,
      minLength: 1,
      maxLength: 5000
    }
  }
};
```

## 6. Índices Recomendados

### Client
```javascript
// Compound index for user queries
db.Client.createIndex({
  "owner": 1,
  "name": 1
});

// Index for email search
db.Client.createIndex({
  "owner": 1,
  "email": 1
});

// Index for date sorting
db.Client.createIndex({
  "owner": 1,
  "createdAt": -1
});
```

### Note
```javascript
// Compound index for client queries
db.Note.createIndex({
  "owner": 1,
  "client": 1,
  "createdAt": -1
});

// Index for text search
db.Note.createIndex({
  "title": "text",
  "content": "text"
});

// Index for sorting
db.Note.createIndex({
  "client": 1,
  "createdAt": -1
});
```

## 7. Queries Otimizadas

### Find User's Clients
```javascript
const query = new Parse.Query("Client");
query.equalTo("owner", Parse.User.current());
query.ascending("name");
query.limit(20);
query.skip(0);
```

### Find Client's Notes
```javascript
const query = new Parse.Query("Note");
query.equalTo("client", clientPointer);
query.equalTo("owner", Parse.User.current());
query.descending("createdAt");
```

### Text Search in Clients
```javascript
const query = new Parse.Query("Client");
query.equalTo("owner", Parse.User.current());
query.matches("name", "term", "i");
```

## 8. Relações e Integridade

### Referential Integrity
- **Client → _User**: Guaranteed by Pointer
- **Note → Client**: Guaranteed by Pointer + validation
- **Note → _User**: Guaranteed by Pointer + validation

### Cascade Deletion
- **Client deleted**: Related notes are removed
- **User deleted**: Clients and Notes are removed

### Business Validations
- Note can only be created for Client of the same user
- Client can only be accessed by its owner
- All operations require authentication

## 9. Considerações de Performance

### Paginação
- Limite padrão: 20 registros por página
- Máximo permitido: 100 registros por página
- Ordenação por índice para melhor performance

### Cache
- Queries frequentes podem ser cacheadas
- Invalidação automática em updates
- TTL configurável por tipo de query

### Monitoramento
- Logs de queries lentas (>100ms)
- Métricas de uso por usuário
- Alertas de performance

## 10. Checklist de Implementação

### Class Creation
- [ ] Create `Client` class with all fields
- [ ] Create `Note` class with all fields
- [ ] Configure correct data types
- [ ] Apply field validations

### Relations Configuration
- [ ] Configure `owner` Pointer in both classes
- [ ] Configure `client` Pointer in `Note`
- [ ] Test referential integrity

### Índices e Performance
- [ ] Criar índices compostos
- [ ] Configurar índices de texto
- [ ] Testar performance das queries

---

**Status**: ✅ Complete documentation
**Next**: [03-security-config.md](./03-security-config.md)
