# lakebtc_nodejs

    npm install lakebtc_nodejs

A basic API code sample for the [LakeBTC REST API](https://www.lakebtc.com/s/api?locale=en). Please refer to [their documentation](https://www.lakebtc.com/s/api?locale=en) for all calls explained. Check out `example.js` for a list of all possible calls and their parameters.

    var Lakebtc = require('lakebtc');
    var publicLakeBTC = new Lakebtc;
    publicLakeBTC.ticker(console.log);
