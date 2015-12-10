var request = require('request');

var sqlQuery = process.argv.slice(2);

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
					x : [],
					y : []
				};
				for(var entry of body.rows){
					data.x.push(entry[columns[0]]);
					data.y.push(entry[columns[1]]);
				}

        console.log(body)

			}
		})
