app.controller('alumnosController', ['connectedUsers', '$scope', '$window', '$aside', 'AlumnoService', 'CursoService', '$rootScope', 'docenteAlumnoCursoService',
    function (connectedUsers,$scope, $window, $aside, AlumnoService, CursoService, $rootScope, docenteAlumnoCursoService) {

        $scope.gruposCurso = {};
        $rootScope.$on("cargar:alumnos:curso", function (event, item) {
            $scope.alumnosCurso = item;

    });


        $scope.conectados = connectedUsers.all();
  $rootScope.$on("cargar:grupos:curso", function (event, item, cursoActual) {
      $scope.cursoActual = cursoActual;
     $scope.gruposCurso = item;

     actualizarGrupoActual(g);


  });

  var actualizarGrupoActual=function(g)
  {
      $scope.gruposCurso.forEach(function (g) {

          if ($scope.cursoActual.Grupo == null || $scope.cursoActual.Grupo == undefined)
              g.isInGroup = false;
          else
          g.isInGroup = (g.Id == $scope.cursoActual.Grupo.Id);
      })
  }

  $rootScope.$on("cargar:alumnos:grupo", function (event, item) {

      $scope.alumnosGrupo = item;


  });



    $scope.checkAll = function () {
        angular.forEach($scope.alumnosCurso, function (i) {
            i.selected = !i.selected;
        });
    };


    $scope.removeAlumnoFromGrupo = function(i)
    {
        i.grupo = i.grupoSelected;
        docenteAlumnoCursoService.removeAlumnoFromGrupo(i).then(function (res) {
            $scope.cursoActual = res.data;
            actualizarGrupoActual($scope.cursoActual.Grupo);
            $rootScope.$broadcast("grupo:event");
            $rootScope.$broadcast('grupo:pendientes:event');
        });


    }


    $scope.putAlumnoInGrupo = function(i)
    {
        i.grupo = i.grupoSelected;
        docenteAlumnoCursoService.putAlumnoInGrupo(i).then(function (res) {
            $scope.cursoActual = res.data;
            actualizarGrupoActual($scope.cursoActual.Grupo);
            $rootScope.$broadcast("grupo:event");
            $rootScope.$broadcast('grupo:pendientes:event');

        }, function (response) {
            if (response.status==304)
            {
                alert("El grupo no acepta mas integrantes!");
            }
        });

    }

    $scope.isInGroup= function(item)
    {

        if ($scope.alumnosCurso!=undefined)
        {
            var resp;
            $scope.alumnosCurso.forEach(function (entry) {

                if (item.Id == entry.Grupo.Id) {
                    resp = true;
                }
                else
                {
                    resp= false;
                }
            })
        }
        else
            resp= false;

        return resp;

    }


}]);
