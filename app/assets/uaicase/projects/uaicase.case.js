var app = angular.module('uaicase.case',[]);

app.factory('evaluacionService', ['$http', '$rootScope', function ($http, $rootScope) {


    var all = function (id) {
        return $http.get("/api/evaluacion/"+id);

    }

    var put = function (evaluacion) {
        return $http.put("/api/evaluacion/", evaluacion);

    }

    var allRespuestas = function (idEvaluacion) {
        return $http.get("/api/evaluacion/respuesta/" + idEvaluacion);

    }
    var putRespuesta = function (respuesta) {
        return $http.put("/api/evaluacion/respuesta", respuesta);

    }


    var activarEvaluacion = function(idEvaluacion)
    {
        return $http.post("/api/evaluacion/activar/" + idEvaluacion);
    }


    var finalizarEvaluacion = function (idEvaluacion) {
        return $http.post("/api/evaluacion/finalizar/" + idEvaluacion);
    }

    var obtenerEvaluaciones = function(idDiagrama)
    {
        return $http.get("/api/evaluacion/diagrama/" + idDiagrama);
    }

    return {

        all: all,
        put: put,
        allRespuestas: allRespuestas,
        putRespuesta: putRespuesta,
        activarEvaluacion: activarEvaluacion,
        finalizarEvaluacion: finalizarEvaluacion,
        obtenerEvaluaciones: obtenerEvaluaciones


    };

}]);
app.factory('diagramaService', ['$http', '$rootScope','ENV', function ($http, $rootScope,ENV) {

    var putModel = function (diagrama) {
        return $http.put(ENV.apiEndpoint+"/diagrama/"+$rootScope.selectedDiagram.Id, diagrama);

    }
    var put = function (diagrama) {
        return $http.put(ENV.apiEndpoint+"/diagrama/" , diagrama);

    }


    var oneDiagram = function(id)
    {

        return $http.get(ENV.apiEndpoint+"/diagrama/" + id);
    }

     var one = function (id) {
        return $http.get(ENV.apiEndpoint+"/diagrama/" + id);

    }



     return {

         putModel: putModel,
        one: one,
        put: put,
        oneDiagram: oneDiagram


    };

}]);
app.directive('jointDiagram', ['$window', 'uaiCaseService', '$rootScope', function ($window, uaiCaseService, $rootScope) {

    var directive = {
        link: link,
        restrict: 'A',

    };

    return directive;

    function link(scope, element, attrs) {

        scope.$watch("diagrama",function(newValue, oldValue)
        {
            if (newValue) {
                if (newValue != oldValue)
                {
                    var dto = {};
                    dto.Usuario = $rootScope.user;
                    dto.RoomId = scope.diagrama.Id;

                    $rootScope.messageHubProxy.invoke("ReleaseElement", function () { }, dto);
                }

                var stencil = document.getElementsByTagName("joint-stencil");
                var paper = document.getElementsByTagName("joint-paper");
                var navigator = document.getElementsByTagName("joint-navigator");
                var inspector = document.getElementsByTagName("joint-inspector");

                var tipo = attrs.jointDiagram;

                uaiCaseService.newDiagram(paper, stencil, navigator, tipo, scope.diagrama.Id);
            }
            })



    }
}]);

