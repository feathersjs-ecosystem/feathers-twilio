const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const testApp = require('./test-app');

const { sms: smsService } = require('../lib');
const { expect } = chai;

chai.use(sinonChai);

let server;
let app;

describe('Twilio SMS Service', function () {
  describe('Initialization', () => {
    describe('when missing accountSid key', () => {
      it('throws an error', () => {
        expect(smsService.bind(null, {})).to.throw('Twilio `accountSid` needs to be provided');
      });
    });

    describe('when missing authToken', () => {
      it('throws an error', () => {
        expect(smsService.bind(null, { accountSid: 'SID' })).to.throw('Twilio `authToken` needs to be provided');
      });
    });
  });

  describe('Validation', () => {
    before(done => {
      const options = {
        accountSid: 'AC_your account sid',
        authToken: 'your auth token' // ex. your.domain.com
      };
      app = testApp(options);

      server = app.listen(3030, () => {
        done();
      });
    });

    after(done => server.close(() => done()));

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

    describe('when missing body or mediaUrl field', () => {
      it('throws an error', (done) => {
        app.service('twilio/sms').create({ from: '+15005550006', to: '+15551234567' }).then(done).catch(err => {
          expect(err.code).to.equal(400);
          expect(err.message).to.equal('`body` or `mediaUrl` must be specified');
          done();
        });
      });
    });
  });

  describe('Sending messages', () => {
    var createMessage;
    beforeEach(function (done) {
      createMessage =
        sinon
          .stub(app.service('twilio/sms').twilio.messages, 'create').resolves({ sid: 1234 });
      done();
    });

    afterEach(function (done) {
      createMessage.restore();
      done();
    });

    describe('from field passed in with create', () => {
      before(done => {
        const options = {
          accountSid: 'AC_your account sid',
          authToken: 'your auth token' // ex. your.domain.com
        };
        app = testApp(options);

        server = app.listen(3030, () => {
          done();
        });
      });

      after(done => server.close(() => done()));
      describe('valid params with body', () => {
        it('sends a message via Twilio', (done) => {
          app.service('twilio/sms').create({ from: '+15005550006', to: '+15551234567', body: 'BODY' }).then(message => {
            expect(createMessage).to.have.been.calledWith({ from: '+15005550006', to: '+15551234567', body: 'BODY' });
            expect(message.sid).to.equal(1234);
            done();
          });
        });
      });

      describe('valid params with mediaUrl', () => {
        it('sends a message via Twilio', (done) => {
          app.service('twilio/sms').create({
            from: '+15005550006',
            to: '+15551234567',
            mediaUrl: 'MEDIA_URL'
          }).then(message => {
            expect(createMessage).to.have.been.calledWith({
              from: '+15005550006',
              to: '+15551234567',
              mediaUrl: 'MEDIA_URL'
            });
            expect(message.sid).to.equal(1234);
            done();
          });
        });
      });
    });

    describe('from field passed in as option', () => {
      before(done => {
        const options = {
          accountSid: 'AC_your account sid',
          authToken: 'your auth token',
          from: '+15005550006'
        };
        app = testApp(options);

        server = app.listen(3030, () => {
          done();
        });
      });

      after(done => server.close(() => done()));
      describe('valid params with body', () => {
        it('sends a message via Twilio', (done) => {
          app.service('twilio/sms').create({ to: '+15551234567', body: 'BODY' }).then(message => {
            expect(createMessage).to.have.been.calledWith({ from: '+15005550006', to: '+15551234567', body: 'BODY' });
            expect(message.sid).to.equal(1234);
            done();
          });
        });
      });
    });
  });
});
