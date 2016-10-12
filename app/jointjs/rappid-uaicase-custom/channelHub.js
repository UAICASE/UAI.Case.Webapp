/*! Rappid v1.7.1 - HTML5 Diagramming Framework

Copyright (c) 2015 client IO

 2016-03-03 


This Source Code Form is subject to the terms of the Rappid License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


// This is an example setup of the server-side of the Channel synchronization plugin.
// It demostrates how to configure the ChannelHub in order to implement room-separated graph
// synchronization.

// USAGE:
// Run: node channelHub
// Run With REPL: node channelHub --repl
// Type help in the REPL to bring up a help instructions.
var jquery = require('../rappid/node_modules/jquery/dist/jquery');


// https://github.com/simonlast/node-persist
var storage = require('../rappid/node_modules/node-persist');

storage.init();
//\wwwroot\app\jointjs\rappid\node_modules\node-persist\src\storage


var joint = require('../rappid/index');
var Channel = joint.com.Channel;
var ChannelHub = joint.com.ChannelHub;
var PORT = 4141;
var channels = {};
var channelHub = new ChannelHub({ port: PORT });


storage.init({ dir: '/uaicase/' });


channelHub.route(function (req, jsonGraph) {


    
    var query = JSON.parse(req.query.query);
    
        if (channels[query.room]) {
            console.log("Joining Channel", query.room);
            return channels[query.room];
        }

        var g = new joint.dia.Graph;



        
        console.log("Loading data from database for diagram", query.room)
        storage.getItem(query.room, function (err, value) {
            
            if (value) {
                console.log("Data loaded for diagram", query.room);
                g.fromJSON(value);
                



            }
            g.ModelId = query.room;
        });


        
      console.log("Creating channel...")
      var c = channels[query.room] = new Channel({
            diagramaId: query.room,
            graph: g,
            ttl: 60, // Together with the healthCheckInterval, this considers a site dead if its socket was disconnected more than 1 hour.
            healthCheckInterval: 1 * 60 * 60, // 1m
            debugLevel: 0,
            reconnectInterval: 10000, // 10s,,
           
       });



      c.on("save", function () {
          var id = g.ModelId;
          var model = g.toJSON();
          try {
              storage.setItemSync(id, model);
              console.log("save", id);
            
          } catch (e) {
              console.log("error saving model", id);


          }
      })

 
         //
         
         
         
   
      return c;

});

    var save=function(dto)
{
    //\wwwroot\app\jointjs\rappid\node_modules\node-persist\src\storage
    try {
        storage.setItemSync(dto.id, dto.model)
        console.log("save model", dto.id);
    } catch (e) {
        console.log("error saving model", dto.id);
    

    }
}
         
    console.log('ChannelHub running on port ' + PORT);





if (process.argv.indexOf('--repl') !== -1) {
    startRepl();
}

function startRepl() {

    var repl = require('repl');
    var cli = repl.start({ prompt: 'Channel > ' });
    cli.context.joint = joint;
    cli.context.channels = channels;
    cli.context.help = [
        'Type channels [enter] to see the server side channels for each room.',
        'channels.A.options.graph.addCell(new joint.shapes.basic.Rect({ position: { x: 50, y: 50 }, size: { width: 100, height: 70 } }))',
        'channels.B.options.graph.get("cells").at(0).translate(300, 100, { transition: { duration: 2000 } })'
    ];

    cli.on('exit', function () {
        console.log('Bye.');
        channelHub.close();
        process.exit();
    });
}
