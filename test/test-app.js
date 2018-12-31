const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const smsService = require('../lib').sms;
const callService = require('../lib').call;

module.exports = function (options) {
// Create a feathers instance with a mailer service
  var app = express(feathers())
    .use('/twilio/sms', smsService(options))
    .use('/twilio/calls', callService(options));
  return app;
};
