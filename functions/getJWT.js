/* External */

const jwt = require('jsonwebtoken');
/* Internal */
const config = require('../config/config');
const logging = require('../config/logging');

const NAMESPACE = 'Functions';
module.exports = getJWTData = async (token) => {
  try {
    if (token) {
      logging.info(NAMESPACE, `Get JWT Data `, token);
      const decodedToken = jwt.verify(token, config.server.token.secret);
      if (!decodedToken) return false;
      return decodedToken;
    }
    return false;
  } catch (error) {
    logging.error(NAMESPACE, `Error in getJWTData`, error);
    return false;
  }
};
