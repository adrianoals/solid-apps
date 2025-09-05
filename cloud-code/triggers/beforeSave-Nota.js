Parse.Cloud.beforeSave("Nota", async (request) => {
  // 1. Verificar autenticação
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "Usuário não autenticado");
  }

  // 2. Validações de campo
  const title = request.object.get("title");
  const content = request.object.get("content");
  const client = request.object.get("client");

  // Validar título
  if (!title || title.trim().length < 1) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Título é obrigatório");
  }

  if (title.length > 200) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Título deve ter no máximo 200 caracteres");
  }

  // Validar conteúdo
  if (!content || content.trim().length < 1) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Conteúdo é obrigatório");
  }

  if (content.length > 5000) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Conteúdo deve ter no máximo 5000 caracteres");
  }

  // Validar cliente
  if (!client) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Cliente é obrigatório");
  }

  // 3. Verificar se cliente pertence ao usuário
  let clientObj;
  try {
    clientObj = await client.fetch();
  } catch (error) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 
      "Cliente não encontrado");
  }

  if (clientObj.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Nota só pode ser criada para clientes do próprio usuário");
  }

  // 4. Configurar owner e ACL
  request.object.set("owner", request.user);
  
  const acl = new Parse.ACL();
  acl.setReadAccess(request.user, true);
  acl.setWriteAccess(request.user, true);
  request.object.setACL(acl);

  // 5. Normalizar dados
  request.object.set("title", title.trim());
  request.object.set("content", content.trim());
});
