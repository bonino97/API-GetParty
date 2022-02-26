require('dotenv').config();

const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 50,
  autoIndex: false,
  retryWrites: false,
};

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://';
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'root';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'root';
const MONGO_HOST = process.env.MONGO_HOST || 'beta-get-party.5mgdx.mongodb.net';
const MONGO_DBNAME = process.env.MONGO_DBNAME || 'beta-get-party';
const MONGO_URL =
  `${MONGO_URI}${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DBNAME}?retryWrites=true&w=majority` ||
  'mongodb+srv://root:root@beta-get-party.5mgdx.mongodb.net/beta-get-party?retryWrites=true&w=majority';

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  url: MONGO_URL,
  dbName: MONGO_DBNAME,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT || 4000;
const FRONT_HOSTNAME = process.env.FRONT_HOSTNAME || 3000;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 21600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'jwt-issuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'jwt-3ncrypt3d-p4ssw0rd';

const SERVER = {
  hostname: SERVER_HOSTNAME,
  front_hostname: FRONT_HOSTNAME,
  port: PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
};

const EMAIL_CONFIG = {
  user: process.env.EMAIL_USER || 'a9c799cf681af1',
  pass: process.env.EMAIL_PASS || 'bc8a20269d161e',
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.EMAIL_PORT || '2525',
};

const config = {
  mongo: MONGO,
  server: SERVER,
  email: EMAIL_CONFIG,
};

module.exports = config;
