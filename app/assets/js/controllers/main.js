
app.controller('MainController', [ 'MailerService',  'uaicasesignalr',  '$scope', '$animate', 'localStorageService',   '$rootScope', 'ProyectoService', '$aside','docenteAlumnoCursoService',    'elementoService', 'AuthService','$location',
                           function ( MailerService, uaicasesignalr,  $scope, $animate, localStorageService,  $rootScope, ProyectoService, $aside, docenteAlumnoCursoService,   elementoService,AuthService,  $location) {


var vm = this;



vm.isAuthenticated = function() {
  return AuthService.isAuthenticated();
}




$scope.$on('$routeChangeStart', function (event, next, current) {

if (AuthService.isAuthenticated()) {

//do nothing
   } else {
    $location.path("/login");
   } });

 $scope.$on('$routeChangeSuccess', function (e) {
//do something
   });

      $scope.theme_colors = [
        'pink','red','purple','indigo','blue',
        'light-blue','cyan','teal','green','light-green',
        'lime','yellow','amber','orange','deep-orange'
      ];


      vm.sidebarMenu = true;



      //select project events & goodies
      $scope.deselectProyecto = function()  {

             $rootScope.closeExplorer();


             if ($rootScope.selectedDiagram) {
                 $rootScope.messageHubProxy.invoke('LeaveRoom', function () { }, $rootScope.selectedDiagram.Id);

             }

          $rootScope.selectedDiagram = $rootScope.selectedProyect = undefined;
          //location.href = "/app/#/proyectos/gestion-proyectos";
      }
      $rootScope.showExplorer=function() {
          //$rootScope.explorer = true;
          formTpl.show();
      }
      $rootScope.closeExplorer=function(){
          //$rootScope.explorer = false;
          formTpl.hide();
      }
      var formTpl = $aside({
          scope: $scope,
          template: 'assets/views/uaicase/tpl/proyecto-explorer.html',
          show: false,
          placement: 'left',
          backdrop: true,
          animation: 'am-slide-left'
      });
      $scope.$on("proyecto:deselect", function (event, proyecto) {
          deselectProyect();


      });
      $rootScope.$on("close:diagram", function () {
          if ($rootScope.selectedDiagram)
              $rootScope.messageHubProxy.invoke('LeaveRoom', function () { }, $rootScope.selectedDiagram.Id);
          $rootScope.selectedDiagram = $rootScope.selectedModel = undefined;
          location.href = "/app/#/proyectos/gestion-proyectos";


      });
      $rootScope.$on("save:diagram", function () {

      });


  $rootScope.$on("proyecto:select", function (event, proyecto) {


          $rootScope.messageHubProxy.invoke('JoinRoom', function () { }, proyecto.Id);
          ProyectoService.one(proyecto.Id).then(function (response) {
              $rootScope.selectedProyect = response.data;
              //traigo los elementos
              elementoService.allByProyecto(proyecto.Id).then(function (response) {
                  $rootScope.selectedProyect.Elementos = response.data;
              })
          });


      });








  $rootScope.readMail = function (mail) {
      $rootScope.tmpMailItem = mail;
      MailerService.setReadedMail(mail);

  }
//  $rootScope.getInbox = function () {
//      var a = MailerService.getInbox();

  //    return a;
  //}
  //$rootScope.getOutbox = function () {
  //    var a = MailerService.getOutbox();

//      return a;
//  }





  var joinRoomMisMaterias = function()  {
    if (AuthService.getTokenDecoded().rol == "Docente") {
      docenteAlumnoCursoService.misMaterias().then(function (items) {
              items.data.forEach(function (e) {
                  uaicasesignalr.getProxy().invoke('JoinRoom', function () { }, e.Id);
              })
      })
}
  }
  var joinRoomGruposActivosInfo = function () {
          if (AuthService.getTokenDecoded().rol == "Alumno") {
                docenteAlumnoCursoService.misGruposActivos().then(function (response) {
                      response.data.forEach(function (e) {
                            uaicasesignalr.getProxy().invoke('JoinRoom', function () { }, e.Id); //signalr
                        })
                });
            }
        }
  var joinRoomCursosActivos = function()   {
    //para recibir notificaciones del server

      if (AuthService.getTokenDecoded().rol == "Docente" || AuthService.getTokenDecoded().rol == "Alumno") {
          docenteAlumnoCursoService.misCursosActivos().then(function (response) {
                response.data.forEach(function (e) {
                      uaicasesignalr.getProxy().invoke('JoinRoom', function () { }, e.Id);
                  })
          });
      }

  };

  vm.logout=function(){
    uaicasesignalr.disconnect();
      AuthService.logout();

  }

  $rootScope.$on('login', function (event, data) {
      initialFunctions();
    });


var initialFunctions=function(){
  if (AuthService.isAuthenticated()){
       $rootScope.user=AuthService.getTokenDecoded();
      $rootScope.userId=AuthService.getUserId();
        MailerService.initialize();
      uaicasesignalr.initialize().then(function(){
          //me suscribo a un channel propio pr recibir mis notifiaciones
        uaicasesignalr.getProxy().invoke('JoinRoom', function () { }, $rootScope.userId);
          joinRoomCursosActivos();
          joinRoomGruposActivosInfo();
          joinRoomMisMaterias();

        })


    }


}

//recargo si estoy logeado
initialFunctions();
  // template changing
      $scope.fillinContent = function () {
          $scope.htmlContent = 'content content';
      };
      $scope.changeColorTheme = function(cls){
          $rootScope.$broadcast('theme:change', 'Choose template');//@grep dev
          $scope.theme.color = cls;
      };
      $scope.changeTemplateTheme = function(cls){
          $rootScope.$broadcast('theme:change', 'Choose color');//@grep dev
          $scope.theme.template = cls;
      };
      if ( !localStorageService.get('theme') ) {
          theme = {
              color: 'theme-pink',
              template: 'theme-template-dark'
          };
          localStorageService.set('theme', theme);
      }
      localStorageService.bind($scope, 'theme');


//SIGNALR




      // manuel functions
      vm.menuIsOpen = true;

      vm.menuToggle = function () {
      vm.menuIsOpen = !vm.menuIsOpen;
      }


  }]);
