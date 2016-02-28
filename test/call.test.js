/*jshint expr: true*/


import { expect } from 'chai';
import app from './test-app';
import { call as callService } from '../src';

let server;

describe('Twilio Call Service', function () {
  before(done => {
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
        expect(callService.bind(null, {accountSid: 'SID'})).to.throw('Twilio `authToken` needs to be provided');
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
        app.service('twilio/sms').create({from: '+15005550006'}).then(done).catch(err => {
          expect(err.code).to.equal(400);
          expect(err.message).to.equal('`to` must be specified');
          done();
        });
      });
    });

    describe('when missing body or mediaUrl field', () => {
      it('throws an error', (done) => {
        app.service('twilio/sms').create({from: '+15005550006', to: '+15551234567'}).then(done).catch(err => {
          expect(err.code).to.equal(400);
          expect(err.message).to.equal('`body` or `mediaUrl` must be specified');
          done();
        });
      });
    });
  });
});
