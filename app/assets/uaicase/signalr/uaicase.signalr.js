var ﻿app = angular.module('uaicase.signalr',[]);
﻿app.value('backendServerUrl', 'http://localhost:5000');
app.factory('connectedUsers',  function () {

    var conectados = [];
    var rooms = new Array();

    return {

        initialize: function(){
          conectados=[];
          rooms=[];
        },
        joinRoom: function (roomId, usuario)        {
            var room = rooms[roomId];
            if (room)
            {
                var exist=false
                room.forEach(function (u) {
                    if (u == usuario)
                        exist = true;
                });

                if (!exist)
                {
                    room.push(usuario);

                }
            }
            else
            {
                room = [];
                room.push(usuario);
                rooms[roomId] = room;
            }
        },
        leaveRoom: function(roomId, usuario)        {
            var room = rooms[roomId];
            if (room) {
                var exist = false
                room.forEach(function (u) {
                    if (u == usuario) {
                        var index = room.indexOf(u);
                        room.splice(index, 1);


                    }
                });
            }

        },
        add: function (usuario) {

         //   if (conectados.filter(function (idx) { return idx == usuario; }).length == 0)
             conectados.push(usuario);
        },
        all: function ()         {
            return conectados;
        },
        remove: function (usuario)         {
            var index = conectados.indexOf(usuario);
            conectados.splice(index, 1);
        },
        room: function(roomid)  {
            return rooms[roomid];
        },
        allRooms: function ()         {
            return rooms;
        },
        isConnected: function (usuario) {
            return (conectados.indexOf(usuario)!=-1)
        }
    }

});
app.factory('backendHubProxy', ['$', 'backendServerUrl','AuthService','$rootScope',
  function ($, backendServerUrl,AuthService,$rootScope) {

      function backendFactory(serverUrl, hubName) {
          var connection = $.hubConnection(backendServerUrl);
          var userId =AuthService.getUserId();
          connection.qs = { "userId":userId  }
          var proxy = connection.createHubProxy(hubName);


          //connection.start(['webSockets', 'longPolling', 'serverSentEvents', 'foreverFrame']).done(function () { });

          return {
          disconnect : function(){
            return   connection.stop();
            },
            start: function(){
              return connection.start(['webSockets', 'longPolling', 'serverSentEvents', 'foreverFrame']).done(function () { });
            },
              on: function (eventName, callback) {

                  proxy.on(eventName, function (result) {
                     $rootScope.$apply(function () {
                          if (callback) {
                              callback(result);
                          }
                      });
                  });
              },
              invoke: function (methodName, callback, params) {
                //  connection.start(['webSockets', 'longPolling', 'serverSentEvents', 'foreverFrame']).done(function () {
                    proxy.invoke(methodName, params).done(function (result) {
                          $rootScope.$apply(function () {
                              if (callback) {
                                  callback(result);
                              }
                          });
                     });


                //  });
              }
          };
      };

      return backendFactory;
  }]);
app.factory('uaicasesignalr',function(connectedUsers, backendHubProxy,$rootScope,ThemeService){

var proxy;
  var disconnect = function(){
    proxy.disconnect();
  }

var getProxy = function(){
  return proxy;
}
  var initialize = function(){

    connectedUsers.initialize();
    proxy = new backendHubProxy(backendHubProxy.defaultServer, 'messageHub');

  proxy.on("newChatMessage", function (message) {
        $rootScope.$broadcast("new:chatMessage", message);
    });
   proxy.on("SayWhoIsTyping", function (dto) {
        var grupo = dto.split("%")[0];
        var user = dto.split("%")[1];
        $rootScope.$broadcast("typing:chatMessage",grupo,user);
    });

  proxy.on("newCursoJoinRequest", function (rq) {
        $rootScope.$broadcast("new:cursoJoinRequest", rq);
        ThemeService.showMessage('Acceso a Curso','Nueva Solicitud Recibida!')

    })
  proxy.on("newCursoJoinedExternal", function (rq) {
        $rootScope.$broadcast("new:newCursoJoinedExternal", rq);
        ThemeService.showMessage('Acceso a Curso','Te agregaron a un Curso Nuevo!')
    })
  proxy.on("newCursoJoinRequestAccepted", function (rq) {
        $rootScope.$broadcast("new:cursoJoinRequestAccepted", rq);
        ThemeService.showMessage('Acceso a Curso','Solicitud Aceptada!')


    })

    proxy.on("newLog", function (log) {
      $rootScope.$emit("log:received",log);
    })

    proxy.on("newTodo", function (log) {
        $rootScope.$emit("todo:received",log);
      })

  proxy.on("newMailMessage", function (mail) {
        $rootScope.$broadcast("new:mail", mail);

    });
  proxy.on("readMailMessage", function (m) {
      $rootScope.$broadcast("read:mail", m);
    });


  proxy.on("newEvaluationMessage", function (message) {
        //solo va a recibir esto una vez que entre por primera vez al diagrama
        //ser� necesario hacer un joinchannel apenas inicia la sesion?
        if ($rootScope.user.Rol == 'Docente')
            return;
        ThemeService.showmessage('Nueva Evaluación','Recibió una nueva evaluación!')
    });

  proxy.on("userConnected", function (u) {
      connectedUsers.add(u);
    });
    proxy.on("userDisconnected", function (u) {
          connectedUsers.remove(u);
          //indicar que suelta todos los hold que tiene en case
    });
    proxy.on("LeaveRoom", function (dto) {
          //SACO DE UN ROOM
          connectedUsers.leaveRoom(dto.room, dto.user);
      });
    proxy.on("JoinRoom", function (dto) {
          //AGREGO A UN ROOM
          connectedUsers.joinRoom(dto.room,dto.user);
    });
    proxy.on("allConnectedUsers", function (u) {

          u.forEach(function (e) {
              connectedUsers.add(e);
          })
      });

      proxy.on("AllConnectedInRoom", function ( dto) {
            //AGREGO A UN ROOM
            if (dto && dto.users) {
                dto.users.forEach(function (user) {
                    connectedUsers.joinRoom(dto.room, user);
                })
            }
        });


    return proxy.start();

}


return {
  initialize: initialize,
  disconnect:disconnect,
  getProxy:getProxy
}

})
