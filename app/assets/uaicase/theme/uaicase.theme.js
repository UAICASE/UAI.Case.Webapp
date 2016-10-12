var app = angular.module('uaicase.theme',[]);
app.factory('ThemeService', function ($alert) {


function showMessageEntitySaved(){
  $alert({
    title: 'Guardado',
    content: 'Se completo la solicitud correctamente!',
    placement: 'top-right',
    type: 'theme',
    container: '.alert-container-top-right',
    show: true,
    animation: 'mat-grow-top-right',
    duration: 2
  });
}

function showMessage(titulo, mensaje){
    $alert({
      title: titulo,
      content: mensaje,
      placement: 'top-right',
      type: 'theme',
      container: '.alert-container-top-right',
      show: true,
      animation: 'mat-grow-top-right',
      duration: 3
    });
  };

  return {
      showMessage: showMessage,
      showMessageEntitySaved:showMessageEntitySaved

  };
});
