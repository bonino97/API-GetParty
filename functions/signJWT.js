const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signJWTAsync = async (user) => {
  //   const timeSinceEpoch = new Date().getTime();
  //   const expirationTime = timeSinceEpoch + Number(config?.server?.token.expireTime) * 100000;
  //   const expirationTimeInSeconds = Math.floor(expirationTime / 1000);
  const expirationTimeInSeconds = 5184000;
  try {
    const value = await jwt.sign(
      {
        id: user?._id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
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
    console.error(error);
    logging.error(NAMESPACE, error.message, error);
    return error;
  }
};

export default signJWTAsync;
