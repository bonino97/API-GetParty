const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logging = require('../config/logging');

const NAMESPACE = 'Functions';
module.exports = signJWTAsync = async (user) => {
  logging.error(NAMESPACE, 'signJWTAsync', 'Signing JWT');
  //   const timeSinceEpoch = new Date().getTime();
  //   const expirationTime = timeSinceEpoch + Number(config?.server?.token.expireTime) * 100000;
  //   const expirationTimeInSeconds = Math.floor(expirationTime / 1000);
  const expirationTimeInSeconds = 5184000;

  try {
    const value = await jwt.sign(
      {
        _id: user?._id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
        authBy: user?.authBy,
        picture: user?.picture,
      },
      config?.server?.token?.secret,
      {
        issuer: config?.server?.token?.issuer,
        algorithm: 'HS256',
        expiresIn: expirationTimeInSeconds,
      }
    );
    return value;
  } catch (error) {
    logging.error(NAMESPACE, error.message, error);
    return error;
  }
};
