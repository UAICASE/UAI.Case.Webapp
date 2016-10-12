var app = angular.module('uaicase.grupos',[]);
﻿app.factory('GrupoService', ['$http', 'ENV', function ($http,ENV) {


//    var getTodoPendientes = function()
  //  {
  //      return $http.get(ENV.apiEndpoint+"/todo/todo");  //TODO: ver como poner en TODO-Grupo-Service
  //  }

    var put = function (grupo) {
        return $http.put(ENV.apiEndpoint+"/grupo/",grupo);

    }
    var putInGrupo= function (alumnogrupo) {
        return $http.put(ENV.apiEndpoint+"/grupo/alumno",alumnogrupo);

    }

    var getAllByCursoWithAlumnos = function (idCurso) {
        return $http.get(ENV.apiEndpoint+"/grupo/alumno/" + idCurso);

    }

    var getCountAlumnosOfGrupo = function (grupoId)
    {
        return $http.get(ENV.apiEndpoint+"/count/" + grupoId);
    }

    var one = function (grupoId) {
        return $http.get(ENV.apiEndpoint+"/grupo/"+ grupoId);

    }


    var byCurso = function(curso)
    {
        return $http.get(ENV.apiEndpoint+"/grupo/curso/"+curso)
    }
    return {

        getAllByCursoWithAlumnos: getAllByCursoWithAlumnos,
      put: put,
        byCurso: byCurso,
        putInGrupo: putInGrupo,
        one: one
        //getTodoPendientes: getTodoPendientes


    };

}]);
