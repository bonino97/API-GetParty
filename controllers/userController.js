const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  const googleUser = await verifyGoogleAuthToken(token);
  let user = await checkIfUserExists(googleUser?.email);
  if (user && user?.authBy === 'JWT') await user.updateOne({ authBy: 'GOOGLE', picture: googleUser?.picture }, { new: true });
  return user ? user : createNewUser(googleUser);
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

const checkIfUserExists = async (email) => await User.findOne({ email }).exec();

const createNewUser = async (googleUser) => {
  try {
    const { name, email, picture } = googleUser;
    const user = { name, email, picture, authBy: 'GOOGLE' };
    return new User(user).save();
  } catch (error) {
    console.error(error);
    return error;
  }
};
