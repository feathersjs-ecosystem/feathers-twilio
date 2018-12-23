const smsService = require('../lib').sms;
const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const errorHandler = require('@feathersjs/errors/handler');

// Create a feathers instance.
const app = express(feathers());

app
  // Enable REST services
  .configure(express.rest())
  // Enable Socket.io services
  .configure(socketio())
  // Turn on JSON parser for REST services
  .use(express.json())
  // Turn on URL-encoded parser for REST services
  .use(express.urlencoded({ extended: true }));

app.use(
  '/twilio/sms',
  smsService({
    accountSid: 'your acount sid',
    authToken: 'your auth token'
  })
);

app.use(errorHandler());

// Send a text message!
app.service('twilio/sms').create({
  from: '+15005550006', // Your Twilio SMS capable phone number
  to: '+15551234567',
  body: 'Twilio test'
}).then(function (result) {
  console.log('Sent SMS', result);
}).catch(err => {
  console.log(err);
});

// Start the server.
const port = 3030;

app.listen(port, function () {
  console.log(`Feathers server listening on port ${port}`);
});
