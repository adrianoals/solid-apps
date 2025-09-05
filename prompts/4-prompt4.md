Certo! Antes de começar a criar o novo App **DesafioSolidApps** no Back4App,  
quero que você **primeiro prepare a documentação de implementação**.

➡️ Crie um ou mais arquivos na pasta `docs/implementation` que funcionem como **guia técnico e checklist** da implementação.  

Essa documentação deve conter:

1. **Pré-requisitos**  
   - Conta Back4App configurada  
   - Servidor MCP ativo  
   - Tokens e credenciais de acesso  
   - Dependências ou configurações iniciais necessárias  

2. **Modelagem de Dados**  
   - Classes a serem criadas (`Cliente`, `Nota`, uso de `_User`)  
   - Campos, tipos e relações  
   - Restrições de obrigatoriedade  

3. **Configuração de Segurança**  
   - CLP de cada classe  
   - ACL por registro (owner)  
   - Pointer Permissions  
   - JSON esperado das permissões  

4. **Triggers e Lógicas de Validação**  
   - `beforeSave` em `Nota` para validar se pertence ao Cliente do mesmo usuário  
   - `beforeDelete` em `Cliente` para remover Notas associadas  
   - Tratamento de sessão expirada  

5. **CRUD Examples (REST)**  
   - CREATE Cliente/Nota (payloads de exemplo)  
   - READ com paginação/ordenação/busca  
   - UPDATE/DELETE respeitando ACL/CLP  

6. **Índices e Performance**  
   - Índices em `Cliente.owner`, `Nota.owner`, `Nota.cliente`  
   - Recomendações de consulta  

7. **Erros e Cenários-Limite**  
   - Nota criada para Cliente de outro usuário → bloqueada  
   - Sessão expirada (401/403) → fluxo de tratamento no frontend  

---

⚠️ Só depois de termos essa documentação completa e validada, partiremos para a implementação prática no Back4App.
