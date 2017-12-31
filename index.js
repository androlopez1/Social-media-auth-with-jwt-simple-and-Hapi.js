'use strict';

const Hapi = require('hapi');
const jwt = require('jwt-simple');

var KEY = //"TYPE YOUR KEY HERE";
var SECRET = //"TYPE YOUR SECRET HERE";
const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });

server.register(require('bell'), function (err) {

    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: 'cookie_encryption_password_secure',
        clientId: //'',
        clientSecret:// '', 
        isSecure: false     
    });

    server.route({
        method: ['GET', 'POST'], 
        path: '/login',          
        config: {
            auth: 'twitter',
            handler: function (request, reply) {
 
                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }

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

  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
  });