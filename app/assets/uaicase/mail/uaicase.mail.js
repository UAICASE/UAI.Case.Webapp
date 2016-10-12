//app.factory('MailerService', [function ($rootScope, mailService) {
var app = angular.module('uaicase.mail',[]);
app.factory('MailerService', function ($http, $rootScope, MailService,ThemeService,AuthService,$filter) {
  $rootScope.$on("read:mail", function(evnt,mail){

    if (mail.Usuario.Id==AuthService.getUserId())
      {
        ThemeService.showMessage('Confirmación de lectura','  Mensaje leido por ' +mail.MailToUsuario.Nombre+' '+mail.MailToUsuario.Apellido);
          outbox.forEach(function(m){
            if (m.Id==mail.Id){
              m.ReadDate=mail.ReadDate;
            }
          })
      }


  });

  $rootScope.$on("new:mail", function(evnt,mail){

    ThemeService.showMessage('Nuevo Mensaje','  Mensaje recidibo de ' +mail.Usuario.Nombre+' '+mail.Usuario.Apellido);
    if (inbox.filter(function (idx) { return idx.Id == mail.Id; }).length == 0)
        inbox.push(mail);

  });

    var inbox = [];
    var outbox = [];
    var lastReceivedMail = {};
    var lastReadMail = {};
    var initialize = function(){
      loadOutbox();
      loadInbox();
    }
    var loadOutbox = function()     {
        MailService.getOutbox().then(function (response) {
            outbox = response.data;
            return outbox;
        });
    }
    var addOneMail = function (mail) {
        if (inbox.filter(function (idx) { return idx.Id == mail.Id; }).length == 0)
            inbox.push(mail);


    }
    var loadInbox = function () {
        inbox = [];
        MailService.all().then(function (response) {
            inbox = response.data;

        });
    }

    var send=function(mail)     {
        return MailService.send(mail);
    }

     var getInboxNew = function(){

        return $filter('filter')(inbox, {ReadDate: null});
     }
    var getInbox = function()     {
        return inbox;
    }
    var getOutbox = function () {
        return outbox;
    }

    // var getNewMail = function () {
    //     MailService.newMail().then(function (response) {
    //
    //
    //         response.data.forEach(function (e) {
    //             if (inbox.filter(function (idx) { return idx.Id == e.Id; }).length == 0)
    //                 inbox.push(e);
    //         });
    //
    //     });
    // }
    //


    var setReadedMail = function(mail)    {
        if (mail.Usuario.Id != $rootScope.userId) {
            if (mail.ReadDate == null) {
                MailService.read(mail).then(function (response) {
                    mail.ReadDate = response.data.ReadDate;

                });
            }
        }
    }

    var readMail = function (m) {
        lastReadMail = m;
        //if (m.MailTo != $rootScope.userId)
          //  $rootScope.mailReaded();
        outbox.forEach(function (e) {
            if (e.Id == m.Id)
                e.ReadDate = m.ReadDate;
        })

        inbox.forEach(function (i) {
            if (i.Id == m.Id) {
                i.ReadDate = m.ReadDate;
            }
        })
    }




    return {
        loadInbox: loadInbox,
        getInboxNew:getInboxNew,
        readMail: readMail,
        setReadedMail: setReadedMail,
        getOutbox: getOutbox,
        getInbox: getInbox,
        loadOutbox: loadOutbox,
        send: send,
        initialize:initialize

    }

});
app.factory('MailService', ['$http', '$rootScope','ENV', function ($http, $rootScope,ENV) {

    var send = function (mail) {
        return $http.put(ENV.apiEndpoint+"/mail/",mail);

    }
    var read= function (mail) {
        return $http.post(ENV.apiEndpoint+"/mail",mail);

    }

    var newMail = function () {
        return $http.get(ENV.apiEndpoint+"/mail/new");
    }

    var one = function (id) {
        return $http.get(ENV.apiEndpoint+"/mail/"+id);
    }
    var all = function () {
        return $http.get(ENV.apiEndpoint+"/mail/inbox");

    }
    var getOutbox = function()
    {
        return $http.get(ENV.apiEndpoint+"/mail/outbox")
    }

    var allTake = function (page,take) {
        return $http.get(ENV.apiEndpoint+"/mail/"+page+"/"+take);

    }
    return {
        all: all,
        read: read,
        one:one,
        send: send,
        newMail: newMail,
        allTake: allTake,
        getOutbox: getOutbox

    };

}]);
app.directive('sendMailWidget',function(){

var controller=function($scope,AuthService,$aside,MailerService){


$scope.userId= function(){

  return AuthService.getUserId();
}

  var formMailTpl = $aside({
      scope: $scope,
      template: '/assets/uaicase/mail/mailer-form.html',
      show: false,
      placement: 'right',
      backdrop: true,
      animation: 'am-slide-right'
  });
             //


             $scope.sendMail = function () {
                 $scope.mailItem.To.forEach(function (entry) {
                     var mail = {};
                     mail.Subject = $scope.mailItem.Subject;
                     mail.Curso = $scope.mailItem.Curso;
                     mail.Body = $scope.mailItem.Body;
                     mail.MailTo = entry.Id;
                     mail.MailToUsuario = entry;

                     MailerService.send(mail).then(function (response) {

                         //formMailTpl.hide();
                         if ($scope.isReply)
                             $scope.hideReplyForm();
                         MailerService.getOutbox().push(response.data);
                         formMailTpl.hide();
                     });
                 })

             }


        $scope.newMail = function () {

          var mailTo=[];

          mailTo.push($scope.para);


            if (!Array.isArray(mailTo)) {
                mailTo = [mailTo];
            }

            var item = {
                editing: true,
                Estado: "Nuevo",
                Body: "",
                To: mailTo,
                Curso: $scope.curso,
                Destino: $scope.para.Rol

            };
            $scope.mailItem = item;

            formMailTpl.show();
        }
}


  return {
      restrict: 'E',
      templateUrl: 'assets/uaicase/mail/send-mail-widget.html',
      replace: true,
      controller: controller,
      scope: {
          curso:"=",
          para:"="
      }
}});
