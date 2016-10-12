app.controller('UsuarioController', ['$scope', '$rootScope', 'UsuarioService', 'bootstrap3ElementModifier', function ($scope, $rootScope, UsuarioService, bootstrap3ElementModifier) {
    bootstrap3ElementModifier.enableValidationStateIcons(false);


    $rootScope.pageTitle = 'Perfil de usuario';

    $scope.loadUser = function () {
        var usu = UsuarioService.one($rootScope.userId).then(function (data)
        {
          $scope.usuario = data.data;


        });

    }

    $scope.loadUser();

    $scope.guardar=function()
    {
        UsuarioService.put($scope.usuario).then(function (response) {
        var a = response;
         });
    }


    $scope.changePassword=function()
    {
        UsuarioService.changePassword($scope.dto).then(function (response) {
            alert("Contraseña actualizada correctamente!")
        }, function (response) {
            alert("error al cambiar la contraseña!")
        });
    }

}]);
