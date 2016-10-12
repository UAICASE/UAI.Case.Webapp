
var app = angular.module('uaicase.auth', ['angular-jwt','app.constants','ngStorage']);

app.factory('AuthService', function($http,ENV,jwtHelper,$window,$sessionStorage,$location,$rootScope) {




var token;
var userId;
var tokenDecoded;

if ($sessionStorage.token)
{
  token=$sessionStorage.token;
  tokenDecoded=jwtHelper.decodeToken(token)
  $sessionStorage.tokenDecoded =  tokenDecoded;
    userId =  $sessionStorage.tokenDecoded.nameidentifier;

}



var getToken = function(){

  return token;
}

var getUserId = function(){
  if ($sessionStorage.tokenDecoded!=undefined)
    return  $sessionStorage.tokenDecoded.nameidentifier;
    return undefined;
}
var auth = function(mail,password) {
   return $http.post(ENV.apiEndpoint+'/auth', { Mail: mail, Password: password });
}

var getTokenDecoded=function(){
  return tokenDecoded;
}

var login=function(data) {
token=data.token;
$sessionStorage.token = token;
tokenDecoded=jwtHelper.decodeToken(token)
$sessionStorage.tokenDecoded =  tokenDecoded;

$rootScope.$emit('login',$sessionStorage.tokenDecoded);

}

var reset = function() {
  token=undefined;
  userId=undefined;
  tokenDecoded=undefined;
$sessionStorage.$reset();
}

var logout=function(){
  reset();
  $window.location.href="#/login"
}

var isAuthenticated = function () {

  return (!!$sessionStorage.token && !jwtHelper.isTokenExpired($sessionStorage.token));


}

      return {
        auth:auth,
          login:login,
          isAuthenticated: isAuthenticated,
          getToken: getToken,
          getTokenDecoded:getTokenDecoded,
          logout:logout,
          getUserId:getUserId,
          reset:reset,

      };
});
