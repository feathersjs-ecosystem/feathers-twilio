const {
  expect
} = require('chai');

const testApp = require('./test-app');
const { call: callService } = require('../lib');

let server;
let app;

describe('Twilio Call Service', function () {
  before(done => {
    const options = {
      accountSid: 'AC_test',
      authToken: 'your auth token' // ex. your.domain.com
    };
    app = testApp(options);
    server = app.listen(3030, () => {
      done();
    });
  });

  after(done => server.close(() => done()));

  describe('Initialization', () => {
    describe('when missing accountSid key', () => {
      it('throws an error', () => {
        expect(callService.bind(null, {})).to.throw('Twilio `accountSid` needs to be provided');
      });
    });

    describe('when missing authToken', () => {
      it('throws an error', () => {
        expect(callService.bind(null, { accountSid: 'SID' })).to.throw('Twilio `authToken` needs to be provided');
      });
    });
  });

  describe('Making calls', () => {
    describe('when missing from field', () => {
      it('throws an error', (done) => {
        app.service('twilio/sms').create({}).then(done).catch(err => {
          expect(err.code).to.equal(400);
          expect(err.message).to.equal('`from` must be specified');
          done();
        });
      });
    });

    describe('when missing to field', () => {
      it('throws an error', (done) => {
        app.service('twilio/sms').create({ from: '+15005550006' }).then(done).catch(err => {
          expect(err.code).to.equal(400);
          expect(err.message).to.equal('`to` must be specified');
          done();
        });
      });
    });

    describe('when missing body or applicationSid field', () => {
      it('throws an error', (done) => {
        app.service('twilio/sms').create({ from: '+15005550006', to: '+15551234567' }).then(done).catch(err => {
          expect(err.code).to.equal(400);
          expect(err.message).to.equal('`body` or `mediaUrl` must be specified');
          done();
        });
      });
    });
  });
});
