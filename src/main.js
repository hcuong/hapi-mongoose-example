'use strict';

import fs from 'fs';
import Hapi from 'hapi';
import mongoose from 'mongoose';

const server = new Hapi.Server();

/* Mongoose Test */
mongoose.connect('mongodb://localhost/cuongcua');

// Bootstrap models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});
/**
 * require model
 */


server.connection({
  port: 3000,
  routes: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      }
    }
  }
});

const routes = './config/routes';
console.log(routes)
for (var route in routes) {
  console.log(route)
  server.route(routes[route]);
}

/*
 * Controllers
 */
const handleError = (reply) => {
  return (err) => {
    console.log(err.message);
    reply(500, err.message);
  }
};

/*
 *
 */
/*
 * Start
 */

server.start(() => {
  console.log('Server running at: ', server.info.uri);
});
