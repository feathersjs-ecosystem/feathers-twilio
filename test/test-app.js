const feathers = require('feathers');
const smsService = require('../lib').sms;
const callService = require('../lib').call;

const options = {
  accountSid: 'your acount sid',
  authToken: 'your auth token' // ex. your.domain.com
};

// Create a feathers instance with a mailer service
var app = feathers()
  .use('/twilio/sms', smsService(options))
  .use('/twilio/calls', callService(options));

module.exports = app;