var querystring = require("querystring");
var https = require('https');
var _ = require('underscore');
var crypto = require('crypto');

_.mixin({
  compactObject: function(to_clean) {
    _.map(to_clean, function(value, accesskey, to_clean) {
      if (value === undefined)
        delete to_clean[accesskey];
    });
    return to_clean;
  }
});  

var Lakebtc = function(accesskey, privatetkey) {
  this.accesskey = accesskey;
  this.privatetkey = privatetkey;

  _.bindAll(this);
}

Lakebtc.prototype._request = function(method, action, path, data, callback, args) {
  var tonce = this._generateTonce();
  var options = {
    hostname: 'www.lakebtc.com',
    path: path,
    method: method,
    headers: {
      "User-Agent": 'LakeBTC node.js client',
      "Json-Rpc-Tonce": tonce
    }
  };
  
  if(method === 'post') {
    var ps = _.extend({
      tonce: tonce,
      accesskey: this.accesskey,
      requestmethod: 'post',
      id: 1,
      method: action,
      params: args.join(',')
    });
  
    ps = _.compactObject(ps);
    var pstring = querystring.unescape(querystring.stringify(ps));
    var hash = crypto.createHmac('sha1', this.privatetkey).update(pstring).digest('hex');
    var pair = this.accesskey + ":" + hash;
    var b64 = "Basic " + (new Buffer(pair)).toString('base64');
    options.headers['Authorization'] = b64;
    options.headers['Content-Length'] = data.length;
    options.headers['content-type'] = 'application/json-rpc';
  }
  
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var buffer = '';
    res.on('data', function(data) {
      buffer += data;
    });
	
    res.on('end', function() {
      try {
        var json = JSON.parse(buffer);
      } catch (err) {
        return callback(err);
      }
      callback(null, json);
    });
	
  });
  
  req.on('error', function(err) {
    callback(err);
  });

  req.on('socket', function (socket) {
    socket.setTimeout(5000);
    socket.on('timeout', function() {
      req.abort();
    });
    socket.on('error', function(err) {
      callback(err);
    });
  });
  req.end(data);
}

Lakebtc.prototype._generateTonce = function() {
  var now = new Date().getTime();

  if(now !== this.last)
    this.tonceIncr = -1;

  this.last = now;
  this.tonceIncr++;
  var padding = 
    this.tonceIncr < 10 ? '000' : 
      this.tonceIncr < 100 ? '00' :
        this.tonceIncr < 1000 ?  '0' : '';
  return now + padding + this.tonceIncr;
}

Lakebtc.prototype._get = function(action, callback, args) {
  if(!args){args = [];}
  args = _.compactObject(args);
  var path = '/api_v1/' + action + '/?' + querystring.stringify(args);
  this._request('get', action, path, undefined, callback, args);
}

Lakebtc.prototype._post = function(action, callback, args) {
  if(!this.accesskey || !this.privatetkey)
    return callback('Must provide accesskey and privatetkey to make this API request.');
  if(!args){args = [];}
  var path = '/api_v1/';
  ps = _.extend({
    id: 1,
    method: action,
    params: args
  });

  ps = _.compactObject(ps);
  var data = JSON.stringify(ps);
  this._request('post', action, path, data, callback, args);
}

// 
// Public API
// 

Lakebtc.prototype.ticker = function(callback) {
  this._get('ticker', callback);
}

Lakebtc.prototype.bcorderbook = function(callback) {
  this._get('bcorderbook', callback);
}

Lakebtc.prototype.bcorderbook_cny = function(callback) {
  this._get('bcorderbook_cny', callback);
}

Lakebtc.prototype.bctrades = function(callback, time) {
  this._get('bctrades', callback, {since: time});
}

//
// Private API (you need to have accesskey / privatetkey set)
//

Lakebtc.prototype.getAccountInfo = function(callback) {
  this._post('getAccountInfo', callback);
}

Lakebtc.prototype.getOrders = function(callback) {
  this._post('getOrders', callback);
}

// args should be an array.
Lakebtc.prototype.cancelOrder = function(callback, args) {
  this._post('cancelOrder', callback, args);
}

Lakebtc.prototype.buyOrder = function(callback, args) {
  this._post('buyOrder', callback, args);
}

Lakebtc.prototype.sellOrder = function(callback, args) {
  this._post('sellOrder', callback, args);
}

module.exports = Lakebtc;
