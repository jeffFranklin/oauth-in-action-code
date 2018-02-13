var express = require("express");
var request = require("sync-request");
var url = require("url");
var qs = require("qs");
var querystring = require('querystring');
var cons = require('consolidate');
var randomstring = require("randomstring");
var __ = require('underscore');
__.string = require('underscore.string');

var app = express();

app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', 'files/client');

// authorization server information
var authServer = {
	authorizationEndpoint: 'http://localhost:9001/authorize',
	tokenEndpoint: 'http://localhost:9001/token'
};

// client information


/*
 * Add the client information in here
 */
var client = {
	"client_id": "oauth-client-1",
	"client_secret": "oauth-client-secret-1",
	"redirect_uris": ["http://localhost:9000/callback"]
};

var protectedResource = 'http://localhost:9002/resource';

var state = randomstring.generate();

var access_token = null;
var scope = null;

app.get('/', function (req, res) {
	res.render('index', {access_token: access_token, scope: scope});
});

app.get('/authorize', function(req, res){
	const queryParams = {
	    response_type: 'code',
        client_id: client.client_id,
        redirect_uri: client.redirect_uris[0],
        state
	};
    const authorizeUrl = buildUrl(authServer.authorizationEndpoint, queryParams);
    res.redirect(authorizeUrl);
});

app.get('/callback', function(req, res){
    if (req.query.state !== state){
        res.render('error', {error: 'state value did not match'});
        return;
    }
    const form_data = qs.stringify({
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: client.redirect_uris[0]
    });
    const creds = encodeClientCredentials(client.client_id, client.client_secret);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${creds}`
    };
    const tokenRequest = {body: form_data, headers};
	const tokenResponse = request('POST', authServer.tokenEndpoint, tokenRequest);
	const tokenBody = JSON.parse(tokenResponse.getBody());
	console.log(tokenBody);

	// update globals
	access_token = tokenBody.access_token;
    scope = tokenBody.scope;
    state = randomstring.generate();
	res.render('index', {access_token, scope});
});

app.get('/fetch_resource', function(req, res) {

	/*
	 * Use the access token to call the resource server
	 */
	
});

var buildUrl = function(base, options, hash) {
	var newUrl = url.parse(base, true);
	delete newUrl.search;
	if (!newUrl.query) {
		newUrl.query = {};
	}
	__.each(options, function(value, key, list) {
		newUrl.query[key] = value;
	});
	if (hash) {
		newUrl.hash = hash;
	}
	
	return url.format(newUrl);
};

var encodeClientCredentials = function(clientId, clientSecret) {
	return new Buffer(querystring.escape(clientId) + ':' + querystring.escape(clientSecret)).toString('base64');
};

app.use('/', express.static('files/client'));

var server = app.listen(9000, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('OAuth Client is listening at http://%s:%s', host, port);
});
 
