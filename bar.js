var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , request = require('request')
  , screen = blessed.screen()
  , bar = contrib.bar(
       { label: 'Bar Chart'
       , barWidth: 20
       , barSpacing: 20
       , maxHeight: 9
       , height: "100%"
       , width: "100%"})

var sqlQuery = process.argv.slice(2);
screen.append(bar);

setInterval(function() {
	var query = 	{
		    "queryType" : "SQL",
		    "query" : sqlQuery[0]
		 };
	request({
	   url: 'http://localhost:8047/query.json', //URL to hit
		method: 'POST',
		    json: query
	}, function(error, response, body){
		    if(error) {
		    } else {
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
			}
		});
   screen.render()
}, 800)

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	  return process.exit(0);
});

screen.render()
