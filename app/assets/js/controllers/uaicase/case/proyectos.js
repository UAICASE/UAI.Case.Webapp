
app.controller('ProyectosController', ['$', 'uaiCaseService', '$scope', '$window', '$aside', 'ProyectoService', '$rootScope', '$http', '$modal',
    function ($, uaiCaseService, $scope, $window, $aside, ProyectoService, $rootScope, $http, $modal) {





    }]);

    //http://codepen.io/templarian/pen/VLKZLB
    app.controller('ProyectoExplorerController', ['$scope', '$rootScope', 'ProyectoService', 'elementoService','$popover',
    function ($scope, $rootScope, ProyectoService, elementoService,$popover) {

        $scope.root = undefined;



        $scope.saveNode=function(node)
        {
            elementoService.put(node).then(function (resp) {
                node.editing = false;
                node = resp.data;
            });
        }






          $scope.toggle = function (scope) {
              scope.toggle();
          };



          $scope.newModel = function (scope,tipo,isFolder) {
               var elemento = {};
              elemento = {
                  Nombre: tipo,
                  DiagramType: tipo,
                  editing: true,
                  IsFolder: !!isFolder
              }
              var isRoot = false;

              if (scope == undefined) {
                //  nodeData = scope.$modelValue;
                  isRoot = true;
                  //si no tiene scope es porque es root

                  elemento.IdProyecto = $rootScope.selectedProyect.Id;
                  scope = elemento;
              }

              else {

                  if (!scope.Elementos)
                      scope.Elementos = [];
                  scope.visible = true;
                      scope.Elementos.push(elemento);

              }



              var update = function(node, resp)
              {
                  if (node.Id == resp.Id) {
                      node.Id = resp.Id;
                      node.Elementos = resp.Elementos;
                  }
                  else
                  {
                      node.Elementos.forEach(function (i) {
                          update(i,resp);
                      })
                  }
              }

              //ver el tema de la recursividad
              elementoService.put(scope).then(function (resp) {
                  $rootScope.$broadcast("diagrama:event");

                  if (isRoot) {
                      if (!$rootScope.selectedProyect.Elementos)
                          $rootScope.selectedProyect.Elementos = [];
                      $rootScope.selectedProyect.Elementos.push(resp.data);
                  }
                  else {
                      $rootScope.selectedProyect.Elementos.forEach(function (i) {
                          update(i,resp.data);
                      })
                  }
                 //rootScope.$broadcast("proyecto:select", $rootScope.selectedProyect);
              })
              //saveProyect();
          };

          $scope.openDiagram = function (item) {
              if (item.Id == undefined)
                  return;

              $rootScope.messageHubProxy.invoke('JoinRoom', function () {


                  location.href = "/app/#/proyectos/diagrama/" + item.Id;
                  $rootScope.closeExplorer();
              }, item.Id);



          };

          $scope.collapseAll = function () {
              $scope.$broadcast('collapseAll');
          };

          $scope.expandAll = function () {
              $scope.$broadcast('expandAll');
          };





      }
    ]);


    /// <reference path="../../../tpl/partials/uaicase/usecase-spec.html" />
    app.controller('ProjectDashboardController', ['$', 'uaiCaseService', '$scope', '$window', '$aside', 'ProyectoService', '$rootScope', '$http', '$modal', 'evaluacionService',
    function ($, uaiCaseService, $scope, $window, $aside, ProyectoService, $rootScope, $http, $modal, evaluacionService) {


        $rootScope.pageTitle = "Dashboard del proyecto";
        if (!$rootScope.selectedProyect)
            if ($rootScope.selectedDiagram == undefined) location.href = "/app/#/proyectos/gestion-proyectos";

        $scope.proyecto = $rootScope.selectedProyect;


        $scope.actionTab = 1;


        $scope.loadData = function () {

        }


        $scope.loadData();



    }]);
