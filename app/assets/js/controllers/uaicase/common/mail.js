app.controller('MailerController',   function ($scope, $window, $aside, MailerService, $rootScope) {


  $rootScope.pageTitle = "Centro de Mensajeria";


  $scope.inbox = function() {
    return MailerService.getInbox()
  };


  $scope.outbox = function(){
    return MailerService.getOutbox();
  }
  $scope.isReply = false;
  $scope.replyMail = function (original) {
    $scope.readMail(original);

    $scope.mailItem = {};
    $scope.mailItem.Id = original.Id;
    $scope.mailItem.Body = "<br/><blockquote>Fecha: "+original.FechaCreacion+"<br/>Respuesta a...<br/>" + original.Body + "</blockquote>";
    $scope.isReply = true;
    $scope.mailItem.Subject = "Re " + original.Subject;
    $scope.mailItem.Curso = original.Curso;

    $scope.mailItem.To = original.Usuario;

    if (!Array.isArray($scope.MailTo)) {
      $scope.mailItem.To = [$scope.mailItem.To];
    }


  }
  $scope.replyMailClass = function () {

    var tot = 12;
    if ($scope.isReply)
    tot = tot - 12;

    return "col-md-" + tot;
  }
  $scope.hideReplyForm=function() {
    $scope.isReply = false;
    $scope.mailItem = {};
  }

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

          });
      })

  }

});
app.controller('MailController', function ($scope, $window, $aside, MailerService, $rootScope) {

  var formMailTpl = $aside({
      scope: $scope,
      template: '/assets/views/tpl/uaicase/mailer-form.html',
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


        $scope.newMail = function (mailTo, curso, destino) {

            if (!Array.isArray(mailTo)) {
                mailTo = [mailTo];
            }

            var item = {
                editing: true,
                Estado: "Nuevo",
                Body: "",
                To: mailTo,
                Curso: curso,
                Destino: destino

            };
            $scope.mailItem = item;

            formMailTpl.show();
        }
});
app.controller('ListMailController',  function($scope, $window, $aside, MailerService, $rootScope) {



    $scope.inboxNew = function(){
      return MailerService.getInboxNew();
    }
      $scope.inbox = function() {
        return MailerService.getInbox()
      };


      $scope.outbox = function(){
        return MailerService.getOutbox();
      }


});
