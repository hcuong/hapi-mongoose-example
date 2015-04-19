'use strict';

import fs from 'fs';
import Hapi from 'hapi';
import mongoose from 'mongoose';

const server = new Hapi.Server();
const port = process.env.PORT || 3000;
const dbURI = process.env.dbURI || 'mongodb://localhost/cuongcua';

// connect mongo
mongoose.connect(dbURI);

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', function () {
  console.log('Mongoose default connection is open');
});

// bootstrap models
require('./src/models/question')

server.connection({
  port: port,
  routes: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      }
    }
  }
});

// routes
const routes = require('./src/config/routes');

for (var route in routes) {
  server.route(routes[route]);
}


server.start(() => {
  console.log('Server running at: ', server.info.uri);
});
