const feathers = require('feathers');
const smsService = require('../lib').sms;
const callService = require('../lib').call;

// We're passing in options just to configure the test app for certain test scenarios
export default function(options) {
// Create a feathers instance with a mailer service
var app = feathers()
  .use('/twilio/sms', smsService(options))
  .use('/twilio/calls', callService(options));
  return app;
}
