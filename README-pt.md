# Desafio Solid Apps - App CRUD com Bubble + Back4App

## Resumo da Entrega

Este projeto faz parte do teste técnico para implementar uma aplicação CRUD de **Clientes** e **Notas**, utilizando **Bubble** como frontend e **Back4App** como backend.

Durante o desenvolvimento, respeitando o timebox de **\~6 horas**, concluí a parte de **backend** (modelagem, autenticação, segurança e CRUD completo via REST) e iniciei a integração com o Bubble.

Além da implementação, documentei no repositório toda a linha de raciocínio: os **prompts utilizados**, as **respostas do meu agente do Cursor** e como fui validando cada etapa da configuração e das implementações. Dessa forma, a entrega contém não apenas o código, mas também o processo que segui.

---

## O que foi Feito

### ✅ Backend (Back4App) — **Concluído**

* **Autenticação de Usuário**

  * Registro, login, logout e gerenciamento de sessão com tokens.
* **Modelagem de Dados**

  * Classe `Client`: `name`, `email`, `phone`, `owner`.
  * Classe `Note`: `title`, `content`, `client`, `owner`.
  * Relacionamentos `Pointer` entre Usuário → Cliente → Nota.
* **Segurança**

  * Configuração de **CLP (Class Level Permissions)** e **ACL (Access Control Lists)**.
  * Isolamento de dados por usuário implementado.
* **API REST**

  * Endpoints CRUD validados com cURL/Postman.
  * Tratamento de erros e autenticação configurados.
* **Documentação**

  * Todos os prompts e interações usados no Cursor estão registrados no repositório, em `docs/implementation/` e na pasta `prompts/`.

### 🔄 Frontend (Bubble) — **Parcial**

* **Autenticação**

  * Página de cadastro/login integrada ao Back4App.
  * Logout funcional.
  * Sessão do usuário gerenciada via token.
* **Integração com API**

  * API Connector configurado com headers dinâmicos (Application ID, Session Token).
  * Algumas chamadas básicas testadas com sucesso.
* **Interface**

  * Estrutura inicial do dashboard criada.
  * Início da configuração de Repeating Groups para listar Clientes.
  * Fluxos CRUD ainda não finalizados.

---

## Status do Projeto

* **Backend**: 100% pronto e validado.
* **Frontend**: \~30% concluído (login/cadastro e parte do dashboard).
* **Integração**: \~50% configurada.

**Tempo investido:** \~6 horas (sem contar configuração inicial do ambiente).

---

## Dificuldades Encontradas

* Minha maior dificuldade foi no **API Connector do Bubble**, principalmente por ser minha primeira experiência com esse recurso.
* Minha bagagem vem mais de **high-code** (JavaScript, Python, Supabase, etc.), onde já trabalhei com integrações diretas via código. Em Bubble, estava mais acostumado a usar JavaScript no frontend em vez de configurar APIs diretamente no editor.
* Apesar disso, consegui avançar na configuração inicial e documentar claramente os pontos onde parei.

---

## Próximos Passos (se houvesse mais tempo)

1. Finalizar CRUD completo no Bubble (Clientes e Notas).
2. Completar interface responsiva (desktop/mobile).
3. Adicionar feedbacks visuais (loading, erro, sucesso).
4. Melhorar segurança no fluxo de sessão (renovação automática de token).
5. Implementar recursos extras (paginação, validações de formulário, componentes reutilizáveis).

---

## Entregáveis

* **Vídeo de Demonstração (3–5 min)** mostrando autenticação e backend configurado.
* **Documentação Técnica (README e docs/implementation/)** detalhando:

  * Modelagem de dados.
  * Configuração de segurança.
  * Exemplos de API usados.
  * Prompts e respostas do Cursor validados durante a implementação.
  * Decisões técnicas, dificuldades e próximos passos.

---

**Conclusão:** O backend foi entregue completo e funcional. O frontend ficou parcialmente implementado, com autenticação integrada e início do dashboard. Registrei detalhadamente todo o processo no GitHub (incluindo prompts e raciocínio) para deixar clara a evolução, as escolhas feitas e os pontos a continuar.

---
