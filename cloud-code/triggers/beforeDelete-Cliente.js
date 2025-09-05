Parse.Cloud.beforeDelete("Cliente", async (request) => {
  // 1. Verificar autenticação
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "Usuário não autenticado");
  }

  // 2. Verificar se o cliente pertence ao usuário
  if (request.object.get("owner").id !== request.user.id) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 
      "Não é possível deletar cliente de outro usuário");
  }

  // 3. Buscar e deletar todas as notas relacionadas
  try {
    const notas = await new Parse.Query("Nota")
      .equalTo("client", request.object)
      .equalTo("owner", request.user)
      .find();

    if (notas.length > 0) {
      console.log(`Deletando ${notas.length} notas do cliente ${request.object.id}`);
      await Parse.Object.destroyAll(notas);
    }
  } catch (error) {
    console.error("Erro ao deletar notas do cliente:", error);
    // Não falhar a operação por causa das notas
  }

  // 4. Log da operação
  console.log(`Cliente ${request.object.id} deletado pelo usuário ${request.user.id}`);
});
