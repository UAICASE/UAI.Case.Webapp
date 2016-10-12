app.controller("MisCursosActivosController",function($scope,docenteAlumnoCursoService,CursoService,$location){

  docenteAlumnoCursoService.misCursosActivos().then(function (items) {
      $scope.cursosActivos = items.data;
  });


});
app.controller('MisCursosController',  function (connectedUsers, $scope, $window, $aside, MateriaService, DocenteService, AlumnoService, CursoService, CommonService, $rootScope, docenteAlumnoCursoService, GrupoService,ThemeService) {


        $scope.conectados = connectedUsers.all();



    // settings
    $scope.settings = {
        singular: 'Curso',
        plural: 'Cursos',
        cmd: 'Agregar'
    };
        // defining template
    var formTplAddAlumnos = $aside({
        scope: $scope,
        template: '/assets/views/uaicase/tpl/gestion-cursos-alumnos-form.html',
        show: false,
        placement: 'left',
        backdrop: true,
        animation: 'am-slide-left'
    });



    $rootScope.$on("new:newCursoJoinedExternal", function (alumnoCurso) {
        //$rootScope.$broadcast('curso:nuevo', alumnoCurso);
        $scope.loadData();


    })

    $rootScope.$on("new:cursoJoinRequestAccepted", function (alumnoCurso) {
        //$rootScope.$broadcast('curso:nuevo', alumnoCurso);
        $scope.loadData();


    })

    $scope.solicitarAccesoCurso = function (curso)   {
        var alumnocurso = {};

        alumnocurso.curso = curso;
        alumnocurso.Estado = 'Pendiente';
        docenteAlumnoCursoService.solicitarAccesoCurso(alumnocurso).then(function (data) {

          ThemeService.showMessage('Acceso a Curso','Solicitud Enviada!')

        },function(resp) {

            if (resp.status == 304)
            ThemeService.showMessage('Acceso a Curso','Solicitud Pendiente!')
              ThemeService.showMessage('Acceso a Curso','Solicitud Enviada!')
        });

    }
    $scope.addAlumnoToCurso = function (curso,estado) {


        var alumnocurso = {};
        alumnocurso.alumno = curso.selectedAlumno;
        alumnocurso.curso = curso;

        if (estado != undefined)
            alumnocurso.Estado = estado;

        docenteAlumnoCursoService.put(alumnocurso).then(function (data) {
            alumnocurso = data.data;
            if ($scope.alumnosCurso == null) $scope.alumnosCurso = [];
            if ($scope.alumnosCurso.filter(function (e) { return e.Id == alumnocurso.Id; console.log(e); }).length > 0)
            { }
            else
            {
                $scope.alumnosCurso.push(alumnocurso);
                $rootScope.$broadcast('curso:nuevo', alumnocurso);

            }





        });


    }
    $scope.showFormAddAlumnos = function (item) {
        item.selectedAlumno = undefined;
        item.editing = true;
        $scope.item = item;

        $scope.isLoading = true;
        docenteAlumnoCursoService.byCurso(item.Id).then(function (res) {
            $scope.alumnosCurso = res.data;
            $scope.isLoading = false;
        });
        formTplAddAlumnos.show();
    }
    $scope.hideFormAddAlumnos = function () {
        formTplAddAlumnos.hide();
    };
    $scope.addGrupo = function (nombre,maximo) {
        var grupo = {};
        grupo.Identificador = nombre;
        grupo.Maximo = maximo;
        grupo.Curso = $scope.cursoActual;
        GrupoService.put(grupo).then(function (response) {
            $scope.gruposCurso.push(response.data);
        });

    }



    $scope.loadData = function () {
        docenteAlumnoCursoService.misCursos().then(function (items) {
            $scope.data = items.data;

        });
        MateriaService.all().then(function (response) {
            $scope.materias = response.data;
        });
        AlumnoService.all().then(function (response) {
            $scope.alumnos = response.data;
        });


    }

    $scope.loadData();




    // defining template
    var formTplAlumnos = $aside({
        scope: $scope,
        template: '/assets/views/uaicase/tpl/mis-cursos-alumnos-form.html',
        show: false,
        placement: 'left',
        backdrop: false,
        animation: 'am-slide-left'
    });




    // methods
    $scope.checkAll = function () {
        angular.forEach($scope.data, function (item) {
            item.selected = !item.selected;
        });
    };
    $scope.loadGrupos = function (item)     {
        GrupoService.byCurso(item.Id).then(function (res) {
            $scope.gruposCurso = res.data;
            $scope.isLoading = false;

            $rootScope.$emit("cargar:grupos:curso", $scope.gruposCurso, item);
        });


    }
    $scope.loadAlumnos = function (item) {

        $scope.cursoActual = item;

        docenteAlumnoCursoService.byCurso(item.Id).then(function (res) {
            $scope.alumnosCurso = res.data;
            $scope.isLoading = false;

            $rootScope.$emit("cargar:alumnos:curso", $scope.alumnosCurso)
        });

        $scope.loadGrupos(item);


    }
    $scope.hideFormAlumnos = function () {
        formTplAlumnos.hide();
    };
    $scope.$on('$destroy', function () {
        formTplAddAlumnos.hide();
    });


});
app.controller('CursoController', [ 'docenteAlumnoCursoService',  '$scope',    'CursoService', 'GrupoService', '$rootScope', '$routeParams',   function ( docenteAlumnoCursoService,  $scope,  CursoService, GrupoService, $rootScope, $routeParams) {

        $scope.alumnosGrupoSeleccionado = undefined;
        $scope.nota = {};
        $scope.requests = [];
        $scope.alumnosGrupoSeleccionado = "";
        $scope.alumnosCurso = [];

        $scope.cursoId=$routeParams.id;

        if (!$scope.cursoId)
            location.href = "/#/academico/cursos-activos";


        $scope.acceptJoinRequest = function(r)   {
            docenteAlumnoCursoService.solicitarAccesoCursoEstado(r, "Aceptada").then(function (resp) {
                var addArray = true;
                var res = resp.data;
                $scope.alumnosCurso.forEach(function (i) {
                    if (i.Alumno.Id == res.Alumno.Id)
                        addArray = false;
                })
                if (addArray)
                {
                    $scope.alumnosCurso.push(res);
                    $scope.alumnos.push(res.Alumno);
                }

                var count = 0;
                $scope.requests.forEach(function (i) {

                    if (i.Id == res.Id)
                    {
                        i = res;
                        $scope.requests.splice(count, 1);

                    }
                    count += 1;
                })

            });
        }
        $scope.getSolicitudesPendientes=function()   {
            docenteAlumnoCursoService.solicitudesPendientes($scope.curso.Id).then(function (resp) {
                $scope.requests = resp.data;
            })
        }


        $rootScope.$on("new:cursoJoinRequest", function (evt, request) {
            $scope.getSolicitudesPendientes();

        });

        $scope.loadCurso = function () {

          CursoService.one($scope.cursoId).then(function(resp){

              $scope.curso=resp.data;
              $rootScope.pageTitle = $scope.curso.Materia.Nombre; //TODO: Completar
              docenteAlumnoCursoService.alumnosByCurso($scope.cursoId).then(function (resp) {
                  $scope.alumnosCurso = resp.data;
                  $scope.alumnos = []

                  $scope.alumnosCurso.forEach(function(f){
                      $scope.alumnos.push(f.Alumno);
                  })
              });
              $scope.getSolicitudesPendientes();
              $rootScope.pageTitle = $scope.curso.Materia.Nombre;

          });
      };
        $scope.loadCurso();
        $scope.cambiarGrupo = function(grupo)        {
            GrupoService.one(grupo.Id).then(function (response) {
                $scope.alumnosGrupoSeleccionado = response.data.Alumnos;
            })
        }
    }]);
