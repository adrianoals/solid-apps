# Execução Guiada: Criar Backend no Back4App via MCP (novo app do zero)

## Objetivo
Criar **um novo app** no Back4App (mesmo que já exista outro com a mesma modelagem) e implementar todo o backend **seguindo estritamente** a documentação em `docs/implementation`.

## Regras
- Crie **um app novo do zero**. Não reutilize apps existentes.
- Nome base: **DesafioSolidApps**.  
  - Se já existir, use o padrão: `DesafioSolidApps-<YYYYMMDD-HHMM>`.
- **Não avance** de etapa sem concluir e registrar evidências da etapa atual.
- Siga **exatamente** os arquivos em `docs/implementation` como fonte da verdade.

## Artefatos & Evidências (obrigatório)
Grave tudo em `docs/implementation/_artefatos/`:
- `app.json` (metadados do app; ofusque chaves quando necessário)
- `schema-export.json` (schema atual)
- `clp.json` (permissões por classe)
- `curl.http` (coleção de chamadas REST testadas)
- `exec.log` (passo-a-passo com timestamps, status e observações)
- `report.md` (resumo final: o que foi criado, testes feitos, decisões, pendências)

---

## Sequência Obrigatória (seguir docs/implementation)

### 1) Pré-requisitos → `01-prerequisites.md`
- Validar conta, credenciais, conexão MCP e estrutura do projeto.
- **Saída**: `exec.log` com checklist ✅ e teste de conectividade.

### 2) Criação do App (novo, do zero)
- Criar um **novo** app (nome base acima).
- Capturar `applicationId`, `serverURL` e demais chaves.
- **Saída**: `app.json` (com chaves ofuscadas); log no `exec.log`.

### 3) Modelagem de Dados → `02-data-modeling.md`
- Criar classes e campos conforme especificado:
  - `_User` (padrão do Parse/Back4App)
  - `Cliente`: `owner (Pointer<_User>)`, `name (String)`, `email (String)`, `phone (String)`
  - `Nota`: `owner (Pointer<_User>)`, `client (Pointer<Cliente>)`, `title (String)`, `content (String)`
- **Saída**: `schema-export.json` + logs.

### 4) Segurança (CLP/ACL/Pointer) → `03-security-config.md`
- Aplicar CLP por classe (find/create/update/delete apenas autenticado).
- Ativar Pointer Permissions conforme docs.
- Definir ACL por registro (owner read/write) nos saves.
- **Saída**: `clp.json` com estado final; evidências de testes.

### 5) Triggers & Validações → `04-triggers-validation.md`
- Implementar `beforeSave`/`beforeDelete` conforme documentação, incluindo:
  - Nota só pode ser criada se `client.owner == request.user`.
  - Exclusão de `Cliente` remove notas associadas do mesmo owner (quando previsto).
- **Saída**: arquivos de Cloud Code gerados + logs de deploy.

### 6) CRUD (REST) → `05-crud-examples.md`
- Testar fluxos de autenticação, CREATE/READ/UPDATE/DELETE para `Cliente` e `Nota`.
- Incluir paginação (`limit`, `skip`) e ordenação (`order`).
- **Saída**: `curl.http` com requisições e respostas validadas.

### 7) Performance & Índices → `06-performance-indexes.md`
- Criar índices especificados para `Cliente` e `Nota`.
- Documentar configurações e validações.
- **Saída**: logs e confirmação dos índices.

### 8) Erros & Cenários-Limite → `07-error-scenarios.md`
- Validar cenários: sessão expirada, tentativa de acessar dados de outro usuário, conflitos/validações.
- **Saída**: evidências (respostas de erro), instruções de tratamento no frontend (anotadas em `report.md`).

---

## Critérios de Conclusão (checklist final)
- [ ] Usuários autenticados gerenciam **apenas seus próprios** Clientes e Notas.  
- [ ] **Cada Nota** pertence a **um Cliente específico** do **mesmo owner**.  
- [ ] **Isolamento total** de dados por usuário garantido por CLP/ACL/Pointer/Triggers.  
- [ ] **CRUD completo** com paginação, ordenação e busca funcional.  
- [ ] Índices criados e consultas performáticas validadas.  
- [ ] `report.md` gerado com resumo, testes e pendências (se houver).

> Observação: Se qualquer etapa divergir dos docs, **pare**, registre no `exec.log`, ajuste a documentação e só então prossiga.
