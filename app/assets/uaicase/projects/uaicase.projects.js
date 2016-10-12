
var app = angular.module('uaicase.projects',[]);



app.factory('ProyectoService', ['$http', 'ENV', function ($http, ENV) {

    var put = function (proyecto) {
        return $http.put(ENV.apiEndpoint+"/proyecto/", proyecto);

    }

    var all = function () {
        return $http.get(ENV.apiEndpoint+"/proyecto/");

    }
    var allByGrupo = function (grupoId) {
        return $http.get(ENV.apiEndpoint+"/proyecto/grupo/" + grupoId);

    }

    var allByCurso=function (cursoId) {
        return $http.get(ENV.apiEndpoint+"/proyecto/curso/" + cursoId);

    }

    var one = function (id) {
        return $http.get(ENV.apiEndpoint+"/proyecto/" + id);

    }



    var collaborators = function(id)
    {
        return $http.get(ENV.apiEndpoint+"/proyecto/collaborators/" + id);
    }

    var count = function () {
        return $http.get(ENV.apiEndpoint+"/proyecto/count" );
    }
    var resumen= function () {
        return $http.get(ENV.apiEndpoint+"/proyecto/resumen");
    }

    var countDiagramas = function () {

        return $http.get(ENV.apiEndpoint+"/proyecto/count-diagramas");
    }

    var shareCurso = function (proyecto) {
        return $http.put(ENV.apiEndpoint+"/proyecto/share/curso", proyecto)
    }
    var shareGrupo = function(proyecto)
    {
        return $http.put(ENV.apiEndpoint+"/proyecto/share/grupo",proyecto)
    }

    var allSharedWithMeFromGrupo = function ()
    {
        return $http.get(ENV.apiEndpoint+"/proyecto/share/grupo/all")
    }

    var allSharedWithMeFromCurso = function () {
        return $http.get(ENV.apiEndpoint+"/proyecto/share/curso/all")
    }

    return {
        countDiagramas: countDiagramas,
        one: one,
        put: put,
        all: all,
        count: count,
        resumen: resumen,
        allByGrupo: allByGrupo,
        shareGrupo: shareGrupo,
        shareCurso: shareCurso,
        allByCurso: allByCurso,
        allSharedWithMeFromGrupo: allSharedWithMeFromGrupo,
        allSharedWithMeFromCurso: allSharedWithMeFromCurso,
        collaborators: collaborators


    };

}]);

