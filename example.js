var LakeBTC = require('./lakebtc.js');

var publicLakeBTC = new LakeBTC();
publicLakeBTC.ticker(console.log);
//publicLakeBTC.bcorderbook_cny(console.log);
//publicLakeBTC.bctrades(console.log, '1393684528');

var privateLakebtc = new LakeBTC('YourEmail', 'YourPrivatekey');
//privateLakebtc.getAccountInfo(console.log);
//privateLakebtc.buyOrder(console.log, [500, 0.2, 'USD']);
//privateLakebtc.getAccountInfo(console.log);
//privateLakebtc.getOrders(console.log);
//privateLakebtc.cancelOrder(console.log, [335435292]);
