var app = angular.module('uaicase.academics',[]);

app.factory('AlumnoService', ['$http', '$rootScope','ENV', function ($http, $rootScope,ENV) {

                var put = function (alumno) {
                    return $http.put(ENV.apiEndpoint+"/alumno/", alumno);

                }


                var all = function (id) {
                    return $http.get(ENV.apiEndpoint+"/alumno/");

                }

                var one = function (id) {
                    return $http.get(ENV.apiEndpoint+"/api/alumno/" + id);

                }



                return {
                    one: one,
                    put: put,
                    all: all


                };

            }]);
            app.factory('DocenteService', ['$http', '$rootScope','ENV' ,function ($http, $rootScope,ENV) {

                var put = function (docente) {
                    return $http.put(ENV.apiEndpoint+"/docente/", docente);

                }


                var where = function(str)
                {
                    return $http.get(ENV.apiEndpoint+"/docente/where/"+str);
                }

                var all = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docente/");

                }

                var one = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docente/" + id);

                }



                return {
                    one: one,
                    put: put,
                    all: all,
                    where:where


                };

            }]);
app.factory('DocenteService', ['$http', '$rootScope','ENV' ,function ($http, $rootScope,ENV) {

                var put = function (docente) {
                    return $http.put(ENV.apiEndpoint+"/docente/", docente);

                }


                var where = function(str)
                {
                    return $http.get(ENV.apiEndpoint+"/docente/where/"+str);
                }

                var all = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docente/");

                }

                var one = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docente/" + id);

                }



                return {
                    one: one,
                    put: put,
                    all: all,
                    where:where


                };

            }]);
app.factory('docenteAlumnoCursoService', ['$http', '$rootScope','ENV', function ($http, $rootScope,ENV) {



                var byCurso = function(cursoId)
                {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/curso/"+cursoId)
                }

                var alumnosByCurso = function (cursoId) {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/curso/alumnos/" + cursoId)
                }
                var put= function (item) {
                    return $http.put(ENV.apiEndpoint+"/docenteAlumnoCurso/", item);

                }

                var solicitarAccesoCursoEstado = function (curso,estado) {
                    return $http.put(ENV.apiEndpoint+"/docenteAlumnoCurso/solicitar-acceso/curso/"+estado, curso);
                }


                var solicitarAccesoCurso = function (curso) {
                    return $http.put(ENV.apiEndpoint+"/docenteAlumnoCurso/solicitar-acceso/curso/", curso);    }

                var solicitudesPendientes = function(cursoId)
                {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/solicitudes-pendientes/curso/" + cursoId)
                }

                var removeAlumnoFromGrupo=function(grupo)
                {
                    return $http.put(ENV.apiEndpoint+"/docenteAlumnoCurso/quitar-mi-grupo", grupo);
                }
                var putAlumnoInGrupo = function(grupo)
                {
                    return $http.put(ENV.apiEndpoint+"/docenteAlumnoCurso/mi-grupo", grupo);
                }

                var getMiGrupo =function(curso) {
                    return $http.post(ENV.apiEndpoint+"/docenteAlumnoCurso/mi-grupo",curso);
                }

                var misGruposActivos =function()
                {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/mis-grupos-activos");
                }

                var misCursos = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/mis-cursos");

                }

                var misMaterias = function()
                {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/mis-materias");
                }

                var misCursosActivos = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/mis-cursos-activos");

                }
                var misCursosFinalizados = function (id) {
                    return $http.get(ENV.apiEndpoint+"/docenteAlumnoCurso/mis-cursos-finalizados");

                }


                return {
                    byCurso:byCurso,
                    put: put,
                    misGruposActivos: misGruposActivos,
                    misCursos: misCursos,
                    misCursosActivos: misCursosActivos,
                    misCursosFinalizados: misCursosFinalizados,
                    putAlumnoInGrupo: putAlumnoInGrupo,
                    getMiGrupo: getMiGrupo,
                    removeAlumnoFromGrupo: removeAlumnoFromGrupo,
                    alumnosByCurso: alumnosByCurso,
                    solicitarAccesoCurso: solicitarAccesoCurso,
                    solicitudesPendientes: solicitudesPendientes,
                    solicitarAccesoCursoEstado: solicitarAccesoCursoEstado,
                    misMaterias:misMaterias


                };


            }]);
app.factory('claseService', ['$http', '$rootScope','ENV' ,function ($http, $rootScope,ENV) {





                var allByCurso = function (cursoId) {
                    return $http.get(ENV.apiEndpoint+"/clase/curso/"+cursoId);

                }

                var putUnidad = function(unidadClase)    {
                    return $http.put(ENV.apiEndpoint+"/clase/unidad", unidadClase);
                }

                var put = function (clase) {
                    return $http.put(ENV.apiEndpoint+"/clase/", clase);

                }
                return {
                    put: put,
                    putUnidad :putUnidad,
                    allByCurso: allByCurso
                };

            }]);
app.factory('notaService', ['$http', 'ENV',function ($http,ENV) {




                return {
                    fromCurso:function(cursoId)
                    {
                        return $http.get(ENV.apiEndpoint+"/nota/curso/"+ cursoId);//.then(function (r) {
                    },
                    put: function (nota) {


                        return $http.put(ENV.apiEndpoint+"/nota/", nota);//.then(function (r) {




                    }};

            }]);
  ﻿
