# Prompt para IA do Bubble - Frontend CRUD App

Crie um app web responsivo com 3 páginas principais usando Bubble:

## PÁGINA 1: LOGIN
- Header: "Desafio Solid Apps"
- Formulário centralizado:
  - Campo "Email" (tipo email)
  - Campo "Senha" (tipo password)
  - Botão "Entrar" (azul, destaque)
  - Link "Criar conta" (texto pequeno)
- Estados visuais: loading, erro (vermelho), sucesso (verde)
- Layout responsivo (mobile/desktop)

## PÁGINA 2: DASHBOARD PRINCIPAL
- Header fixo: logo + "Dashboard" + botão logout (canto direito)
- Sidebar esquerda (desktop) / menu hambúrguer (mobile):
  - "Clientes" (ativo por padrão)
  - "Notas"
- Área principal:
  - **Seção Clientes**:
    - Botão "Novo Cliente" (verde, canto superior direito)
    - Lista de clientes em cards:
      - Nome (destaque)
      - Email (cinza)
      - Telefone (cinza)
      - Botões: "Editar" (azul) + "Excluir" (vermelho) + "Ver Notas" (laranja)
    - Campo busca "Pesquisar clientes..."
    - Paginação: "Anterior" / "Próximo" + "Página X de Y"
  - **Seção Notas**:
    - Dropdown "Selecionar Cliente" (obrigatório)
    - Botão "Nova Nota" (verde)
    - Lista de notas em cards:
      - Título (destaque)
      - Conteúdo (truncado)
      - Data criação (cinza)
      - Botões: "Editar" (azul) + "Excluir" (vermelho)
    - Campo busca "Pesquisar notas..."
- Modal "Novo/Editar Cliente":
  - Campos: Nome*, Email*, Telefone*
  - Botões: "Salvar" (azul) + "Cancelar" (cinza)
  - Validação visual em tempo real
- Modal "Nova/Editar Nota":
  - Campo "Cliente" (dropdown, desabilitado se vindo de cliente específico)
  - Campos: Título*, Conteúdo* (textarea)
  - Botões: "Salvar" (azul) + "Cancelar" (cinza)

## PÁGINA 3: ERRO
- Ícone de erro grande (vermelho)
- Título "Ops! Algo deu errado"
- Mensagem personalizável
- Botão "Tentar novamente" (azul)
- Link "Voltar ao login" (texto)

## REQUISITOS TÉCNICOS
- Design moderno: cores neutras, sombras sutis, bordas arredondadas
- Responsivo: sidebar vira menu hambúrguer no mobile
- Estados visuais claros: loading, erro, sucesso, vazio
- Componentes reutilizáveis: botões, inputs, modais, cards
- Navegação fluida entre seções
- Feedback visual em todas as ações

## ESTRUTURA DE DADOS (apenas para referência visual)
- Cliente: {nome, email, telefone}
- Nota: {titulo, conteudo, cliente}

**IMPORTANTE**: Crie apenas a interface. Não implemente APIs - apenas prepare os elementos visuais e workflows básicos de navegação.
