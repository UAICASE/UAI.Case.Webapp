


joint.shapes.uaicase = {};


joint.shapes.uaicase.Evaluation = joint.dia.Element.extend({


    markup: '<g class="rotatable"><g class="scalable"><image class="outer" xlink:href="/app/jointjs/rappid-uaicase-custom/images/case-error.png" x="0" y="0" height="150" width="150" /></g></g>',

    
    defaults: joint.util.deepSupplement({

        type: 'uaicase.Evaluation',
        attrs: {
            
            
        }

    }, joint.dia.Element.prototype.defaults)


});



joint.shapes.uml.Actor = joint.dia.Element.extend({


    markup: '<g class="rotatable"><g class="scalable"><image class="outer" xlink:href="/app/jointjs/rappid-uaicase-custom/images/use-case.png" x="0" y="0" height="30" width="30" /></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'uml.Actor',
        size: { width: 5, height: 5 },
        attrs: {

            text: {
                'font-family': 'Arial', 'font-size': 14,
                ref: '.', 'ref-x': .5, 'ref-y': .98,
                'x-alignment': 'middle', 'y-alignment': 'middle'
            }
        }

    }, joint.dia.Element.prototype.defaults)


});

joint.shapes.uml.Usecase = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><circle/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'uml.Usecase',
        size: { width: 90, height: 60 },
        specification : {'title':'','description':''},
        attrs: {
            'circle': { fill: '#FFFFFF', stroke: 'black', r: 30, transform: 'translate(30, 30)' },
            'text': { 'font-size': 14, text: '', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': .5, ref: 'circle', 'y-alignment': 'middle', fill: 'black', 'font-family': 'Arial, helvetica, sans-serif' },
            
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.uml.Use = joint.dia.Link.extend({
    defaults: { type: 'uml.Use' }
});

joint.shapes.uml.Include = joint.dia.Link.extend({
    defaults: {
        type: 'uml.Include',
        attrs: {
            '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#34495e', stroke: '#2c3e50' },
            '.connection': { stroke: '#2c3e50' }
        }
    }
});

joint.shapes.uml.Extend = joint.dia.Link.extend({
    defaults: {
        type: 'uml.Extend',
        attrs: {
            '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#34495e', stroke: '#2c3e50' },
            '.connection': { stroke: '#2c3e50' }
        }
    }
});

