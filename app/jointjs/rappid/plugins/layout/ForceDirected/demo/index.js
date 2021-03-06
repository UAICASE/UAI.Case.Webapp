/*! Rappid v1.7.1 - HTML5 Diagramming Framework

Copyright (c) 2015 client IO

 2016-03-03 


This Source Code Form is subject to the terms of the Rappid License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


var graph = new joint.dia.Graph;

// Create JointJS cell models out of miserables.js file.
// -----------------------------------------------------

var cells = [];
_.each(json.links, function(link) {

    cells.push({
        type: 'link',
        source: { id: json.nodes[link.source].name },
        target: { id: json.nodes[link.target].name },
        attrs: { line: { 'stroke-width': Math.sqrt(link.value) } }
    });
});

var colors = [ '#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6', '#34495E', '#F1C40F', '#E67E22', '#E74C3C', '#BDC3C7', '#95A5A6', '#C0392B' ];
function group2fill(group) { return colors[group % (colors.length + 1)]; }

_.each(json.nodes, function(node) {

    cells.push({
        id: node.name, type: 'basic.Circle',
        attrs: { text: { text: node.name }, ellipse: { fill: group2fill(node.group) } },
        width: 8, height: 8,
        weight: 1
    });
});

// Create paper and populate the graph.
// ------------------------------------

var $paper = $('#paper');
var paper = new joint.dia.Paper({
    el: $paper,
    width: 20000,
    height: 2000,
    gridSize: 1,
    model: graph,
    elementView: joint.dia.LightElementView,
    linkView: joint.dia.LightLinkView
});

graph.fromJSON({ paper: {}, cells: cells });

// Create and start a graph layout object with the graph as a model.
// -----------------------------------------------------------------

var graphLayout = new joint.layout.ForceDirected({
    graph: graph,
    width: 800, height: 600,
    gravityCenter: { x: 400, y: 300 },
    charge:  250,
    linkDistance: 50,
    linkStrength: 1
});

graphLayout.start();

var layoutFinished = false;
graphLayout.on('end', function() { layoutFinished = true; });

function animate() {
    if (!layoutFinished) {
        joint.util.nextFrame(animate);
        graphLayout.step();
    }
}

$('#animate').on('click', animate);

$('#step').on('click', function() {

    _.each(_.range(100), function() {
        graphLayout.step();
    });
});


console.log('JointJS number of cells:', (json.links.length + json.nodes.length), '(links:', json.links.length, 'elements:', json.nodes.length + ')');
