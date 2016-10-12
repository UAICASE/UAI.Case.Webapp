/// <reference path="../../../tpl/partials/uaicase/usecase-spec.html" />

app.controller('diagramaController', ['$', 'connectedUsers', 'uaiCaseService', '$scope', '$window', '$aside', 'ProyectoService', 'elementoService', '$rootScope', '$http', '$modal', 'evaluacionService', '$timeout', '$alert', '$routeParams',
    function ($,connectedUsers, uaiCaseService, $scope, $window, $aside, ProyectoService, elementoService, $rootScope, $http, $modal, evaluacionService, $timeout, $alert, $routeParams) {
   // if ($rootScope.selectedDiagram == undefined) location.href = "/app/#/proyectos/gestion-proyectos";

    $rootScope.pageTitle = "Herramienta de modelado";
    $scope.evaluaciones = [];

    if (!$routeParams.id || !$rootScope.selectedProyect)
      location.href = "/app/#/proyectos/gestion-proyectos";





  //  if ($rootScope.selectedDiagram == undefined) location.href = "/app/#/proyectos/gestion-proyectos";



    $rootScope.messageHubProxy.on("endEvaluationMessage", function (message) {

        var idx = -1;


        for (i = 0; i < $scope.evaluaciones.length; i++) {

            if ($scope.evaluaciones[i].Id==message.Id)
            {
                idx = i;
            }
        }

        if (idx>=0)
        $scope.evaluaciones.splice(idx, 1);


    });


    $rootScope.messageHubProxy.on("newEvaluationMessage", function (message) {


        $scope.evaluaciones.push(message);



    });


    $scope.finalizarEvaluacion = function (item) {
        evaluacionService.finalizarEvaluacion(item.Id).then(function (resp) {
            $scope.evaluaciones.forEach(function (i) {
                if (i.Id == item.Id)
                    i.Estado = resp.data.Estado;
            });
        });

    }


    $scope.showEvaluaciones = false;

    $scope.toggleEvaluaciones=function()
    {
        $scope.showEvaluaciones = !$scope.showEvaluaciones;
    }
    $scope.showChat = false;
    $scope.toggleChat = function () {
        $scope.showChat = !$scope.showChat;
        $rootScope.$emit("chat:toggle",$scope.showChat)

    };





    //$scope.$on("open:diagram", function (event, item) {
    //    $scope.load();

    //});

    $scope.closeDiagram = function()     {
        uaiCaseService.closeDiagram();
        $rootScope.$broadcast("close:diagram");
    }

    $scope.paperClass = function () {

        var tot = 12;
        if ($scope.showStencil)
            tot = tot - 3;
        if ($scope.showInspector)
            tot = tot - 2;
        if ($scope.showEvaluaciones)
            tot = tot - 3;
        if ($scope.showChat)
            tot = tot - 4;

        return "col-md-"+tot;
    }
    $scope.stencilClass=function()     {
        return "col-md-3";
    }
    $scope.evaluacionClass=function()     {
        return "fondo-chat col-md-3";
    }
    $scope.inspectorClass=function()     {
        return "col-md-2";
    }
    $scope.chatClass = function () {
        return "fondo-chat col-md-4";
    }

    $scope.showStencil = true;
    $scope.toggleStencil = function()     {
        $scope.showStencil = !$scope.showStencil;
    }
    $scope.showNavigator = false;
    $scope.toggleNavigator = function () {
        $scope.showNavigator = !$scope.showNavigator;
    }

    $scope.showInspector = false;
    $scope.toggleInspector = function () {
        $scope.showInspector = !$scope.showInspector;
    }

    $scope.load = function () {

        var id = $routeParams.id;
        $rootScope.selectedDiagramId = id
        elementoService.one(id).then(function (resp) {


            $scope.diagrama = resp.data;
            $rootScope.selectedDiagram = $scope.diagrama;



      //  var diagrama = $rootScope.selectedDiagram;
        evaluacionService.obtenerEvaluaciones($scope.diagrama.Id).then(function (res) {
            $scope.evaluaciones = res.data;
        });

        ProyectoService.collaborators($rootScope.selectedProyect.Id).then(function (resp) {
            $scope.colaboradores = resp.data;
        });


        });


    }



    $scope.load();
    $scope.save = function ()
    {
       // var diagram = $rootScope.selectedDiagram;
        uaiCaseService.saveGraph($scope.diagrama.Id);

    }


    $scope.printDiagram = function ()     {
        uaiCaseService.print();
    }
    $scope.exportDiagramAsPNG = function ()     {
        uaiCaseService.exportAsPNG($scope.diagrama);
    }
    $scope.zoomin = function()     {
        uaiCaseService.getPaperScroller().zoom(0.2, { max: 5, grid: 0.2 });
    }

    $scope.zoomout = function () {
        uaiCaseService.getPaperScroller().zoom(-0.2, { min: 0.2, grid: 0.2 });
    }
    $scope.zoomfit = function () {
        uaiCaseService.getPaperScroller().zoomToFit({
            padding: 20,
            scaleGrid: 0.2,
            minScale: 0.2,
            maxScale: 5
        });
    }

    $scope.undo=function()     {
        uaiCaseService.getCommandManager().undo();
    }

    $scope.redo = function()     {
        uaiCaseService.getCommandManager().redo();
    }



    $scope.unhightlightElement=function(id)     {
        var graph = uaiCaseService.getGraph();

        var cell = graph.getCell(id);
        if (cell != undefined) {
            var view = cell.findView(uaiCaseService.getPaper());

            view.unhighlight(cell);


        }
    }
    $scope.highlightElement=function(id)     {
        var graph = uaiCaseService.getGraph();

        var cell = graph.getCell(id);
        if (cell != undefined) {
            var view = cell.findView(uaiCaseService.getPaper());

            view.highlight(cell);
        }

    }


    }]);
