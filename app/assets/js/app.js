/*jslint strict: true */

var app = angular.module('uai-case', [
  'app.constants',
  'uaicase.theme',
  'uaicase.security',
  'uaicase.mail',
  'uaicase.logs',
  'uaicase.signalr',
  'uaicase.chat',
  'uaicase.todo',
  'uaicase.common',
  'uaicase.directives',
  'uaicase.materias',
  'uaicase.cursos',
  'uaicase.grupos',
  'uaicase.dashboard',
  'uaicase.academics',
  'uaicase.projects',
  'uaicase.case',
   'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ngPlaceholders',
  'ngTable',
  'angularMoment',
  'angular-loading-bar',
  'ui.tree',
  'angulartics',
  'angulartics.google.analytics',
  'ui.select',
  'monospaced.elastic',     // resizable textarea
  'mgcrea.ngStrap',
  'jcs-autoValidate',
  'ngFileUpload',
  'textAngular',
  'fsm',                    // sticky header
  'smoothScroll',
  'LocalStorageModule',

  'mwl.calendar',
  'angular-jwt',
  'theme.services',
'ngStorage'
  ]);

app.constant('$', window.jQuery);
app.run(['$http','AuthService',function ($http,AuthService)
{

}]);
