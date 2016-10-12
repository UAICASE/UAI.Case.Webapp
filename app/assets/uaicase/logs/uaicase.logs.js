
var app = angular.module('uaicase.logs',[]);


app.factory('LogService', ['$http', 'ENV', function ($http, ENV) {


    var all = function (id) {
        return $http.get(ENV.apiEndpoint+"/logs/"+id );

    }
    return {
        all: all

    };

}]);

app.directive('verLogs',  function (LogService) {
  var controller = function (uaicasesignalr, $scope, LogService, $rootScope) {
$scope.logs=[];
  if ($scope.canal){
    LogService.all($scope.canal).then(function(resp){
      $scope.logs=resp.data;
    })
  }




$rootScope.$on("log:received",function(evt,log){

            var addToArray = true;
          for (var i = 0; i < $scope.logs.length; i++) {
              if ($scope.logs[i].Id === log.Id) {
                  addToArray = false;
              }
          }

          if ($scope.canal == log.IdDestino && addToArray) {

                  $scope.logs.push(log);
          }
});
};


  return {
      restrict: 'EA',
      templateUrl: 'assets/uaicase/logs/ver-logs.html',
      replace: true,
      controller: controller,
      scope: {
          canal: "@",
          titulo: "@"

      }
}
});

app.controller('LogsController', function (LogService) { });
