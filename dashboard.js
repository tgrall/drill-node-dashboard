
var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , request = require('request');

var server = process.argv.slice(2);


var screen = blessed.screen()

var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

function loadDataForLine(sqlQuery, lineObject, color) {
  var lineColor = 'red';
  if (color != undefined) {
    lineColor = color;
  }
  var query = {
        "queryType" : "SQL",
        "query" : sqlQuery
     };
  request({
      url: server + '/query.json',
      method: 'POST',
      json: query
    },
    function(error, response, body){

      if(error) {
      } else {
      var columns = body.columns;
      var data = {
        style: {line: lineColor},
        x : [],
        y : []
      };
      for(var entry of body.rows){
        data.x.push(entry[columns[0]]);
        data.y.push(entry[columns[1]]);
      }
      lineObject.setData(data);
    }
    screen.render();
  });
};


function loadDataForLineWihAggregate(sqlQuery, lineObject) {
  var colors = ['red', 'green', 'blue', 'yellow','cyan', 'white','red', 'green', 'blue', 'yellow','red', 'green', 'blue', 'yellow','red', 'green', 'blue', 'yellow','red', 'green', 'blue', 'yellow'];

  var query = {
        "queryType" : "SQL",
        "query" : sqlQuery
     };
  request({
      url: server +'/query.json',
      method: 'POST',
      json: query
    },
    function(error, response, body){

      if(error) {
      } else {
      var columns = body.columns;
     var currentGroup = undefined;
     var currentIdx = -1;
     var data = [];
     var currentArray = undefined;
     for(var entry of body.rows){
         var mainGroupAkaLine = entry[columns[0]];
         if (currentGroup != mainGroupAkaLine ) {
           //console.log("CURRENT GROUP : "+ mainGroupAkaLine  );
           currentGroup =  mainGroupAkaLine;
           currentIdx ++;
           currentArray = { title : currentGroup, style : { line : colors[currentIdx] },    x :[] , y : []};
           data[currentIdx] = currentArray;
         }
         // add entry to the current list of value
         data[currentIdx].x.push(entry[columns[1]]);
         data[currentIdx].y.push(entry[columns[2]]);
     }

     //console.log(data);
     lineObject.setData( data );
    }
    screen.render();
  });
};



var passengerPerYearLine = grid.set(0, 0, 6, 6, contrib.line, { width: 80
, height: 30
, left: 15
, top: 12
, xPadding: 5
, label: "Passengers by year"
, abbreviate: true
, style: { baseline: 'white' }
}
);

var passengerPerMontLine = grid.set(0, 6, 12, 6, contrib.line, {
  xPadding: 12
, top: 12
, label: "Passengers for 2013,2014,2015"
, abbreviate: true
, style: { baseline: 'white'}
}
);

var internationalPassengers = grid.set(6, 0, 3, 6, contrib.line, { width: 80
, height: 30
, left: 15
, top: 12
, xPadding: 5
, label: "International Passengers"
, abbreviate: true
, style: { baseline: 'white' }
}
);

var domesticPassengers = grid.set(9, 0, 3, 6, contrib.line, { width: 80
, height: 30
, left: 15
, top: 12
, xPadding: 5
, label: "Domestic Passengers"
, abbreviate: true
, style: { baseline: 'white' }
}
);



loadDataForLine("select \`year\`, sum(PASSENGER_COUNT) as \`total\` from dfs.tmp.\`airport_data_view\` group by \`year\`", passengerPerYearLine, 'red');
loadDataForLine("select \`year\`, sum(PASSENGER_COUNT) as \`total\` from dfs.tmp.\`airport_data_view\` WHERE geo_summary = 'International' group by \`year\`", internationalPassengers, 'green');
loadDataForLine("select \`year\`, sum(PASSENGER_COUNT) as \`total\` from dfs.tmp.\`airport_data_view\` WHERE geo_summary = 'Domestic' group by \`year\`", domesticPassengers, 'blue');

setInterval(function() {
loadDataForLineWihAggregate("select \`year\`, \`month\`, sum(PASSENGER_COUNT) as \`total\` from dfs.tmp.\`airport_data_view\` WHERE `year` in (2013,2014,2015) group by \`year\`, \`month\`", passengerPerMontLine);
}, 800)


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()
