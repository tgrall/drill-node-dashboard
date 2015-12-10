var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , request = require('request')
  , screen = blessed.screen()
  , bar = contrib.bar(
       { label: 'Bar Chart'
       , barWidth: 12
       , barSpacing: 5
       , maxHeight: 9
       , height: "100%"
       , width: "100%"})

screen.append(bar);

var query =  {
	"queryType" : "SQL",
	"query" : "select `YEAR`, SUM(`PASSENGER_COUNT`) from dfs.tmp.`airport_data_view` GROUP BY `YEAR`"
};

request(
	{
   		url: 'http://localhost:8047/query.json', //URL to hit
		method: 'POST',
		json: query
	}, 
	function(error, response, body){
     	var columns = body.columns;
		var data = {
			titles : [],
			data : []
		};
		for(var entry of body.rows){
			data.titles.push(entry[columns[0]]);
			data.data.push(entry[columns[1]]);
		}
		bar.setData(data);
		screen.render()
	});


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	  return process.exit(0);
});

