app.controller('GestionCursosController',
function ($scope, $window, $aside, MateriaService, docenteService, AlumnoService, CursoService,
  CommonService, $rootScope, docenteAlumnoCursoService, ThemeService) {



    // settings
    $scope.settings = {
        singular: 'Curso',
        plural: 'Cursos',
        cmd: 'Agregar'
    };

    CommonService.tipoVisibilidadCurso().then(function (response) {
        $scope.visibilidades = response.data;
    });

    CommonService.turnos().then(function (response) {
        $scope.turnos = response.data;
    });

    CommonService.dias().then(function (response) {
        $scope.dias = response.data;
    });

    CommonService.sedes().then(function (response) {
        $scope.sedes = response.data;
    });

    CommonService.comisiones().then(function (response) {
        $scope.comisiones = response.data;
    });

    AlumnoService.all().then(function (response) {
        $scope.alumnos = response.data;
    });

    docenteService.all().then(function (response) {
        $scope.docentes = response.data;
    });

    MateriaService.all().then(function (response) {
        $scope.materias = response.data;
    });






    $scope.loadData = function () {
        var usu = CursoService.all().then(function (items) {
            $scope.data = items.data;



        });

    }

    $scope.loadData();


    $scope.showModal = false;
    $scope.toggleModal = function () {

        $scope.showModal = !$scope.showModal;
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


    // defining template
    var formTpl = $aside({
        scope: $scope,
        template: '/assets/views/uaicase/tpl/gestion-cursos-form.html',
        show: false,
        placement: 'left',
        backdrop: true  ,
        animation: 'am-slide-left'
    });

    // methods
    $scope.checkAll = function () {
        angular.forEach($scope.data, function (item) {
            item.selected = !item.selected;
        });
    };

    $scope.editItem = function (item) {
        if (item) {
            item.editing = true;
            $scope.item = item;
            $scope.settings.cmd = 'Editar';
            showForm();
        }
    };

    $scope.viewItem = function (item) {
        if (item) {
            item.editing = false;
            $scope.item = item;
            $scope.settings.cmd = 'Ver';
            showForm();
        }
    };




    $scope.cursoPut = function () {

        CursoService.put($scope.item).then(function (curso) {
            //if (proyecto.data!=undefined && proyecto.data!="")

            ""
            if ($scope.item.Estado == "Nuevo")
                $scope.data.push(curso.data);
            $rootScope.$broadcast('curso:nuevo', $scope.data);

        }, function (error) {

        }).finally(function () {

            loadData();

        });


    };





    $scope.createItem = function () {
        var item = {
            editing: true,
            Estado: "Nuevo",
            Titular: null,
            Activo: true
        };
        $scope.item = item;
        $scope.settings.cmd = 'Nuevo';

        showForm();
    };



    $scope.saveItem = function () {
        if ($scope.settings.cmd == 'Guardar') {
            //TODO: Verificar que no esté en la coleccion
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





    $scope.addAlumnoToCurso=function(curso)
    {


        var alumnocurso = {};
            alumnocurso.alumno=curso.selectedAlumno;
            alumnocurso.curso = curso;

            docenteAlumnoCursoService.put(alumnocurso).then(function (data)
            {
                alumnocurso = data.data;
                if ($scope.alumnosCurso == null) $scope.alumnosCurso = [];
                if ($scope.alumnosCurso.filter(function (e) { return e.Id == alumnocurso.Id; console.log(e);}).length > 0)
                { }
                else
                {
                    $scope.alumnosCurso.push(alumnocurso);
                    $rootScope.$broadcast('curso:nuevo', alumnocurso);

                }





            });


    }


    $scope.alumnoCursoPut = function (i)
    {
      //  alert("guardando");
    }

    $scope.showFormAddAlumnos=function(item)
    {
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

    showForm = function () {
        angular.element('.tooltip').remove();

        formTpl.show();
    };

    hideForm = function () {
        formTpl.hide();
    };

    $scope.$on('$destroy', function () {
        hideForm();
        $scope.hideFormAddAlumnos();
    });

});