app.factory('uaiCaseService', ['$', '$rootScope', '$modal', '$location', '$timeout',function ($, $rootScope, $modal, $location,$timeout) {


    var room;
        this.graph;
        this.paper;
        this.stencil;
        this.stencilLinks;
        this.commandManager;
        this.paperScroller;
        this.halo;

        this.selection;
        this.selectionView;
        var holdElements = [];
        var paper;
        var channels = [];
        var channel = {};

        var highlighters = [];

       return {
           getCommandManager:function()
           {
               return this.commandManager;
           },
           getPaperScroller:function()
           {
               return this.paperScroller;
           },
           print:function()
           {
               if (this.paper)
               this.paper.print()
           },
           exportAsPNG:function(diagram)
           {
               //var windowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
               //var windowName = _.uniqueId('jpg_output');
               //var imageWindow = window.open('', windowName, windowFeatures);
               var windowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
               var windowName = _.uniqueId('png_output');
               var imageWindow = window.open('UAI CASE', windowName, windowFeatures);

               this.paper.toPNG(function (dataURL) {
                   imageWindow.document.write('<link href="assets/css/uai-case-prints.css" rel="stylesheet" />')
                   imageWindow.document.write('<div id="print-diagram">');
                   imageWindow.document.write('<p>UAI CASE</p>');

                   imageWindow.document.write('<img  src="' + dataURL + '"/>');
                   imageWindow.document.write('<p>'+diagram.Nombre+'</p>');
                   imageWindow.document.write('<p>'+diagram.Usuario.Nombre + ' ' + diagram.Usuario.Apellido+'</p>');

                   imageWindow.document.write('</div>');
               }, { padding: 10, quality:1, width:640, height:480 });

               //paper.toJPEG(function (imageData) { offerForDownload(imageData); }, {
               //    width: 640,
               //    height: 320,
               //    quality: 0.7
               //});
           },

           exportAsJPEG: function () {
               var windowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
               var windowName = _.uniqueId('jpg_output');
               var imageWindow = window.open('', windowName, windowFeatures);
               this.paper.toJPEG(function (dataURL) {
                   imageWindow.document.write('<img src="' + dataURL + '"/>');
               }, { padding: 10, quality: 1, width: 640, height: 480 });
           },
           closeDiagram:function()
           {
               //saco todos mis holds de este diagrama

               var dto = {};
               dto.Usuario = $rootScope.user;
               dto.RoomId = room; //$rootScope.selectedDiagram.Id;
               $rootScope.messageHubProxy.invoke("ReleaseElement", function () { }, dto);

           },
           newDiagram: function (paper, stencil, navigator, tipo, channelId)
            {


               room = channelId;
               // $rootScope.messageHubProxy.invoke('JoinRoom', function () { },channelId);


                var h = paper[0].attributes.height.nodeValue;
                var w= paper[0].attributes.width.nodeValue;
                var gr= paper[0].attributes.grid.nodeValue;

                this.graph = new joint.dia.Graph;


                //busco si está el canal asociado ya creado

                var a = $location.host();
                var graph = this.graph;

                channel = new joint.com.Channel({ url: 'ws://' + a + ':4141', graph: graph, query: { room: room, idDiagrama: room } });


                $rootScope.messageHubProxy.on("userDisconnected", function (id) {
                    releaseAll(id);
                })

                  $rootScope.messageHubProxy.invoke("GetAllHoldsInRoom", function (result) {
                            $timeout(function () {

                            //borro todos los highlights viejos
                            highlighters.forEach(function (i) {
                                i.remove();
                            });
                            highlighters = [];

                            //agrego los hightlights nuevos
                            result.forEach(function (dto) {
                                addHightlight(dto);
                            })
                            }, 1000);
                        }, room);




                    //alguien libero un elemento, tengo que quitarlo de mi lista
                   $rootScope.messageHubProxy.on("ReleaseElement", function (dto) {


                       //highlighters.forEach(function (highlight) {
                       // if (highlight.attr('holder-id') && highlight.attr('cell-id')) {
                       //     var holderId = highlight.attr('holder-id');
                       //    if (holderId == dto.Usuario.Id) {
                       //        //indico a la cell que no la tiene nadie
                       //        var cellId = highlight.attr('cell-id');
                       //        var cell = graph.getCell(cellId);
                       //        if (cell)
                       //        cell.set('holder', undefined);

                       //        //elimino el highlight
                       //        highlight.remove();
                       //        highlight = undefined;
                       //    }

                       //}
                       //})

                       releaseAll(dto.Usuario.Id);
                   });


                   var releaseAll = function (idUsuario)
               {
                   highlighters.forEach(function (highlight) {
                       if (highlight.attr('holder-id') && highlight.attr('cell-id')) {
                           var holderId = highlight.attr('holder-id');
                           if (holderId == idUsuario) {
                               //indico a la cell que no la tiene nadie
                               var cellId = highlight.attr('cell-id');
                               var cell = graph.getCell(cellId);
                               if (cell)
                                   cell.set('holder', undefined);

                               //elimino el highlight
                               highlight.remove();
                               highlight = undefined;
                           }

                       }
                   })
               }

                    //alguien agrego un elemento, tengo que agregarlo a mi lista
                   $rootScope.messageHubProxy.on("HoldElement", function (dto) {
                       //me fijo todos los hightlight de ese usuario y los vacio
                       highlighters.forEach(function (i) {


                           if (i.attr('holder-id')&& i.attr('cell-id') )
                           {



                               var holderId = i.attr('holder-id');
                               if (holderId == dto.Usuario.Id)
                               {
                                   //indico a la cell que no la tiene nadie
                                   var cellId = i.attr('cell-id');
                                   var cell = graph.getCell(cellId);
                                   if (cell)
                                       cell.set('holder', undefined);

                                   //elimino el highlight
                                    i.remove();
                                  i = undefined;
                               }

                           }
                       })

                       //creo el hightlight nuevo para ese holder

                       addHightlight(dto)

                   });
               //al eliminar una celda le saco el highight
                   this.graph.on('remove', function (cell) {
                       var highlight = getHighlight(cell.id);
                       if (highlight)
                           highlight.remove();
                   })


               //agrego un hightlight desde un elemento recibido por evento (alguien que lo agrego)
                var addHightlight=function(element)
                    {
                        var cell = graph.getCell(element.ElementId);

                        if (cell != undefined) {
                            cell.set("holder", element.Usuario);

                            var view = cell.findView(paper);
                            if (view.model instanceof joint.dia.Link) return;
                            createHighlight(view);
                            //view.highlight();
                        };
                    }
                var createHighlight = function (cellView) {

                    //var bbox = cellView.getBBox();
                    var padding = 5;
                    var bbox = g.rect(cellView.getBBox({ useModelGeometry: true })).moveAndExpand({
                        x: -padding,
                        y: -padding,
                        width: 2 * padding,
                        height: 2 * padding
                    });

                    var user = cellView.model.get("holder");


                    if (!user)
                        return;
                    var holder = user.Nombre + " " + user.Apellido;

                    var x = bbox.x;
                    var y = bbox.y;

                    var highlighter = getHighlight(cellView.model.id);   // highlighters[cellView.model.id];



                    if (!highlighter) {
                        highlighter = V('text', {
                            'fill': 'blue',
                            'pointer-events': 'none'
                        });
                        highlighters.push(highlighter);
                    }

                    highlighter.attr('cell-id', cellView.model.id);
                    highlighter.attr('holder-id', user.Id);
                    highlighter.attr('text-anchor', 'start');
                    highlighter.text(holder);
                    highlighter.translate(x, y + bbox.height + 5, { absolute: true });


                    V(paper.viewport).append(highlighter);
                }
               //obtiene el highlight de un elemento
                var getHighlight = function (elementId)
               {
                   var resp = undefined;
                   highlighters.forEach(function (i) {
                       if (i.attr('cell-id')==elementId)
                       {
                            resp=i;
                       }

                   })

                   return resp;
               }

                //al agregar una celda al papel le defino el creador y creo el atributo uaicase para customizar
                //
                this.graph.on('add', function (cell) {
                    if (cell.get('owner') == undefined)
                        cell.set("owner", $rootScope.user);

                    if (cell.get('uaicase') == undefined) {
                        var uaicase = { version: '1', name: '', description: '' };
                        cell.set('uaicase', uaicase)
                    }
                })




                this.commandManager = new joint.dia.CommandManager({ graph: this.graph });
                this.paper = createPaper(this.graph);
                this.paperScroller = createPaperScroller(this.paper);
                this.paper = newPaper(h, w, gr, this.graph,this.paper,this.paperScroller, paper,navigator);
                paper = this.paper;


                //para mover el highlighter de holder (quien tiene seleccionado el elemento)
                paper.model.on('change:position', function (cell) {
                    var padding = 5;

                    //muevo el hightlight
                    var cellView = paper.findViewByModel(cell);
                    var highlighter = getHighlight(cellView.model.id);   // highlighters[cellView.model.id];
                    if (highlighter) {
                        var bbox = g.rect(cellView.getBBox({ useModelGeometry: true })).moveAndExpand({
                            x: -padding,
                            y: -padding,
                            width: 2 * padding,
                            height: 2 * padding
                        });


                        highlighter.translate(bbox.x, bbox.y + bbox.height + 5, { absolute: true });
                    }
                });



                this.stencil = newStencil(stencil[0], this.graph, this.paper,tipo,$rootScope.user.Rol);
                this.selection = new Backbone.Collection;
                this.selectionView = new joint.ui.SelectionView({ paper: this.paper, graph: this.graph, model: this.selection });

                //var scope = $rootScope.$new(true);
               //scope.diagramaId = room;


                var modalEvaluacion = $modal({
                    contentTemplate: 'assets/views/uaicase/tpl/evaluacion-case.html',
                    title: "Módulo de evaluación",
                    show: false,
                    controller: 'evaluationCaseController',
                    })


                this.paper.on('cell:pointerdblclick', function (cellView) {
                    //se va a poder acceder con doble click, solo cuando el elemento sea uno de error case
                    if (cellView.model instanceof joint.shapes.uaicase.Evaluation) {
                        modalEvaluacion.$promise.then(function () { modalEvaluacion.show(); });

                    }


                });



                var graph = this.graph;




                this.paper.on('cell:pointerup', function (cellView) {

                    //le digo a angular que modelo está seleccionado
                    $rootScope.selectedModel = cellView.model;

                    // We don't want a Halo for links.
                    if (cellView.model instanceof joint.dia.Link) return;
                    if (cellView.model instanceof joint.shapes.uaicase.Evaluation && $rootScope.user.Rol == 'Alumno') return;



                    cell = cellView;

                    var creado = "Creado por " + cell.model.get('owner').Nombre + " " + cell.model.get('owner').Apellido;

                    if (cell.model.get('owner').Id == $rootScope.user.Id)
                        creado = "Creado por mí";

                    this.halo = new joint.ui.Halo({
                       cellView: cellView,
                        boxContent: creado

                    });

                    //agrego a todos los elementos la accion de evaluar
                    this.halo.addHandle({ name: 'evaluacion-uaicase', position: 'w', icon: '/app/jointjs/rappid-uaicase-custom/images/case-error.png' });


                    if (cellView.model instanceof joint.shapes.uml.Usecase) {
                       this.halo.addHandle({ name: 'especificacion-cu', position: 's', icon: '/app/jointjs/rappid-uaicase-custom/images/especificacion-cu.png' });

                    }

                    if (cellView.model instanceof joint.shapes.uaicase.Evaluation) {

                        this.halo.removeHandle('link');
                        this.halo.removeHandle('fork');
                        this.halo.removeHandle('unlink');
                        this.halo.removeHandle('rotate');
                        this.halo.removeHandle('evaluacion-uaicase');
                        //se va a poder acceder con doble click
                    }



                                this.halo.render();


                    this.halo.on('action:link:add', function (link) {
                        if (!link.get('source').id || !link.get('target').id) {
                            link.remove();
                        }

                        var id = link.get('target').id
                        var cell = graph.getCell(id)
                        if (cell instanceof joint.shapes.uaicase.Evaluation )
                            link.remove();
                    });



                    if (this.halo != undefined)
                        this.halo.on('action:evaluacion-uaicase:pointerup', function (evt) {




                            modalEvaluacion.$promise.then(function () { modalEvaluacion.show(); });





                    });


                    this.halo.on('action:especificacion-cu:pointerup', function (evt) {

                        var spec = $modal({
                            contentTemplate: '/assets/views/uaicase/tpl/usecase-spec.html',
                            title: "Especificación de CU",
                            show: false,
                            controller: 'useCaseController',

                        })


                        spec.$promise.then(function () { spec.show(); });





                    });


                    // We don't want to transform links.
                    if (cellView.model instanceof joint.dia.Link) return;

                    var freeTransform = new joint.ui.FreeTransform({ cellView: cellView });
                    freeTransform.render();



                });

                this.paper.on('blank:pointerdown', function () {

                    paperScroller.startPanning;

                    var dto = {};
                    dto.Usuario = $rootScope.user;
                    dto.RoomId = room;
                    $rootScope.messageHubProxy.invoke("ReleaseElement", function () { }, dto);
                  });




                this.paper.on('cell:pointerdown', function (cellView) {


                    //veo que no este seleccionada por nadie y sino la vacio
                    var idx = 0;
                    holdElements.forEach(function (i) {

                        if (i.cellid == cellView.model.id) {
                            holdElements.splice(idx, 1);
                            var cell = graph.getCell(i.cellid);

                            if (cell != undefined) {
                                cell.set("holded", undefined);
                                var view = cell.findView(paper);

                                view.unhighlight(cell);

                            }


                        }

                        idx += 1;

                    })


                    // me fijo si la celda la tiene seleccionada alguien, asi que en mi diagrama la saco e informo que es mia


                    var highlighter = highlighters[cellView.id];
                    if (highlighter) {
                        highlighters[cellView.id] = undefined;
                        highlighter.remove();
                    }



                    var dto = {};
                    dto.Usuario = $rootScope.user;
                    dto.ElementId = cellView.model.id
                    dto.RoomId = room;//$rootScope.selectedDiagram.Id;
                    $rootScope.messageHubProxy.invoke("HoldElement", function () { }, dto);

                  //channel.notify('element:hold', { cellid: cellView.model.id, user: $rootScope.user });


                   createInspector(cellView);

                });

                this.paper.on('cell:pointerup', function (cellView, evt) {
                    if ((evt.ctrlKey || evt.metaKey) && !(cellView.model instanceof joint.dia.Link)) {
                        this.selection.add(cellView.model);
                        this.selectionView.createSelectionBox(cellView);
                    }
                });

                this.selectionView.on('selection-box:pointerdown', function (evt) {
                    if (evt.ctrlKey || evt.metaKey) {
                        var cell = selection.get($(evt.target).data('model'));
                        this.selection.reset(this.selection.without(cell));
                        this.selectionView.destroySelectionBox(this.paper.findViewByModel(cell));
                  }
                });


            },

            getChannel: function()
            {

                return channel;
            },


            saveGraph: function(id)
            {
                var dto ={};
                dto.model=this.graph.toJSON();
                dto.id = id;

                channel.notify("save", dto);

            },

            setGraph:function(graph)
            {
                this.graph=graph;
            },
            getGraph: function () {
                return this.graph;

            },
            setPaper: function(paper)
            {
                this.paper = paper;
            },
            getPaper: function()
            {
                return this.paper;
            }

        }




  }]);
  app.factory('elementoService', ['$http', '$rootScope','ENV' ,function ($http, $rootScope,ENV) {



      var allByProyecto = function (proyectoId) {
          return $http.get(ENV.apiEndpoint+"/elemento/proyecto/" + proyectoId)
      }

      var one = function (id) {
          return $http.get(ENV.apiEndpoint+"/elemento/"+ id)
      }

      var put =function(elemento)
      {
          return $http.put(ENV.apiEndpoint+"/elemento/", elemento)
      }
      return {

          allByProyecto: allByProyecto,
          one: one,
          put:put

      };

  }]);
