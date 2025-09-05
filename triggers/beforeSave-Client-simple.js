Parse.Cloud.beforeSave("Client", function(request) {
  console.log("Trigger beforeSave Client executado!");
  console.log("Request user:", request.user);
  console.log("Request object:", request.object);
  
  if (request.user) {
    request.object.set("owner", request.user);
    console.log("Owner definido:", request.user.id);
  } else {
    console.log("Usuário não autenticado!");
  }
});
