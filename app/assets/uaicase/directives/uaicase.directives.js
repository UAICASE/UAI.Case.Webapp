//app.factory('MailerService', [function ($rootScope, mailService) {
var app = angular.module('uaicase.directives',[]);
app.directive('estadoUsuario', ['connectedUsers', '$rootScope','AuthService' ,function (connectedUsers, $rootScope,AuthService) {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/directives/estado-usuario-widget.html',
        replace: true,
        scope: {
            usuario: '@',

        },
        link: function (scope, element, attrs) {
            scope.usuario = attrs.usuario,

            scope.conectados = connectedUsers.all(),
            scope.userid=$rootScope.user.nameidentifier;//AuthService.getUserId();


        }

    };

}]);
app.directive('listaAlumnos', ['$rootScope', 'connectedUsers', '$timeout','AuthService', function ($rootScope, connectedUsers, $timeout,AuthService) {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/directives/lista-alumnos-widget.html',
        scope: {
            alumnos: "=",
            curso: "=",
            room:"@"


        },
        link: function (scope, element, attrs) {
            scope.titulo = attrs.titulo;
            scope.alumnos = scope.$eval(attrs.alumnos);
            scope.user = AuthService.getUserId();
            scope.sinDatos = attrs.sindatos;
            scope.curso = scope.$eval(attrs.curso);
            scope.observadores = attrs.observadores;

            scope.room = attrs.room;
            scope.allRooms = connectedUsers.allRooms();//connectedUsers.room($rootScope.selectedDiagramId);


            scope.$watchCollection('allRooms', function (newVal, oldVal) {
                //if (newVal !== oldVal) {
                if (scope.room)
                scope.rooms = newVal[scope.room];
                //}
            });



        }

    };

}]);
app.directive('paginationControls', function () {


    var controller = function ($scope) {


        $scope.loaded = false;
        if (!$scope.rango)
            $scope.rango = 2;
        $scope.numPerPage = $scope.max;
        $scope.currentPage = 1;

        $scope.numPages = function () {
            if ($scope.list != undefined)
                return Math.ceil($scope.list.length / $scope.numPerPage);
            else
                return 0;
        };




        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }



            for (var i = start; i < end; i++) {
                start = $scope.currentPage - $scope.rango -1;
                end = $scope.currentPage + $scope.rango;
                total = $scope.numPages();

                if ((i >= start) && (i <= end) && (i<=total-1))
                    ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        };

        $scope.firstPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage=1;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.numPages()) {
                $scope.currentPage++;
            }
        };

        $scope.lastPage = function () {
            if ($scope.currentPage < $scope.numPages()) {
                $scope.currentPage=$scope.numPages();
            }
        };

        $scope.setPage = function (n) {
            $scope.currentPage = n + 1;
        };

        $scope.$watch('list', function () {
            if ($scope.currentPage == undefined && $scope.list != undefined || !$scope.loaded)
            {
                $scope.currentPage = 1;
                firstLoad();
            }
        });



        firstLoad = function () {
            if ($scope.load)
                return;

            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

            if ($scope.list != undefined) {
                $scope.paged = $scope.list.slice(begin, end);
                $scope.loaded = true;
            }




        }

        $scope.paginate=function()
        {

            $scope.begin = (($scope.currentPage - 1) * $scope.numPerPage);
            $scope.end = $scope.begin + $scope.numPerPage;

            if ($scope.list != undefined) {
                $scope.paged = $scope.list.slice($scope.begin, $scope.end);


            }
        }

        $scope.$watch('list.length', function () {
            $scope.paginate();
        });
        $scope.$watch('currentPage + numPerPage', function () {
           $scope.paginate();

        });





    };








    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/directives/pagination-controls.html',
        replace: true,
        controller: controller,
        scope: {
            list: "=",
            paged: "=",
            max: "=",
            rango:"="




        }



    };

});
app.directive('uaiCaseCalendar', ['$rootScope', function ($rootScope) {


    var controller = function (moment,$scope) {

        var vm = $scope;

        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.events = [
          {
              title: 'An event',
              type: 'warning',
              startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
              endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
              draggable: true,
              resizable: true
          }, {
              title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
              type: 'info',
              startsAt: moment().subtract(1, 'day').toDate(),
              endsAt: moment().add(5, 'days').toDate(),
              draggable: true,
              resizable: true
          }, {
              title: 'This is a really long event title that occurs on every year',
              type: 'important',
              startsAt: moment().startOf('day').add(7, 'hours').toDate(),
              endsAt: moment().startOf('day').add(19, 'hours').toDate(),
              recursOn: 'year',
              draggable: true,
              resizable: true
          }
        ];

        vm.isCellOpen = true;

        vm.eventClicked = function (event) {
            alert.show('Clicked', event);
        };

        vm.eventEdited = function (event) {
            alert.show('Edited', event);
        };

        vm.eventDeleted = function (event) {
            alert.show('Deleted', event);
        };

        vm.eventTimesChanged = function (event) {
            alert.show('Dropped or resized', event);
        };

        vm.toggle = function ($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };

    };


    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/directives/calendar.html',
        replace: true,
        controller: controller,
        scope: {
            titulo:"@"
        }



    };

}]);

app.directive('validUserMail', ['$http', 'UsuarioService',
            function ($http, UsuarioService) {
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function (scope, elm, attrs, ctrl) {
                        var validateFn = function (viewValue) {


                            if (viewValue.length>5 )
                            {
                                UsuarioService.check(viewValue).then(function (response) {

                                        ctrl.$setValidity('validUserMail', response.data);

                                }, function (error) {
                                    ctrl.$setValidity('validUserMail', false);
                                });
                            }

                            return viewValue;

                        };
                        ctrl.$parsers.push(validateFn);
                        ctrl.$formatters.push(validateFn);
                    }
                }
            }]);
app.factory('EnumService', [function () {




                var htmlIconoLog = function (operacion)
                {
                    var icono = "<i class='icon-circle red-border accent-2'></i>";



                }

                var htmlEstado = function (estado,tipo) {

                    return "<span class='label label-"+tipo+"'>" + estado + "</span>";

                }




                return {
                    htmlEstado: htmlEstado,
                    htmlIconoLog: htmlIconoLog
                };

            }]);
