    var inspector;
function createInspector(cellView) {

    // No need to re-render inspector if the cellView didn't change.
    if (!inspector || inspector.options.cellView !== cellView) {

        if (inspector) {
            // Apply all unsaved changes on the cell before we remove the old inspector.
            inspector.updateCell();
            // Clean up the old inspector if there was one.
            inspector.remove();
        }

        inspector = new joint.ui.Inspector({
            inputs: {
                //myproperty: { type: 'text', defaultValue: 5, group: 'mydata', index: 1 },
                attrs: {

                    text: {
                        text: { type: 'text', group: 'uaicase', label: 'Nombre', index: 2 }
                        //     'font-size': { type: 'range', min: 5, max: 30, group: 'text', label: 'Font size', index: 2 }
                    }
                },
                uaicase: {
                    version: { type: 'number', group: 'uaicase', label: 'Versión', index: 1 },
                  //  name: { type: 'text', group: 'uaicase', label: 'Nombre', index: 1 },
                    description: { type: 'textarea', group: 'uaicase', label: 'Descripcion', index: 3 }
                },
                
                //position: {
                //    x: { type: 'number', index: 1, group: 'position' },
                //    y: { type: 'number', index: 2, group: 'position' }
                //}
            },
            groups: {
               // mydata: { label: 'My Data', index: 1 },
                uaicase: { label: 'Uai CASE', index: 1 }
                //position: { label: 'Position', index: 3 }
            },
            cellView: cellView
        });
        $('#inspector-holder-create').html(inspector.render().el);
    }
}