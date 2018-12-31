import call from './services/call';
import sms from './services/sms';

if (!global._babelPolyfill) { require('@babel/polyfill'); }

export default { call, sms };
