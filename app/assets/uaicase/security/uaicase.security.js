var app = angular.module('uaicase.security', ['angular-jwt','uaicase.auth']);


app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Accept'] = '*/*';

});

app.controller('LoginController', function ($route,$http, $location, jwtHelper, AuthService,$rootScope) {
var vm = this;
    $rootScope.pageTitle = "Login";
    vm.showRegister = false;
    vm.lockLogin = false;
    vm.mail = "alumno@case.uai.edu.ar";
    vm.password = "alumno";
    vm.registering = false;
    vm.title = "Login";


    var activateAccount = function()  {
        var activateAccountToken = QueryString.activate;
        var idUsuario = QueryString.id;


        if (activateAccountToken != undefined && idUsuario != undefined)
        {
          vm.registering = true;
            var res = $http.post("/api/auth/activate", { Token: activateAccountToken, Id: idUsuario })
            .then(function (response) {
              vm.error_message = "Usuario activado correctamente!";
              vm.registering = false;


            })
          .catch(function (resp, status) {
            vm.error_message = "Error al activar usuario!";
          });

        }
    }

    activateAccount();

    var register = QueryString.register;

    var registerUser=function()    {


        if (register!=undefined)
        {


            var res = $http.get("/api/usuarios/validate/" + register)
                .then(function (response) {
                  vm.title = "Registrarse";
                  vm.showRegister = true;
                  vm.error_message = "Por favor, registrese en el sistema";

                })
              .catch(function (resp, status) {
                vm.title = "Login";
                vm.error_message = "solicitud de activación invalida!";
                vm.showRegister = false;

              });


        }

    }
    registerUser();

    vm.alumnoPut = function(alumno)     {

            vm.registering = true;
          AlumnoService.put(alumno).then(function (response) {
                $window.location.href = '/';
              vm.registering = false;
            })
        .catch(function (resp, status) {
            vm.registering = false;
            vm.error_message = "solicitud de activación invalida!";


        });



    }
   vm.login = function () {

        vm.lockLogin = true;
        AuthService.auth(vm.mail, vm.password)  // $http.post("/api/auth/", { Mail: $scope.mail, Password: $scope.password })

        .then(function(res) {

            if (res.data.authenticated) {
                  AuthService.login(res.data);
                  location.href="#/";
                //  $location.path("/")
            }
            else {
              AuthService.reset();
            }
        })

         .catch(function (resp, status) {

           AuthService.reset();

            if (resp.status == 401)
              vm.error_message = "mail o contraseña incorrecto!";
            else
                if (resp.status == 402)
                  vm.error_message = "usuario inactivo!";
             else

                    if (resp.status == 406)
                      vm.error_message = "password vencido!";
                    else
                        if (resp.status == 429)
                          vm.error_message = "El usuario ya se encuentra activo!";
                        else
                          vm.error_message = "error del sistema!";

          vm.lockLogin = false;
        });


    };


});
