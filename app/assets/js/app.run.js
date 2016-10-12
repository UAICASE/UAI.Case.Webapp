app.run(function ($rootScope,  $http, $alert, $timeout, UsuarioService,AuthService) {

  $rootScope.manageErrors=function(status){
    var title="Error "+status;
    var body="";
    switch (status) {
      case 401:
        AuthService.logout();
      case 500:
        body='Error interno del servidor!'
        break;
      case 415:
        body='Unsupported media type';
        break;
      case 403:
        body='No tiene acceso al recurso solicitado';
        break;
      case 400:
        body='Bad Request';
        break;
      case 404:
        body='El recurso no está disponible!';
        break;
      default:
        body: 'Error desconocido!';
      }
   }

});
