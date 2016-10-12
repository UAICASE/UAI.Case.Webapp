app.controller('GestionMateriasController',
    function (CommonService, $scope, $window, $aside, MateriaService, docenteService, $rootScope,ThemeService) {



    // settings
    $scope.settings = {
        singular: 'Materia',
        plural: 'Materias',
        cmd: 'Agregar'
    };

    $scope.addDiagramaToMateria=function(item)
    {
        if (item.DiagramasValidos==undefined    )
        {
            item.DiagramasValidos = [];
        }
        if (item.DiagramasValidos.filter(function (e) { return e.TipoDiagrama == item.DiagramaValidoSelected; console.log(e); }).length > 0)
        { }
        else
        {
            var diagramaMateria = {};
            diagramaMateria.TipoDiagrama = item.DiagramaValidoSelected;
            item.DiagramasValidos.push(diagramaMateria);


        }
    }
        CommonService.diagramas().then(function (response) {
        $scope.diagramas = response.data;
    });
    docenteService.all().then(function (response) {
       $scope.docentes= response.data;


    });

    $scope.getDocentes = function (str) {

        if (str.length > 3) {
            docenteService.where(str).then(function (response) {
                $scope.docentes = response.data;


            });
        }
    };





    $scope.loadData = function () {
        var usu = MateriaService.all().then(function (items) {
            $scope.data = items.data;



        });

    }

    $scope.loadData();



    // defining template
    var formTpl = $aside({
        scope: $scope,
        template: '/assets/views/uaicase/tpl/gestion-materias-form.html',
        show: false,
        placement: 'left',
        backdrop: true,
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




    $scope.materiaPut = function () {

        MateriaService.put($scope.item).then(function (materia) {
            //if (proyecto.data!=undefined && proyecto.data!="")

            ""
            if ($scope.item.Estado == "Nuevo")
                $scope.data.push(materia.data);
            $rootScope.$broadcast('materia:nuevo', $scope.data);

        }, function (error) {

        }).finally(function () {

            loadData();

        });


    };


    $scope.createItem = function () {
        var item = {
            editing: true,
            Estado: "Nuevo",
            Titular: null
        };
        $scope.item = item;
        $scope.settings.cmd = 'Nuevo';
        showForm();
    };



    $scope.saveItem = function () {
        if ($scope.settings.cmd == 'Guardar') {
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

    showForm = function () {
        angular.element('.tooltip').remove();
        formTpl.show();
    };

    hideForm = function () {
        formTpl.hide();
    };

    $scope.$on('$destroy', function () {
        hideForm();
    });

});
