
var halo;
var cell;
function createPaperScroller(paper) {
    var paperScroller = new joint.ui.PaperScroller({
        autoResizePaper: true,
        //padding: 0,
        paper: paper
    });

    return paperScroller;
}

function createPaper(graph) {


    var paper = new joint.dia.Paper({
        width: 1990,
        height: 990,
        gridSize: 1,
        model: graph,
        defaultLink: new joint.dia.Link({
            attrs: {
                '.marker-source': { d: 'M 10 0 L 0 5 L 10 10 z', transform: 'scale(0.001)' }, // scale(0) fails in Firefox
                '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                '.connection': { stroke: 'black' }
            }
        }),
        linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
        
    });

    return paper;
}
function newPaper(h, w, g, graph, paper, paperScroller, paperHolder, navigator) {

    var $app = $('#paper-holder');

    // Initiate panning when the user grabs the blank area of the paper.
    

    paperScroller.$el.css({
        width: 1000,
        height: 1000
    });
    var snaplines = new joint.ui.Snaplines({ paper: paperScroller.options.paper });
    snaplines.startListening();
    if ($app[0].childNodes.length == 1)
        $app[0].childNodes[0].remove();
    $app.append(paperScroller.render().el);

    // Example of centering the paper.
    paperScroller.center();

    




   
    paperScroller.options.paper.on('blank:pointerdown', paperScroller.startPanning);
    
    

    //selectionView.on('selection-box:pointerdown', function (evt) {
    //    if (evt.ctrlKey || evt.metaKey) {
    //        var cell = selection.get($(evt.target).data('model'));
    //        selection.reset(selection.without(cell));
    //        selectionView.destroySelectionBox(paper.findViewByModel(cell));
    //    }
    //});

    var nav = new joint.ui.Navigator({
        paperScroller: paperScroller,
        width: 300,
        height: 200,
        padding: 10,
        zoomOptions: { max: 2, min: 0.2 }
    });
    

    //if (navigator[0].childNodes.length == 1)
     //   navigator[0].childNodes[0].remove();
    //nav.$el.appendTo(navigator);

    this.paperScroller = paperScroller;

    nav.render();

    return paper;
}