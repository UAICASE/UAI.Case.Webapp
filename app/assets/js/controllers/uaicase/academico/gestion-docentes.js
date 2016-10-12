app.controller('GestionDocentesController',
function ($scope, $window, $aside, docenteService, $rootScope,UsuarioService) {



    // settings
    $scope.settings = {
        singular: 'Docente',
        plural: 'Docentes',
        cmd: 'Agregar'
    };


    $scope.sendRegistrationRequest = function (item) {

        UsuarioService.activate(item.Id).then(function (res) {

            item = res.data;
            for (var i in $scope.data) {
                if ($scope.data[i].Id == item.Id) {
                    $scope.data[i] = item;
                    break; //Stop this loop, we found it!
                }
            }

        });

    }

    $scope.estado=function(item)
    {
        if (item == undefined)
            return null;
        var iconVerified = "<i class='md md-verified-user' data-placement='top' data-title='Usuario valido en el sistema' bs-tooltip></i>";
        var iconNoVerified = "<i class='md md-alarm' data-placement='top' data-title='Usuario inexistente' bs-tooltip></i>";
        var iconRequested = "<i class='md md-send' data-placement='top' data-title='Solicitud enviada' bs-tooltip></i>";

        if (item.RequestedToLogin)
            return iconRequested;
        if (item.Active)
            return iconVerified;

        return iconNoVerified;

    }
    $scope.loadData = function () {
        var usu = docenteService.all().then(function (items) {
            $scope.data = items.data;



        });

    }

    $scope.loadData();



    // defining template
    var formTpl = $aside({
        scope: $scope,
        template: '/assets/views/uaicase/tpl/gestion-docentes-form.html',
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




    $scope.docentePut = function () {

        docenteService.put($scope.item).then(function (docente) {
            //if (proyecto.data!=undefined && proyecto.data!="")

            ""
            if ($scope.item.Estado == "Nuevo")
                $scope.data.push(docente.data);
            $rootScope.$broadcast('docente:nuevo', $scope.data);

        }, function (error) {

        }).finally(function () {

            loadData();

        });


    };


    $scope.createItem = function () {
        var item = {
            editing: true,
            Estado: "Nuevo"
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
