app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
    .when('/', {
        templateUrl: 'assets/views/dashboard.html',
        controller: 'DashboardController',
    })
    .when('/dashboard', {
        templateUrl: 'assets/views/dashboard.html',
        controller: 'DashboardController',
    })
    .when('/login', {
       templateUrl: 'assets/views/uaicase/login.html',
       controller: 'LoginController as vm',
    })
    .when('/cursos-activos',{
      templateUrl: 'assets/views/uaicase/mis-cursos-activos.html',
      controller: 'MisCursosActivosController',
     })
    .when('/cursos/',{
      templateUrl: 'assets/views/uaicase/cursos.html',
      controller: 'MisCursosController',
    })

    .when('/cursos/:id', {
      templateUrl: 'assets/views/uaicase/curso.html',
      controller: 'CursoController'
    })
    .when('/proyectos/diagrama/:id', {
            templateUrl: function (attr) {

        return 'assets/views/uaicase/diagrama.html';

    }})
    .when('/proyectos/', {
      controller: 'ProyectosController',
      templateUrl: 'assets/views/uaicase/gestion-proyectos.html'
    })
    .when('/proyectos/diagrama/', {
      controller: 'ProyectosController',
      templateUrl: 'assets/views/uaicase/gestion-proyectos.html'
    })
    .when('/grupos/:id', {
      templateUrl: 'assets/views/uaicase/grupo.html',
      controller: 'GrupoController',
    })
    .when('/grupos/', {
      controller: 'MisGruposController',
      templateUrl: 'assets/views/uaicase/mis-grupos-activos.html'
    })
    .when('/materias/:id', {
              templateUrl:  "assets/views/uaicase/materia.html",
              controller: "MateriaController"
    })
    .when('/materias/', {
      templateUrl:  "assets/views/uaicase/mis-materias.html",
      controller: "MisMateriasController"
    })
    .when('/mailer/', {
      templateUrl: 'assets/views/uaicase/mailer.html',
      controller: 'MailerController',
    })
    .when('/calendario/', {
      templateUrl: 'assets/views/calendario.html',
      controller: 'CalendarioController',

    })
    .when('/perfil/', {
      templateUrl: 'assets/views/uaicase/perfil.html',
      controller: 'UsuarioController',

    })

        .otherwise({
          redirectTo: '/404/'
        });
}])
.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 300;
}])
.config(['$datepickerProvider', function ($datepickerProvider) {
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd/MM/yyyy',
        iconLeft: 'md md-chevron-left',
        iconRight: 'md md-chevron-right',
        autoclose: true
    });
}])
.config(['$timepickerProvider', function ($timepickerProvider) {
    angular.extend($timepickerProvider.defaults, {
        timeFormat: 'HH:mm',
        iconUp: 'md md-expand-less',
        iconDown: 'md md-expand-more',
        hourStep: 1,
        minuteStep: 1,
        arrowBehavior: 'picker',
        modelTimeFormat: 'HH:mm'
    });
}])
.config(['$animateProvider', function ($animateProvider) {
    $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
}])
.factory('authHttpResponseInterceptor', function ($q, $rootScope) {

        return {
            // On request success
            request: function (config) {
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {

                return $q.reject(rejection);
            },
            response: function (response) {


              $rootScope.manageErrors(response.status);

                return response || $q.when(response);
            },
            responseError: function (rejection) {

                $rootScope.manageErrors(rejection.status);

                return $q.reject(rejection);
            }
        }
    })
.config(function ($httpProvider, jwtInterceptorProvider,$localStorageProvider,$animateProvider) {


          jwtInterceptorProvider.tokenGetter = ['AuthService', function (AuthService) {
              var token= AuthService.getToken();

              return token;
        }];
   $httpProvider.defaults.useXDomain = true;
   $httpProvider.interceptors.push('jwtInterceptor');
   $httpProvider.interceptors.push('authHttpResponseInterceptor');


//  $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
  $animateProvider.classNameFilter(/ng-animate-enabled/);
})
