const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const smsService = require('../lib').sms;

// Create a feathers instance.
var app = feathers()
// Enable REST services
  .configure(rest())
  // Enable Socket.io services
  .configure(socketio())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}));

app.use('/twilio/sms', smsService({
  accountSid: 'your acount sid',
  authToken: 'your auth token' // ex. your.domain.com
}));

// Send an email!
app.service('twilio/sms').create({
  from: '+15005550006', // Your Twilio SMS capable phone number
  to: '+15551234567',
  body: 'Twilio test'
}).then(function (result) {
  console.log('Sent SMS', result);
}).catch(err => {
  console.log(err);
});

app.use(errorHandler());

// Start the server.
const port = 3030;

app.listen(port, function () {
  console.log(`Feathers server listening on port ${port}`);
});