app.directive('gestionProyectos',  function ($rootScope,ThemeService) {

  var controller = function ($rootScope,$scope, $aside, ProyectoService, EnumService, $rootScope, CursoService, docenteAlumnoCursoService){
    // settings
    $scope.settings = {
        singular: 'Proyecto',
        plural: 'Proyectos',
        cmd: 'Agregar'
    };

    var formTpl = $aside({
        scope: $scope,
        template: '/assets/uaicase/projects/gestion-form.html',
        show: false,
        placement: 'left',
        backdrop: true,
        animation: 'am-slide-left'

    });


    $scope.loadData=function(){
      var rol = $scope.rol;
      var target = $scope.target;

      if (rol == target)  {
         ProyectoService.all().then(function (items) {
             $scope.data = items.data;
         });
       }


       docenteAlumnoCursoService.misCursosActivos().then(function (items) {
              $scope.cursosActivos = items.data;
      });


    }


    $scope.shareToCurso =function(proyecto)     {

        ProyectoService.shareCurso(proyecto).then(function (resp) {

        });
    }
    $scope.shareToGrupo=function(proyecto)     {
        if (proyecto!=undefined)
        proyecto.Grupo = proyecto.GrupoToShare;
        ProyectoService.shareGrupo(proyecto).then(function (resp) {

        });
    }

    $scope.shareProyecto=function(proyecto)     {
        $scope.item = proyecto;
        $scope.getGrupo($scope.item.Curso.Id);
    }

    $scope.getGrupo = function(cursoId)         {
            $scope.gruposCurso = [];
            if (cursoId != undefined) {

                CursoService.miGrupoCurso(cursoId).then(function (resp) {

                    resp.data.forEach(function (i) {
                        $scope.gruposCurso.push(i.Grupo);
                    })

                });
            }
        }





  // $scope.loadData = function () {
  //
  //
  //           $scope.user = $rootScope.user;
  //           $scope.selectedProyect = $rootScope.selectedProyect;
  //
  //           var rol = $scope.rol;
  //           var target = $scope.target;
  //
  //
  //           if (target == 'Compartidos' && rol == 'Docente') {
  //
  //               //ve los compartidos al curso
  //               ProyectoService.allSharedWithMeFromCurso().then(function (items) {
  //                   $scope.data = items.data;
  //               });
  //           }
  //           if (target == 'Compartidos' && rol=='Alumno')
  //           {
  //               //todos los comprtidos de todos los gruipos
  //               ProyectoService.allSharedWithMeFromGrupo().then(function (items) {
  //                   $scope.data = items.data;
  //               });
  //           }
  //
  //           if (rol == 'Alumno' && target=='Alumno') //proyectos del alumno
  //           {
  //
  //               ProyectoService.all().then(function (items) {
  //                   $scope.data = items.data;
  //               });
  //           }
  //
  //           if (rol == 'Alumno' && target=='Grupo') //proyectos compartidos pro alumnos en un grupo determinado
  //           {
  //               ProyectoService.allByGrupo($scope.room).then(function (items) {
  //                           $scope.data = items.data;
  //                               });
  //           }
  //
  //
  //           if (rol == 'Docente' && target=='Curso') { //proyectos que tieen los alumnos en el curso seleccionado
  //               ProyectoService.allByCurso($scope.room).then(function (items) {
  //                                 $scope.data = items.data;
  //                              });
  //           }
  //
  //
  //           docenteAlumnoCursoService.misCursosActivos().then(function (items) {
  //               $scope.cursosActivos = items.data;
  //
  //
  //
  //
  //           });
  //
  //       }
  //
  //       $scope.loadData();
  //
  //




        // methods
        $scope.checkAll = function () {
            angular.forEach($scope.data, function (item) {
                item.selected = !item.selected;
            });
        };

        $scope.editItem = function (item) {
            if (item) {
                item.editing = true;
                $scope.item =item;
                $scope.settings.cmd = 'Editar';
                showForm(item);
                $scope.getGrupo(item.Curso.Id);
            }
        };



        $scope.viewItem = function (item) {
            if (item) {
                item.editing = false;
                $scope.item = item;
                $scope.settings.cmd = 'Ver';
                showForm(item);
            }
        };


        $scope.estado=function(estado)
        {
            var r= EnumService.htmlEstado(estado, "info");
            if (estado == "Finalizado")
                r = EnumService.htmlEstado(estado, "success");

            return r;
        }

        $scope.proyectoPut=function()
        {

            ProyectoService.put($scope.item).then(function (proyecto) {
                //if (proyecto.data!=undefined && proyecto.data!="")
                ""
                if ($scope.item.Estado == "Nuevo")
                    $scope.data.push(proyecto.data);
                $rootScope.$broadcast('proyecto:nuevo', $scope.data.length);

            }, function (error) {

            }).finally(function () {

                loadData();

            });


        };


        $scope.selectProyecto=function(item)
        {

            $rootScope.$broadcast("proyecto:select", item);
            $scope.selectedProyect = $rootScope.selectedProyect;
        }
        $scope.createItem = function () {

            var item = {
                editing: true,
                Estado:"Nuevo"
            };
            $scope.item = item;
            $scope.settings.cmd = 'Nuevo';
            $scope.gruposCurso = [];

          //  formTpl.show();
            showForm();
        };

        var showForm = function () {
            angular.element('.tooltip').remove();
            // defining template

            formTpl.show();
        };

        $scope.saveItem = function () {
            if ($scope.settings.cmd == 'Guardar') {
                $scope.data.push($scope.item);

            }
            hideForm();
        };

        $scope.remove = function (item) {
            if (confirm('¿Está seguro?')) {
                if (item) {
                    $scope.data.splice($scope.data.indexOf(item), 1);
                } else {
                    $scope.data = $scope.data.filter(
                      function (item) {
                          return !item.selected;
                      }
                    );
                    $scope.selectAll = false;
                }
            }
        };






      var  hideForm = function () {
            formTpl.hide();
        };

        $scope.$on('$destroy', function () {
            hideForm();
        });





    };











    return {
        restrict: 'E',
        templateUrl: 'assets/uaicase/projects/gestion-proyectos.html',
        replace: true,
        controller: controller,
        scope: {

            rol: "@",
            target:"@",
            room: "@",
        }



    };

});
