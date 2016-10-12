
var app = angular.module('uaicase.chat',[]);


app.factory('ChatService', ['$http', '$rootScope','ENV', function ($http, $rootScope,ENV) {




    return {
        readOne:function(mensaje)
        {
            return $http.post(ENV.apiEndpoint+"/chat/read/" + mensaje.Id);
        },
        readAll:function(canal)
        {
            return $http.post(ENV.apiEndpoint+"/chat/read-all/"+ canal);
        },

        send: function (mensaje, destino) {


            var msg = {};
            msg.IdDestino = destino;
            msg.Mensaje = mensaje;
            return $http.put(ENV.apiEndpoint+"/chat/", msg);//.then(function (r) {
            //$scope.chatMessage = "";
            //});




        },
    all: function (idGrupo) {
        return $http.get(ENV.apiEndpoint+"/chat/"+idGrupo);

    }

    };

}]);

app.controller('ChatsController', function (ChatService) { });

﻿app.directive('verChat', ['$rootScope', function ($rootScope) {

    var controller = function (uaicasesignalr, $scope, ChatService, $timeout,AuthService) {

        if (!$scope.alto)
            $scope.alto = 200;


        $scope.chats = [];
        $scope.visible = false; //por default
        $scope.chatMessage = "";

        $scope.isTyping = function()
        {

            var dto = $scope.canal+"%"+AuthService.getTokenDecoded().name;

            uaicasesignalr.getProxy().invoke("isTyping", function(){},dto);


        }
        $scope.loadData = function () {



            if ($scope.canal != undefined && $scope.canal!="")

                    ChatService.all($scope.canal).then(function (resp) {


                        resp.data.forEach(function (e) {
                            if (e.ReadedBy == null)
                                e.ReadedBy = "";
                           e.isNew = false || !e.ReadedBy.includes(AuthService.getUserId()) ; // despues falta ver como hacer para marcar como leido el mensaje, por ahora traigo todos sin leer cad avez que conecto un canal
                            $scope.chats.push(e);

                        })



                    });

        }


        $scope.loadData();
        $rootScope.$on("chat:toggle", function (event, resp) {
            $scope.visible = resp;

            if (resp)
            {
                if ($scope.canal == "" || $scope.canal == undefined)
                    return;

                ChatService.readAll($scope.canal).then(function (r2) {
                    //marco todo como leído
                    $scope.chats.forEach(function (c) {
                        c.isNew = false; //false || (!c.ReadedBy.includes($rootScope.user.Id));
                    })
                })
            }

        });



        $rootScope.$on("typing:chatMessage", function (event, grupo, usuario) {

            if (grupo == $scope.canal && AuthService.getTokenDecoded().name != usuario) {
                $timeout(function () {
                    $scope.message = " ";

                }, 1500);

                $scope.message = usuario + " está escribiendo...";

            }

        });

        $rootScope.$on("new:chatMessage", function (event, message) {

            var addToArray = true;

            if ($scope.canal == message.IdDestino) {
                for (var i = 0; i < $scope.chats.length; i++) {
                    if ($scope.chats[i].Id === message.Id) {
                        addToArray = false;
                    }
                }
            }

            if ($scope.canal == message.IdDestino && addToArray) {
                {
                    message.isNew = true;
                    if ($scope.visible)
                     ChatService.readOne(message.Id).then(function (r) {
                        message.isNew = false;
                    })

                    $scope.chats.push(message);
                    $scope.scrollDown();
                }

            }

        });

        $scope.scrollDown = function () {
            //var $gc = $("#grupo-chat"); $gc.animate({ scrollTop: $gc.scrollHeight() });

            $('#grupo-chat').animate({ scrollTop: $('#grupo-chat')[0].scrollHeight });
        }

        $scope.sendChatMessage = function () {
            $scope.lockChatSend = true;
            ChatService.send($scope.chatMessage, $scope.canal).then(function (r) {
                $scope.chatMessage = "";
                $scope.lockChatSend = false;
            });
        }




    };


    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/chat/chat.html',
        replace: true,
        controller: controller,
        scope: {
            canal: "@",
            titulo: "@",
            alto: "@",

        }



    };

}]);
