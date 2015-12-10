var blessed = require('blessed')
, contrib = require('blessed-contrib')
, request = require('request')
, screen = blessed.screen();


var parameters = process.argv.slice(2);
var sqlQuery = parameters[0];
var title = parameters[1];
var level = 1;
if (parameters[2] != undefined ) {
  level = parameters[2];
}



var line = contrib.line(
   { width: 80
   , height: 30
   , left: 15
   , top: 12
   , xPadding: 5
   , label: title
   , abbreviate: true
   , style: { baseline: 'white' }
   })

, data2 = [ { title: 'us-east',
             x: ['t1', 't2', 't3', 't4'],
             y: [5, 8800, 99999, 3179000000],
             style: {
              line: 'red'
             }
           }
        ]
screen.append(line) //must append before setting data


setInterval(function() {
	var query = 	{
		    "queryType" : "SQL",
		    "query" : sqlQuery
		 };
	request({
	   url: 'http://localhost:8047/query.json', //URL to hit
		method: 'POST',
		    json: query
	}, function(error, response, body){
		    if(error) {
		    } else {

        if (level == 1) {
          var columns = body.columns;
  				var data = {
  					x : [],
  					y : []
  				};
  				for(var entry of body.rows){
  					data.x.push(entry[columns[0]]);
  					data.y.push(entry[columns[1]]);
  				}
          line.setData(data);
        } else if (level == 2) {
          var columns = body.columns;
          var dataList = {};
        }


			}
		});
   screen.render()
}, 800)

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()
