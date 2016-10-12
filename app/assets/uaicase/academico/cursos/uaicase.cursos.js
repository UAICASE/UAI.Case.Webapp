var app = angular.module('uaicase.cursos',[]);
  app.factory('CursoService', ['$http','ENV', function ($http, ENV) {

    var put = function (curso) {
        return $http.put(ENV.apiEndpoint+"/curso/", curso);

    }



    var allActives = function()
    {
        return $http.get(ENV.apiEndpoint+"/curso/activos")
    }

    var all = function (id) {
        return $http.get(ENV.apiEndpoint+"/curso/");

    }

    var one = function (id) {
        return $http.get(ENV.apiEndpoint+"/curso/" + id);

    }
    var put = function (curso) {
        return $http.put(ENV.apiEndpoint+"/curso/",curso );

    }
    var getAlumnosSinGrupoByCurso = function (idCurso) {
        return $http.get(ENV.apiEndpoint+"/curso/sin-grupo/" + idCurso);
    }

    var allCursosFromMateria = function (materiaId) {
        return $http.get(ENV.apiEndpoint+"/curso/materia/" + materiaId);
    }

    var miGrupoCurso=function(grupoId)
    {
        return $http.get(ENV.apiEndpoint+"/curso/mi-grupo-curso/"+grupoId);
    }


    return {
        allActives: allActives,
        one: one,
        put: put,
        all: all,
        getAlumnosSinGrupoByCurso: getAlumnosSinGrupoByCurso,
        allCursosFromMateria: allCursosFromMateria,
        miGrupoCurso: miGrupoCurso,


    };

}]);
app.directive('planificarContenidoCurso', ['$rootScope', function ($rootScope) {


    var controller = function (ContenidoMateriaService,claseService, docenteAlumnoCursoService, fileDownload, CommonService, $timeout, $scope, $window, $aside, MateriaService, $rootScope,$q) {






        $scope.clases = [];

        $scope.user = $rootScope.user;

        $scope.getContenidoClases = function () {


            ContenidoMateriaService.all($scope.curso.Materia.Id).then(function (r) {
                $scope.contenidoMateria = r.data;
            });


            if ($scope.curso!=undefined)
            claseService.allByCurso($scope.curso.Id).then(function (response) {
                $scope.clases = response.data;
                CommonService.tipoClase().then(function (resp) {
                    $scope.tipoClase = resp.data;
                })
            })


        }
        $scope.treeClass = function (u) {
            var ret;
            if (u.Unidades != undefined) {
                if (u.Unidades.length > 0)
                    ret = "<i class='md md-keyboard-arrow-right'></i>";
                else
                    ret = "";
            }
            //            if ($scope.selectedUnidad!=undefined)
            //      if ($scope.selectedUnidad.Id == u.Id && u.Unidades.length > 0) {
            if (u.visible) {
                ret = "<i class='md md-keyboard-arrow-down'></i>";
            }

            return ret;
        }
        $scope.showClase = function (clase) {
            clase.editing = true;
            $scope.claseContent = clase;

            showForm();
        }
        $scope.agregarUnidadClase = function(unidad)        {
            if ($scope.claseSelected.Unidades == undefined) {
                $scope.claseSelected.Unidades = [];
            }
                var unidadClase = {};
                unidadClase.ClaseId = $scope.curso.Id;
                unidadClase.Unidad = unidad.Unidad;

                claseService.putUnidad(unidadClase).then(function (resp) {
                    $scope.claseSelected.Unidades.push(resp.data);
                    claseService.put($scope.claseSelected).then(function (response) {
                        $scope.claseSelected = response.data;
                    });
                });




        }
        $scope.showUnidadesClase=function(clase)      {
            $scope.claseSelected = clase;
            formTplUnidades.show();
        }



        var formTplUnidades = $aside({
            scope: $scope,
            template: '/assets/uaicase/academico/cursos/unidad-clase-form.html',
            show: false,
            placement: 'left',
            backdrop: true,
            animation: 'am-slide-left'
        });


        var formPlanificarCurso = $aside({
            scope: $scope,
            template: '/assets/uaicase/academico/cursos/curso-planificacion-form.html',
            show: false,
            placement: 'left',
            backdrop: true,
            animation: 'am-slide-left'
        });



        $scope.putClase=function()         {
            if ($scope.curso != undefined) {
                $scope.claseContent.Curso = $scope.curso;



                    var edit = $scope.claseContent.editing;
                    $scope.claseContent.editing = false;




                claseService.put($scope.claseContent).then(function (resp) {
                    if (!edit)
                        $scope.clases.push(resp.data);
                    formTpl.hide();
                });
            }
        }
        $scope.addClase=function()         {
            $scope.claseContent = {};
            showFormPlanificacion();
        }

        showFormPlanificacion = function () {

            formPlanificarCurso.show();
        };

        hideFormPlanificacion = function () {
            formPlanificarCurso.hide();
            formTplUnidades.hide();
        };


        $scope.$on('$destroy', function () {
            hideFormPlanificacion();

        });

        $scope.fileDownload = function (file) {
            fileDownload.downloadFile(file)
        }


        $scope.toggleClase = function (clase)
        {

            clase.visible = !clase.visible;
        }



        $scope.unidadesFromClaseClass = function (u) {
            var ret = "<i class='md md-keyboard-arrow-right'></i>";

            if (u.visible)
                ret = "<i class='md md-keyboard-arrow-down'></i>";

            if (u.Unidades != undefined) {
                if (u.Unidades.length == 0)
                    ret = "";
            }




            return ret;
        }


        $scope.getContenidoClases();


    };








    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/academico/cursos/planificar-contenido-curso.html',
        replace: true,
        controller: controller,
        scope: {
            curso: "="
        }



    };

}]);
app.directive('administrarNotasCurso', ['$rootScope', function ($rootScope) {


    var controller = function ($rootScope, $scope, $timeout, CommonService, docenteAlumnoCursoService) {

        CommonService.tipoNota().then(function (resp2) {
            $scope.tipoNota = resp2.data;
        })
        $scope.addNota = function (alumnoCurso,nota) {
            if (alumnoCurso.Notas == undefined)
                alumnoCurso.Notas == [];


            //  notaService.put($scope.nota).then(function (resp2) {

            //check if not está
            //var nota = $scope.nota;
            var esta = false;
            alumnoCurso.Notas.forEach(function (x) {
                if (x.Id == nota.Id) {
                    esta = true;
                    x = nota;

                }
            })

            if (!esta)
                alumnoCurso.Notas.push(nota);

            docenteAlumnoCursoService.put(alumnoCurso).then(function (resp) {
                alumnosCurso = resp.data;
                $scope.nota = {}
            })

            //})






        }


    };


    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/academico/cursos/administrar-notas-curso.html',
        replace: true,
        controller: controller,
        scope: {
            // creates a scope variable in your directive
            // called `locations` bound to whatever was passed
            // in via the `locations` attribute in the DOM
            alumnos: '=alumnos',

        },
        link: function (scope, element, attrs) {
            scope.alumnos = scope.$eval(attrs.alumnos)
        }




    };

}]);
