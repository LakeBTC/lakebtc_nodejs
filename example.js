var LakeBTC = require('./lakebtc.js');

// Either pass your API key and secret as the first and second parameters to example.js. eg
// node example.js your-api-key your-api-secret
//
// Or enter them below.
// WARNING never commit your API keys into a public repository.
var email = process.argv[2] || 'your-email';
var secret = process.argv[3] || 'your-api-secret';

var publicLakeBTC = new LakeBTC();
//publicLakeBTC.ticker(console.log);
//publicLakeBTC.bcorderbook_cny(console.log);
//publicLakeBTC.bctrades(console.log, '1393684528');

var privateLakebtc = new LakeBTC(email, secret);
//privateLakebtc.getAccountInfo(console.log);
//privateLakebtc.buyOrder(console.log, [100, 0.2, 'USD']);
//privateLakebtc.getAccountInfo(console.log);
//privateLakebtc.getOrders(console.log);
//privateLakebtc.cancelOrder(console.log, [335435292]);
//privateLakebtc.getTrades(console.log, [1404136800]);
