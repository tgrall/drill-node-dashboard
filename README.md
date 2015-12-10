# ASCII Dashboard with Apache Drill & Node.js

This repository contains simple dashboard buil with Apache Drill REST API and Blessed-Contrib.


The dataset used for this application is the Passengers.csv file coming from the [SFO Open Data](http://www.flysfo.com/media/facts-statistics/air-traffic-statistics). For simplicity reason and support any Drill release, just remove the first line (header)

Then create a view:

```
CREATE OR REPLACE VIEW dfs.tmp.`airport_data_view` AS
SELECT
CAST(SUBSTR(columns[0],1,4) AS INT)  `YEAR`,
CAST(SUBSTR(columns[0],5,2) AS INT) `MONTH`,
columns[1] as `AIRLINE`,
columns[2] as `IATA_CODE`,
columns[3] as `AIRLINE_2`,
columns[4] as `IATA_CODE_2`,
columns[5] as `GEO_SUMMARY`,
columns[6] as `GEO_REGION`,
columns[7] as `ACTIVITY_CODE`,
columns[8] as `PRICE_CODE`,
columns[9] as `TERMINAL`,
columns[10] as `BOARDING_AREA`,
CAST(columns[11] AS DOUBLE) as `PASSENGER_COUNT`
FROM dfs.data.`/airport/*.csv`
```

Run the dashboard, pointing to your Drill deployment

```
npm install

node dashboard http://localhost:8047
```


This looks like:

[http://tgrall.github.io/images/posts/drill_dashboard/dashboard_demo.gif]


