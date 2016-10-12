var app = angular.module('uaicase.dashboard',[]);
app.directive('misCursosWidget', [ function () {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/dashboard/mis-cursos-widget.html',
        replace: true,
        link: function ($scope, $element) {

        }
    };
}]);

app.directive('misGruposWidget', [function () {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/dashboard/mis-grupos-widget.html',
        replace: true,
        link: function ($scope, $element) {

        }
    };
}]);
app.directive('misProyectosWidget', [function () {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/dashboard/mis-proyectos-widget.html',
        replace: true,
        link: function ($scope, $element) {

        }
    };
}]);
app.directive('misDiagramasWidget', [function () {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/dashboard/mis-diagramas-widget.html',
        replace: true,
        link: function ($scope, $element) {

        }
    };
}]);
app.directive('uaiCaseWidget', [function () {
    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/dashboard/uai-case-widget.html',
        replace: true,
        link: function ($scope, $element) {

        }
    };
}]);
