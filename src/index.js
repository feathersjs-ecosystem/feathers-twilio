if (!global._babelPolyfill) { require('babel-polyfill'); }

import call from './services/call';
import sms from './services/sms';

export default { call, sms };