# Pré-requisitos - Desafio Solid Apps

## 1. Conta Back4App Configurada

### Verificações Necessárias
- [ ] Conta Back4App ativa e verificada
- [ ] Acesso ao dashboard administrativo
- [ ] Permissões para criar novos apps
- [ ] Conhecimento básico da interface Back4App

### Configurações de Conta
- **Plano**: Qualquer plano (incluindo gratuito)
- **Região**: Preferencialmente mais próxima ao usuário
- **Limites**: Verificar limites de requisições e armazenamento

## 2. Servidor MCP Ativo

### Status do MCP
- [ ] Servidor MCP Back4App configurado e rodando
- [ ] Conexão estabelecida com sucesso
- [ ] Ferramentas MCP disponíveis no ambiente

### Verificação de Conectividade
```bash
# Testar se o MCP está respondendo
# (será feito via ferramentas MCP disponíveis)
```

## 3. Tokens e Credenciais de Acesso

### Credenciais Necessárias
- [ ] **Application ID**: Identificador único do app
- [ ] **Master Key**: Chave mestra para operações administrativas
- [ ] **REST API Key**: Chave para chamadas REST (opcional)
- [ ] **JavaScript Key**: Chave para SDK JavaScript (opcional)

### Onde Obter as Credenciais
1. Acessar Back4App Dashboard
2. Selecionar o app "DesafioSolidApps"
3. Ir em **App Settings** → **Security & Keys**
4. Copiar as credenciais necessárias

### Estrutura de Credenciais
```javascript
const credentials = {
  applicationId: "YOUR_APPLICATION_ID",
  masterKey: "YOUR_MASTER_KEY",
  restApiKey: "YOUR_REST_API_KEY", // opcional
  javascriptKey: "YOUR_JAVASCRIPT_KEY" // opcional
};
```

## 4. Dependências e Configurações Iniciais

### Ferramentas MCP Necessárias
- [ ] `mcp_back4app_create_parse_app` - Para criar o app
- [ ] `mcp_back4app_call_parse_server_rest_api` - Para operações CRUD
- [ ] `mcp_back4app_deploy_cloud_code_files` - Para triggers
- [ ] `mcp_back4app_set_current_app` - Para definir app ativo

### Configurações do Ambiente
- [ ] Node.js (versão 14+ recomendada)
- [ ] Acesso à internet para APIs Back4App
- [ ] Editor de código para Cloud Functions

## 5. Estrutura de Arquivos

### Organização Recomendada
```
Desafio-Solid-Apps/
├── docs/
│   ├── context.md
│   └── implementation/
│       ├── README.md
│       ├── 01-prerequisites.md
│       ├── 02-data-modeling.md
│       ├── 03-security-config.md
│       ├── 04-triggers-validation.md
│       ├── 05-crud-examples.md
│       ├── 06-performance-indexes.md
│       └── 07-error-scenarios.md
├── cloud-code/
│   ├── triggers/
│   │   ├── beforeSave-Nota.js
│   │   └── beforeDelete-Cliente.js
│   └── functions/
│       └── (se necessário)
└── tests/
    ├── api-tests/
    └── integration-tests/
```

## 6. Checklist de Validação

### Antes de Começar
- [ ] Todas as credenciais estão disponíveis
- [ ] MCP está funcionando corretamente
- [ ] Estrutura de arquivos está criada
- [ ] Documentação foi revisada

### Validação de Conectividade
- [ ] Testar criação de app via MCP
- [ ] Verificar acesso às APIs REST
- [ ] Confirmar permissões de Cloud Code

## 7. Próximos Passos

1. **Criar App**: Usar MCP para criar "DesafioSolidApps"
2. **Configurar Classes**: Implementar modelagem de dados
3. **Configurar Segurança**: Aplicar CLP e ACL
4. **Implementar Triggers**: Deploy das validações
5. **Testar Integração**: Validar funcionamento completo

## 8. Troubleshooting

### Problemas Comuns
- **MCP não conecta**: Verificar configuração do servidor
- **Credenciais inválidas**: Revalidar no dashboard Back4App
- **Permissões insuficientes**: Verificar plano da conta
- **Rate limiting**: Aguardar ou verificar limites da conta

### Logs e Debug
- Verificar logs do MCP para erros de conexão
- Usar dashboard Back4App para monitorar requisições
- Testar APIs individualmente antes da integração

---

**Status**: ✅ Documentação completa
**Próximo**: [02-data-modeling.md](./02-data-modeling.md)
