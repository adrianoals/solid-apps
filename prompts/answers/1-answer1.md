Vou ler o arquivo `docs/context.md` para entender a tarefa principal e os requisitos do seu projeto.


[1 tool called]

Baseado na leitura do arquivo `docs/context.md`, aqui está minha interpretação da tarefa:

## **Tarefa Principal**
Você precisa construir uma aplicação web CRUD (Create, Read, Update, Delete) onde um usuário autenticado pode gerenciar **Clientes** e **Notas** relacionadas a esses clientes.

## **Requisitos Funcionais**

### **Autenticação**
- Sistema de cadastro e login usando o sistema de usuários do Back4App
- Isolamento de dados: cada usuário só pode ver seus próprios dados

### **Clientes**
- Campos obrigatórios: nome, email, telefone
- Operações CRUD completas
- Lista pesquisável e ordenável

### **Notas**
- Campos: título e conteúdo
- Cada nota pertence a um cliente específico e ao seu proprietário
- Operações CRUD completas
- Exibidas dentro do cliente selecionado

### **UX/UI**
- Layout responsivo (desktop/mobile)
- Feedback claro de carregamento e estados de erro/sucesso

## **Restrições Técnicas**

### **Arquitetura**
- **Frontend**: Bubble (apenas como interface, sem usar o banco de dados do Bubble)
- **Backend**: Back4App (usando sua REST API)
- **Integração**: API Connector do Bubble (sem plugins pagos)

### **Segurança**
- Não armazenar dados de Clientes/Notas no banco do Bubble
- Todas as operações devem passar pelo Back4App
- Credenciais/tokens devem ser tratados com segurança (sem hard-coding em elementos visíveis)

### **Organização**
- Manter workflows e componentes organizados e reutilizáveis

## **Entregáveis**
1. **Vídeo** (3-5 min) demonstrando os fluxos
2. **README** cobrindo:
   - Suposições feitas
   - Limitações conhecidas e possíveis melhorias

## **Cronograma**
- **Esforço sugerido**: 4-6 horas
- **Prazo**: 48 horas após receber o desafio

## **Critérios de Avaliação** (100 pontos)
- **Integração & Arquitetura** (25): integração limpa da API, isolamento de propriedade
- **Funcionalidade** (25): completude do CRUD, relação Cliente ↔ Nota
- **UX/UI** (15): responsividade, clareza, estados
- **Qualidade** (20): nomenclatura, reutilização, manutenibilidade, segurança básica
- **Documentação & Comunicação** (15): clareza do README e vídeo

## **Bonus (opcional)**
- Paginação para listas
- Validação de formulários
- Componentes reutilizáveis
- Tratamento elegante de expiração de sessão

**Resumo**: É um desafio de integração entre Bubble (frontend) e Back4App (backend) para criar um sistema de gerenciamento de clientes e notas com autenticação e isolamento de dados por usuário.