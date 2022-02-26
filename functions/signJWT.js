const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logging = require('../config/logging');

module.exports = signJWTAsync = async (user) => {
  //   const timeSinceEpoch = new Date().getTime();
  //   const expirationTime = timeSinceEpoch + Number(config?.server?.token.expireTime) * 100000;
  //   const expirationTimeInSeconds = Math.floor(expirationTime / 1000);
  const expirationTimeInSeconds = 5184000;
  try {
    const value = await jwt.sign(
      {
        id: user?._id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
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
