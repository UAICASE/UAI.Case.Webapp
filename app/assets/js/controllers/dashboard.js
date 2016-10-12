app.controller('DashboardController',
    function($window, $scope, $rootScope, $interval, colorService,ProyectoService,AuthService,MailerService){

      $rootScope.pageTitle = 'Dashboard';


      $scope.inbox = function(){
        return MailerService.getInbox();
      }

      pattern = [];
      pattern.push(colorService.theme());


      $rootScope.$on('todos:count', function (event, count) {
              $scope.todosCount = count;

              element = angular.element('#todosCount');

              if (!element.hasClass('animated')) {
                  $animate.addClass(element, 'animated bounce', function () {
                      $animate.removeClass(element, 'animated bounce');
                  });
              }
          });

      $scope.color_pattern = pattern.join();





      var getPendientesPorGrupos =function()  {
        //  GrupoService.getTodoPendientes().then(function (response) {
        //      if (response.data != -1)
        //      $rootScope.pendientesPorGruposCount = response.data;

        //  })
      }
      var getDiagramasInfo = function () {
          // if ($rootScope.user != undefined &&  $rootScope.user.Rol == "Alumno") {
          //     ProyectoService.countDiagramas().then(function (response) {
          //         $scope.misDiagramasCount = response.data;
          //     });
          // }
      };
      var getProyectInfo = function () {
          // if ($rootScope.user != undefined && $rootScope.user.rol == "Alumno") {
          //     ProyectoService.resumen().then(function (response) {
          //         $scope.proyectsCount = response.data.Count;
          //         $scope.proyectoResumen = response.data;
          //
          //     });
          // }
      };

      $rootScope.$on("diagrama:event", function (event) {
                          getDiagramasInfo();
                      });
      $rootScope.$on('project:event', function (event) {
                              getProyectInfo();
                          });
      $rootScope.$on('proyecto:nuevo', function (event, count) {

                              element = angular.element('.proyectsCount');
                              $scope.proyectsCount = count;
                              $rootScope.$broadcast('project:event');
                              if (!element.hasClass('animated')) {
                                  $animate.addClass(element, 'animated bounce', function () {
                                      $animate.removeClass(element, 'animated bounce');
                                  });
                              }
                          });

  });
