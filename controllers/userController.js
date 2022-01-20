const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  //Verify auth token
  const googleUser = await verifyAuthToken(token);
  //Check if user exists.
  const user = await checkIfUserExists(googleUser?.email);
  //If user exists return them, create new user.
  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async (idToken) => {
  try {
    const audience = process.env.OAUTH_CLIENT_ID;
    const ticket = await client.verifyIdToken({
      idToken,
      audience,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Error verifying auth token.', error);
    return;
  }
};

const checkIfUserExists = async (email) => await User.findOne({ email }).exec();

const createNewUser = async (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
