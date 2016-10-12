
app.controller('MisMateriasController', function ($window, $scope, MateriaService, $rootScope,
  $routeParams,docenteAlumnoCursoService,ThemeService) {




$scope.loadData=function(){
  docenteAlumnoCursoService.misMaterias().then(function(resp){
    $scope.misMaterias= resp.data;
  })
}
$scope.loadData();


$scope.loadMateria = function (materiaId) {
  window.location.href = "#/academico/materias/"+materiaId;
          }




});﻿
app.controller('MateriaController',
    function (notaService,docenteAlumnoCursoService, fileDownload, fileUpload, CommonService, ContenidoMateriaService, CursoService,  $timeout, $scope, $window, $aside, AlumnoService, MateriaService, $rootScope,$routeParams) {


      $scope.materiaId=$routeParams.id;
      if (!$scope.materiaId)
          location.href = "/#/academico/materias";


        $scope.materiaCursos = [];
        $scope.unidades = [];


        $scope.loadMateria = function () {

                MateriaService.one($scope.materiaId).then(function (response) {

                    $scope.materia =  response.data;

                  //  $rootScope.pageTitle = $scope.materia.Nombre;

                    //traigo todos lso cursos de esta materia
                    CursoService.allCursosFromMateria($scope.materia.Id).then(function (response) {
                        $scope.materiaCursos = response.data;

                    });

                    CommonService.tipoContenido().then(function (resp) {
                        $scope.tipoContenido = resp.data;
                    })





                }, function (error) {

                });



        }

        $scope.loadMateria();



        $scope.getContenido=function()
        {
            ContenidoMateriaService.all($scope.materia.Id).then(function (resp) {
                $scope.contenido = resp.data;
            })
        }


        $scope.guardarContenido = function(contenido)
        {
            contenido.editing = false;
            ContenidoMateriaService.put(contenido).then(function (resp) {
                //  $scope.contenido.push(contenido);
            })
        }


        $scope.agregarUnidad=function(u)
        {
            var unidad = {};
            unidad.Identificador = "Id";
            unidad.Descripcion = "Descripción";
            if (u.Unidades == undefined)
                u.Unidades = [];

            u.Unidades.push(unidad);
        }

        $scope.saveUnidad=function(unidad)
        {

            unidad.editing =false;

            ContenidoMateriaService.putUnidad(unidad.Unidad).then(function (resp) {
                ""
            })
        }

        $scope.putContenido = function (contenido)

        {

            if (contenido == undefined) {
                var contenido = {};
                contenido.Unidad = {};
            }
            contenido.Unidad.Identificador = "Id";
            contenido.Unidad.Descripcion = "Descripción";
            contenido.Materia = $scope.materia;



            ContenidoMateriaService.put(contenido).then(function (resp) {
                $scope.contenido.push(contenido);
                ""
            })


        }

        $scope.addContenido= function(unidad, contenido)
        {
            if (unidad.Contenidos == undefined)
                unidad.Contenidos = [];




            unidad.Contenidos.push(contenido);
        }

        $scope.showContenido = function(unidad)
        {
            $scope.unidadContent = unidad;

            showForm();
        }
        var formTpl = $aside({
            scope: $scope,
            template: '/assets/uaicase/academico/materias/materia-contenido-form.html',
            show: false,
            placement: 'left',
            backdrop: true,
            animation: 'am-slide-left'
        });

        showForm = function () {

            formTpl.show();
        };

        hideForm = function () {
            formTpl.hide();
        };


        $scope.$on('$destroy', function () {
            hideForm();
        });

        $scope.fileDownload = function (file) {
            fileDownload.downloadFile(file)
        }


        $scope.selectCursoClass=function(curso)
        {
            var c = $scope.selectedCursoRendimiento;
            var ret = "<i class='md md-check-box-outline-blank'></i>";
            if (c == undefined)
                return ret;
            else
                if ( c.Id==curso.Id)
                    ret = "<i class='md md-check-box'></i>";


            return ret;
        }

        $scope.postContenido=function(c)
        {

            fileUpload.uploadFileToUrl(c.file).then(function (resp) {
                c.model.Archivo = resp.data;
                ContenidoMateriaService.putContenido(c.model).then(function (resp2) {
                    if ($scope.unidadContent.Contenidos == undefined)
                        $scope.unidadContent.Contenidos = [];

                    $scope.unidadContent.Contenidos.push(resp2.data);
                        ContenidoMateriaService.putUnidad($scope.unidadContent).then(function (resp) {
                        ""
                    })

                    });
            });



        }
        $scope.selectUnidad = function(u)
        {

                u.visible = !u.visible;

            if ($scope.selectedUnidad != undefined)
            {
                if ($scope.selectedUnidad.Id!=u.Id)
                    $scope.selectedUnidad = u;
                else
                    $scope.selectedUnidad=undefined
            }
            else
                $scope.selectedUnidad = u;
        }

        $scope.selectSubUnidad = function (u) {

                u.visible = !u.visible;


            if ($scope.selectedSubUnidad != undefined) {
                if ($scope.selectedSubUnidad.Id != u.Id)
                    $scope.selectedSubUnidad = u;
                else
                    $scope.selectedSubUnidad = undefined
            }
            else
                $scope.selectedSubUnidad = u;
        }

        $scope.treeClass=function(u)
        {
            var ret;
            if (u.Unidades != undefined)
            {
                if (u.Unidades.length > 0 )
                    ret = "<i class='md md-keyboard-arrow-right'></i>";
                else
                    ret = "";
            }
//            if ($scope.selectedUnidad!=undefined)
            //      if ($scope.selectedUnidad.Id == u.Id && u.Unidades.length > 0) {
            if (u.visible){
                    ret = "<i class='md md-keyboard-arrow-down'></i>";
                }

            return ret;
        }


        $scope.treeSubClass = function (u) {
            var ret;
            if (u.Contenidos != undefined) {
                if (u.Contenidos.length > 0)
                    if (u.Contenidos.length > 0)
                    ret = "<i class='md md-keyboard-arrow-right'></i>";
                else
                    ret = "";
            }
            //if ($scope.selectedSubUnidad != undefined)
                //if ($scope.selectedSubUnidad.Id == u.Id && u.Contenidos.length > 0) {
            if (u.visible) {
                    ret = "<i class='md md-keyboard-arrow-down'></i>";
                }

            return ret;
        }


        $scope.loadNotasFromCurso=function(curso)
        {

            if ($scope.selectedCursoRendimiento != undefined)
                $scope.selectedCursoRendimiento = undefined
            else {
                $scope.selectedCursoRendimiento = curso;


                notaService.fromCurso(curso.Id).then(function (resp) {
                    $scope.notasCurso = resp.data;
                    $scope.notasAprobados = [];
                    $scope.notasDesaprobados = [];
                    $scope.notasAusentes = [];
                    $scope.notasCurso.forEach(function (i) {

                        if (i.Valor >= 4)
                            $scope.notasAprobados.push(i);
                        else
                            if (i.Valor > 0)
                                $scope.notasDesaprobados.push(i);
                            else
                                $scope.notasAusentes.push(i);


                    })


                })

            }

        }
        $scope.loadAlumnosCurso=function(curso)
        {

            docenteAlumnoCursoService.alumnosByCurso(curso.Id).then(function (resp) {
                $scope.alumnosCurso = resp.data;

            });
        }

    });
