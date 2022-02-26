const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  try {
    const googleUser = await verifyGoogleAuthToken(token);
    if (googleUser) {
      const user = await checkIfUserExists(googleUser?.email);
      return user ? user : createNewUser(googleUser);
    }

    const authUser = await verifyAuthToken(token);
    if (authUser) {
      const user = await checkIfUserExists(authUser?.email);
      return user;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

const verifyGoogleAuthToken = async (idToken) => {
  try {
    const audience = process.env.OAUTH_CLIENT_ID;
    const ticket = await client.verifyIdToken({
      idToken,
      audience,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Error verifying auth token.', error);
    return error;
  }
};

const verifyAuthToken = async (token) => {
  console.log(token);
};

const checkIfUserExists = async (email) => await User.findOne({ email }).exec();

const createNewUser = async (googleUser) => {
  try {
    const { name, email, picture } = googleUser;
    const user = { name, email, picture };
    return new User(user).save();
  } catch (error) {
    console.error(error);
    return error;
  }
};
