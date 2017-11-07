'use strict';

const Hapi = require('hapi');
const jwt = require('jwt-simple');

var KEY = "QzXl5fGWo5mzQednABoFIzriTeZhBgYm";
var SECRET = "oqYe3GX1xPu5gziymPYHLuf6VfJNCaON";
const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });

// Register bell with the server
server.register(require('bell'), function (err) {
 
    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: 'cookie_encryption_password_secure',
        clientId: 'fRV9eeGT29UFqV11eFo1ZxqPP',
        clientSecret: 'uU1M1ucHEYHck0ygtnUBOmB4ZrLNa56RgCoFqPxsU3uIWsTzsZ', 
        isSecure: false     // Terrible idea but required if not using HTTPS especially if developing locally
    });

    // Use the 'twitter' authentication strategy to protect the
    // endpoint handling the incoming authentication credentials.
    // This endpoints usually looks up the third party account in
    // the database and sets some application state (cookie) with
    // the local application account information.
    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/login',          // The callback endpoint registered with the provider
        config: {
            auth: 'twitter',
            handler: function (request, reply) {
 
                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }
 
                // Perform any account lookup or registration, setup local session,
                // and redirect to the application. The third-party credentials are
                // stored in request.auth.credentials. Any query parameters from
                // the initial request are passed back via request.auth.credentials.query.
                return reply('Hello!');
            }
        }

    });
    
server.route({
    method: 'GET',
    path: '/jwt',
    handler: function createToken(request, reply){
	const payload = {
		iss: KEY,
		roles: ["admin","client"]
		}
		return reply(jwt.encode(payload, SECRET))
	}
});

  // Start the server
  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
  });