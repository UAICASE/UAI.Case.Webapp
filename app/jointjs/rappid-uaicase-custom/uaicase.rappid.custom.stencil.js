    

          function newStencil(targetElement,graph,paper,tipo,rol) {

          

           var useCaseGroup = { index: 1, label: 'Casos de Uso' };
           var useCaseLinkGroup = { index: 1, label: 'Links' };
           var derGroup = { index: 1, label: 'DER' };
           var classesGroup = { index: 1, label: 'Clases' };
           var classesLinkGroup = { index: 1, label: 'Links' };
           var commonGroup = { index: 3, label: 'General' };
           var docenteGroup = { index: 0, label: 'Docente' };
           var derLinksGroup = { index: 1, label: 'Links' };

           


                      
            var Stencil = {};
           Stencil.groups = {};

           
           if (rol == 'Docente')
           {
               Stencil.groups.docente = docenteGroup;
           }

           if (tipo == "DiagramaCasoUso") {
               Stencil.groups.useCase = useCaseGroup;
               Stencil.groups.useCaseLinks = useCaseLinkGroup;
           }

           if (tipo == "DiagramaDerConceptual") {
               Stencil.groups.der = derGroup;
               Stencil.groups.derLinks = derLinksGroup;
           }
          
           if (tipo == "DiagramaClases") {
               Stencil.groups.classes = classesGroup;
               Stencil.groups.classesLink = classesLinkGroup;
           }
           
           Stencil.groups.common = commonGroup;
           

            var stencil = new joint.ui.Stencil({
                graph: graph,
                paper: paper,
                width: 200,
                height: 300,
                groups: Stencil.groups,
                dropAnimation: true
            });
           
            
            var html = stencil.render().el;

            
            if (targetElement.childElementCount == 1)
                targetElement.children[0].remove();
            
            targetElement.appendChild(html);

        




            Stencil.shapes = {
                docente: [
                   new joint.shapes.uaicase.Evaluation({
                       size: { width: 10, height: 10 }, attrs: { text: { text: 'Evaluation', fill: 'black' } }
                   })
                   ],

                common: [
                                        
                    new joint.shapes.basic.Text({ attrs: { text: { text: 'Texto' } } }),
                    new joint.shapes.basic.Rect({ attrs: { text: { text: 'Comentario' } } }),
             
                 
            
                    

                ],
                useCaseLinks:
                    [
                        new joint.shapes.uml.Use({ source: { x: 10, y: 20 }, target: { x: 180, y: 20 } }),
                        new joint.shapes.uml.Include({ source: { x: 10, y: 50 }, target: { x: 180, y: 50 } }),
                        new joint.shapes.uml.Extend({ source: { x: 10, y: 80 }, target: { x: 180, y: 80 } }),
                        new joint.shapes.uml.Generalization({ source: { x: 10, y: 110 }, target: { x: 180, y: 110 } }),
                    ],
                derLinks:
                   [

                   ],
                    
                classesLink: [
                    new joint.shapes.uml.Association({ source: { x: 10, y: 20 }, target: { x: 180, y: 20 } }),
                    new joint.shapes.uml.Generalization({ source: { x: 10, y: 50 }, target: { x: 180, y: 50 } }),
                    new joint.shapes.uml.Composition({ source: { x: 10, y: 80 }, target: { x: 180, y: 80 } }),
                    new joint.shapes.uml.Aggregation({ source: { x: 10, y: 110 }, target: { x: 180, y: 110 } }),                    
                    new joint.shapes.uml.Implementation({ source: { x: 10, y: 140 }, target: { x: 180, y: 140 } }),
                    new joint.shapes.uml.Transition({ source: { x: 10, y: 170 }, target: { x: 180, y: 170 } }),


                ],
                useCase: [
                     new joint.shapes.uml.Actor({ attrs: { text: { text: 'Actor' } } }),
                    new joint.shapes.uml.Usecase({ size: { width: 95, height: 60 },
            attrs: { circle: { stroke: 'black','stroke-width':  1.5}, text: { text: 'Usecase', fill: 'black' } }
            })],
                der: [
                    new joint.shapes.erd.Entity({ attrs: { text: { text: 'Entity' } } }),
                    new joint.shapes.erd.WeakEntity({ attrs: { text: { text: 'Weak entity', 'font-size': 10 } } }),
                    new joint.shapes.erd.IdentifyingRelationship({ attrs: { text: { text: 'Relation', 'font-size': 8 } } }),
                    new joint.shapes.erd.Relationship({ attrs: { text: { text: 'Relation' } } }),
                    new joint.shapes.erd.ISA({ attrs: { text: { text: 'ISA' } } }),
                    new joint.shapes.erd.Key({ attrs: { text: { text: 'Key' } } }),
                    new joint.shapes.erd.Normal({ attrs: { text: { text: 'Normal' } } }),
                    new joint.shapes.erd.Multivalued({ attrs: { text: { text: 'MultiValued', 'font-size': 10 } } }),
                    new joint.shapes.erd.Derived({ attrs: { text: { text: 'Derived' } } })
                ],
                classes: [
                    new joint.shapes.uml.State({ name: 'State', events: ['entry/', 'create()'], attrs: { '.uml-state-name': { 'font-size': 10 }, '.uml-state-events': { 'font-size': 10 } } }),
                    new joint.shapes.uml.Aggregation({name: 'agergar'}),    
                    new joint.shapes.uml.Class({ name: 'Class', attributes: ['+attr1'], methods: ['-setAttr1()'], attrs: { '.uml-class-name-text': { 'font-size': 9 }, '.uml-class-attrs-text': { 'font-size': 9 }, '.uml-class-methods-text': { 'font-size': 9 } } }),
                    new joint.shapes.uml.Interface({ name: 'Interface', attributes: ['+attr1'], methods: ['-setAttr1()'], attrs: { '.uml-class-name-text': { 'font-size': 9 }, '.uml-class-attrs-text': { 'font-size': 9 }, '.uml-class-methods-text': { 'font-size': 9 } } }),
                    new joint.shapes.uml.Abstract({ name: 'Abstract', attributes: ['+attr1'], methods: ['-setAttr1()'], attrs: { '.uml-class-name-text': { 'font-size': 9 }, '.uml-class-attrs-text': { 'font-size': 9 }, '.uml-class-methods-text': { 'font-size': 9 } } }),


                ]
            };

            
           

            var layoutOptions = {
                columnWidth: stencil.options.width / 2 - 10,
                columns: 2,
                rowHeight: 80,
                resizeToFit: true,
                dy: 5,
                dx: 5
            };



            _.each(Stencil.groups, function (group, name) {

              stencil.load(Stencil.shapes[name], name);
               joint.layout.GridLayout.layout(stencil.getGraph(name), layoutOptions);
               stencil.getPaper(name).fitToContent(1, 1, 10);

            }, this);

            

            stencil.on('filter', function (graph) {
                joint.layout.GridLayout.layout(graph, layoutOptions);
            });
            return stencil;
        }
