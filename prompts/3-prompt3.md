## Validação da Modelagem Proposta

Valide a modelagem proposta respondendo às perguntas abaixo.  
Confirme se a modelagem garante **todos os pontos** e explique exatamente como, citando **classes/campos**, **ACL/CLP/Pointer Permissions** e exemplos de chamadas **REST**.

---

### ✅ Requisitos a validar

1. Usuários autenticados gerenciam **seus próprios Clientes e Notas**  
2. Cada **Nota** pertence a um **Cliente específico**  
3. **Isolamento total** de dados por usuário  
4. **Operações CRUD completas** (com paginação, ordenação e busca)  

---

### 📝 Estrutura de explicação esperada

1. **Resumo em tabela**  
   - Requisito → Mecanismo (ACL/CLP/Pointer/Trigger) → Onde configurar → Exemplo  

2. **Classes e campos (MongoDB 3.6 / Back4App Parse)**  
   - `_User` (padrão do Back4App/Parse)  
   - `Cliente`:  
     - `owner: Pointer<_User>`  
     - `nome: String`  
     - `email: String`  
     - `telefone: String`  
   - `Nota`:  
     - `owner: Pointer<_User>`  
     - `cliente: Pointer<Cliente>`  
     - `titulo: String`  
     - `conteudo: String`  

3. **Segurança (CLP e ACL)**  
   - `Cliente` CLP esperado:  
     - `find/create/update/delete` somente **Authenticated**  
     - **Pointer Permissions** em `owner` para leitura/escrita  
   - `Nota` CLP esperado:  
     - Igual ao Cliente + **Pointer Permission** em `cliente` (se necessário)  
   - Explicar quando usar **ACL por registro** (setando `owner` como read/write) além do CLP  

4. **Garantia de “Nota pertence ao Cliente do mesmo dono”**  
   - Exemplo de `beforeSave` trigger em `Nota`:  
     - Verifica `request.user` autenticado  
     - Carrega o `cliente` informado  
     - Bloqueia se `cliente.owner.objectId !== request.user.id`  

5. **Isolamento por usuário nas consultas**  
   - Exemplo REST query:  
     ```json
     where={ "owner": { "__type": "Pointer", "className": "_User", "objectId": "<currentUserId>" } }
     ```
   - Sempre com `X-Parse-Session-Token` válido  
   - Sem token válido → servidor retorna 403 (acesso negado)  

6. **CRUD completo (com exemplos)**  
   - **CREATE Cliente** (setando `owner` e ACL)  
   - **CREATE Nota** (setando `owner`, `cliente` e validando no trigger)  
   - **READ** com paginação (`limit`, `skip`) e ordenação (`order`)  
   - **UPDATE/DELETE** respeitando ACL/CLP  

7. **Exclusão em cascata (opcional, recomendado)**  
   - `beforeDelete` em `Cliente` remove automaticamente as `Notas` do mesmo `owner` vinculadas ao cliente  

8. **Índices recomendados (MongoDB 3.6)**  
   - `Cliente.owner`  
   - `Nota.owner`  
   - `Nota.cliente`  

9. **Erros e cenários-limite**  
   - Tentar criar `Nota` com `cliente` de outro usuário → operação bloqueada  
   - Sessão expirada → retorno `401/403`, tratar no frontend com fluxo de login  

---

### 📋 Checklist final

- [ ] Usuários autenticados gerenciam seus próprios Clientes e Notas → mecanismo: ACL/CLP + owner pointer  
- [ ] Cada Nota pertence a um Cliente específico → mecanismo: pointer + beforeSave trigger  
- [ ] Isolamento total de dados por usuário → mecanismo: session token + pointer permissions  
- [ ] Operações CRUD completas → mecanismo: Parse REST API + ACL/CLP

