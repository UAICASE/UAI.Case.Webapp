
var app = angular.module('uaicase.common',[]);
app.factory('CommonService', ['$http', '$rootScope','ENV' ,function ($http, $rootScope,ENV) {

        var getGender = function(name)
        {
            return $http.get("https://api.genderize.io/?name="+name)
        }

    var dias = function () {
        return $http.get(ENV.apiEndpoint+"/common/dias");

    }
    var turnos = function () {
        return $http.get(ENV.apiEndpoint+"/common/turnos");
    }
        var diagramas = function () {
            return $http.get(ENV.apiEndpoint+"/common/diagramas");

    }
    var sedes = function () {
        return $http.get(ENV.apiEndpoint+"/common/sedes");

    }

    var tipoContenido = function () {
        return $http.get(ENV.apiEndpoint+"/common/tipo-contenido");

    }
    var tipoNota = function () {
        return $http.get(ENV.apiEndpoint+"/common/tipo-nota");

    }
    var tipoClase = function () {
        return $http.get(ENV.apiEndpoint+"/common/tipo-clase");

    }
    var comisiones = function () {
        return $http.get(ENV.apiEndpoint+"/common/comisiones");

    }

    var tipoVisibilidadCurso = function()
    {
        return $http.get(ENV.apiEndpoint+"/common/tipo-visibilidad-curso")
    }


    return {
        turnos: turnos,
        diagramas:diagramas,
        dias: dias,
        sedes: sedes,
        tipoContenido: tipoContenido,
        tipoNota: tipoNota,
        tipoClase: tipoClase,
        comisiones: comisiones,
        tipoVisibilidadCurso: tipoVisibilidadCurso

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
app.factory('UsuarioService', ['$http','$rootScope','ENV',function ($http,$rootScope,ENV) {

                var changePassword = function (dto)
                {
                    return $http.post(ENV.apiEndpoint+"/usuarios/password", dto);
                }

                var put = function (usuario) {
                    return $http.put(ENV.apiEndpoint+"/usuarios", usuario);

                }

                var requestRegister = function (mail) {
                    return $http.post(ENV.apiEndpoint+"/request-register/", {Mail: mail})
                }
                var activate = function(id)
                {
                    return $http.get(ENV.apiEndpoint+"/usuarios/activate/"+id)
                }
                var one = function (id) {
                        return $http.get(ENV.apiEndpoint+"/usuarios/" + id);

                }
                var check = function (mail) {
                    return $http.post(ENV.apiEndpoint+"/usuarios/check/", { Mail: mail });

                }
                return {
                    requestRegister: requestRegister,
                    activate: activate,
                  one: one,
                  put: put,
                  check: check,
                  changePassword: changePassword
                };

            }]);
app.service('fileUpload', ['$http','ENV', function ($http,ENV) {
                var uploadFileToUrl = function (file) {
                    var fd = new FormData();
                    fd.append('file', file);


                   return $http.put(ENV.apiEndpoint+"/file/", fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                }

                return { uploadFileToUrl: uploadFileToUrl };
            }]);
app.service('fileDownload', ['$http','ENV' ,function ($http,ENV) {
                var downloadFile = function (f) {
                    $http({
                        url: ENV.apiEndpoint+'/file/'+f.Id,
                        method: 'GET',
                        params: {},
                        headers: {
                            'Content-type': 'application/json'
                        },
                        responseType: 'arraybuffer',
                        cache: false
                    })

                       .then(function (data, status, headers, config) {
                           var file = new Blob([data.data], {
                            //   type: 'application/octet-stream'
                           });
                           //trick to download store a file having its URL
                           var fileURL = URL.createObjectURL(file);
                           var a = document.createElement('a');
                           a.href = fileURL;
                           a.target = '_blank';
                           a.download = f.Nombre;

                           document.body.appendChild(a);
                           a.click();
                       }, function (error) {

                       });
                }

                return { downloadFile: downloadFile };
            }]);
