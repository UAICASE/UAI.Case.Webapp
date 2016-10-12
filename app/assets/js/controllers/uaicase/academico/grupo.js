app.controller('MisGruposController',   function ($scope, docenteAlumnoCursoService, GrupoService,  $window) {


        var loadGrupos = function(){
          docenteAlumnoCursoService.misGruposActivos().then(function (response) {
                $scope.grupos=response.data;
          });
        };

loadGrupos();


        $scope.loadGrupo = function (grupo) {

            GrupoService.one(grupo.Id).then(function (res) {

                $window.location.href = "#/academico/grupos/" + grupo.Id;
            });
        }



    });

app.controller('GrupoController', function ($scope, $window, $routeParams, GrupoService,$rootScope) {


        $scope.grupoId=$routeParams.id;
        if (!$scope.grupoId)
            location.href = "/#/academico/grupos";



        $scope.grupo = {};




        $scope.loadGrupo = function()
        {

                GrupoService.one($scope.grupoId).then(function (response) {

                    $scope.grupo = response.data;
                    $rootScope.pageTitle = $scope.grupo.Grupo.Curso.Materia.Nombre + " / " + $scope.grupo.Grupo.Identificador;




                }, function (error) {

                });

        }


        $scope.loadGrupo();




    });
