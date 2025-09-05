Parse.Cloud.beforeSave("Cliente", async (request) => {
  // 1. Verificar autenticação
  if (!request.user) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 
      "Usuário não autenticado");
  }

  // 2. Validações de campo
  const name = request.object.get("name");
  const email = request.object.get("email");
  const phone = request.object.get("phone");

  // Validar nome
  if (!name || name.trim().length < 2) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Nome deve ter pelo menos 2 caracteres");
  }

  if (name.length > 100) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Nome deve ter no máximo 100 caracteres");
  }

  // Validar email
  if (!email || !isValidEmail(email)) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Email inválido");
  }

  // Validar telefone
  if (!phone || !isValidPhone(phone)) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 
      "Telefone inválido");
  }

  // 3. Verificar unicidade de email por usuário
  if (request.object.isNew()) {
    const existingClient = await new Parse.Query("Cliente")
      .equalTo("email", email)
      .equalTo("owner", request.user)
      .first();

    if (existingClient) {
      throw new Parse.Error(Parse.Error.DUPLICATE_VALUE, 
        "Já existe um cliente com este email");
    }
  }

  // 4. Configurar owner e ACL
  request.object.set("owner", request.user);
  
  const acl = new Parse.ACL();
  acl.setReadAccess(request.user, true);
  acl.setWriteAccess(request.user, true);
  request.object.setACL(acl);

  // 5. Normalizar dados
  request.object.set("name", name.trim());
  request.object.set("email", email.toLowerCase().trim());
  request.object.set("phone", normalizePhone(phone));
});

// Funções auxiliares
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}
