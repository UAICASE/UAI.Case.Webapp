app.controller('evaluacionCaseController',
function ($, $scope, $rootScope,  uaiCaseService,evaluacionService,ThemeService) {


    $scope.modelo = $rootScope.selectedModel;
    $scope.diagrama = $rootScope.selectedDiagram;
    $scope.evaluaciones =[];



    $scope.nuevaEvaluacion = function () {

        if (!$scope.evaluaciones)
            $scope.evaluaciones = [];

        var item = {};
        item.Descripcion = "nueva evaluacion";
        item.ModeloId = $scope.modelo.id;
        item.DiagramaId = $scope.diagrama.Id;
        evaluacionService.put(item).then(function (resp) {
            $scope.evaluaciones.push(resp.data);
        });



    }

    $scope.guardarCambios=function(e)
    {
        evaluacionService.putRespuesta(e).then(function (resp) {

        });
    }


    $scope.toggleVisible=function(c)
    {
        if (!c.visible)
            c.visible=false;

        c.visible=!c.visible;
    }

    $scope.treeClass = function (u) {
        var ret;
        if (u.Respuestas != undefined) {
            if (u.Respuestas.length > 0)
                ret = "<i class='md md-keyboard-arrow-right'></i>";
            else
                ret = "";
        }



        if (u.visible) {
            ret = "<i class='md md-keyboard-arrow-down'></i>";
        }

        return ret;
    }

    $rootScope.messageHubProxy.on("endEvaluationMessage", function (message) {
        if (!$scope.evaluaciones)
            $scope.evaluaciones = [];

        var esta = false;

        $scope.evaluaciones.forEach(function (i) {
            if (i.Id == message.Id) {
                i.Estado = message.Estado;
                esta = true;
            }

        })
        if (!esta)
            $scope.evaluaciones.push(message);

    });

    $rootScope.messageHubProxy.on("newEvaluationMessage", function (message) {

        if (!$scope.evaluaciones)
            $scope.evaluaciones = [];

        var esta = false;

        $scope.evaluaciones.forEach(function (i) {
            if (i.Id == message.Id) {
                i.Estado = message.Estado;
                esta = true;
            }

        })
        if (!esta)
            $scope.evaluaciones.push(message);

    });
    $rootScope.messageHubProxy.on("newEvaluationResponseMessage", function (message) {



        //reocoorro y agrego

        $scope.evaluaciones.forEach(function (i) {
            if (i.Id==message.EvaluacionId)
            {
                if (!i.Respuestas)
                    i.Respuestas = [];
                var esta=false;
                i.Respuestas.forEach(function (x) {
                    if (x.Id==message.Id)
                    {
                        x.Comentario = message.Comentario;
                        esta = true;
                    }
                })
                if (!esta)
                    i.Respuestas.push(message);

            }
        })



    });

    $scope.responder=function(item)
    {

        if (!item.Respuestas)
            item.Respuestas = [];

        var resp = {};
        resp.EvaluacionId = item.Id;
        resp.ModeloId = item.DiagramaId;
        resp.Comentario = "nueva respuesta";
        resp.editable = true;

        evaluacionService.putRespuesta(resp).then(function (response) {
           // item.Respuestas.push(response.data); lo recibo por socket
        });
    }


    $scope.finalizar = function (item) {
        evaluacionService.finalizarEvaluacion(item.Id).then(function (resp) {
            $scope.evaluaciones.forEach(function (i) {
                if (i.Id == item.Id)
                    i.Estado = resp.data.Estado;
            });
        });

    }

    $scope.activar = function (item) {
        evaluacionService.activarEvaluacion(item.Id).then(function (resp) {
            $scope.evaluaciones.forEach(function (i) {
                if (i.Id == item.Id)
                    i.Estado = resp.data.Estado;
            });
        });

    }

    $scope.guardar=function(item)
    {
        evaluacionService.put(item).then(function (resp) {
            ""
        });
    }

    $scope.load=function()
    {


        evaluacionService.all($scope.modelo.id).then(function (res) {

            $scope.evaluaciones = res.data;
        });



    }

    $scope.load();

});
