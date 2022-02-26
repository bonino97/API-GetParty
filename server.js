const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const { findOrCreateUser } = require('./controllers/userController');

const config = require('./config/config');
const getJWTData = require('./functions/getJWT');

require('dotenv').config();

mongoose
  .connect(config?.mongo?.url, { useNewUrlParser: true })
  .then(() => {
    console.log('Db Connected');
  })
  .catch((e) => {
    console.error(e);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;

    try {
      authToken = req?.headers?.authorization;
      const tokenUser = await getJWTData(authToken);

      if (tokenUser) {
        currentUser = await getJWTData(authToken);
        console.log(currentUser);
        return { currentUser };
      }

      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
        console.log(currentUser);
        return { currentUser };
      }
    } catch (error) {
      console.error(error);
      console.error(`Unable to authenticate user with Token ${authToken}`);
      return error;
    }

    return { currentUser };
  },
});

server.listen({ port: config?.server?.port }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
