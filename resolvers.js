const { AuthenticationError, PubSub } = require('apollo-server');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

const { PIN_ADDED, PIN_DELETED, PIN_UPDATED } = require('./constants/subscriptions');

const sendMail = require('./config/email');
const signJWTAsync = require('./functions/signJWT');

const Pin = require('./models/Pin');
const User = require('./models/User');

const confirmAccountTemplate = require('./handlers/confirmAccountEmail');
const resetPasswordTemplate = require('./handlers/resetPasswordEmail');

const pubsub = new PubSub();

const SALT_ROUNDS = 10;

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) throw new AuthenticationError('You must be logged in');
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({}).populate('author').populate('comments.author').sort({ createdAt: -1 });
      return pins;
    },
    getPin: async (root, args, ctx) => {
      const pinId = args?.pinId;
      const pin = await Pin.findById(pinId);
      if (!pin) throw new Error(`PinId doesn't exists.`);
      return pin;
    },
    getPinBySlug: async (root, args, ctx) => {
      const { slug } = args?.input;
      const pin = await Pin.findOne({ slug }).populate('author').populate('comments.author');
      if (!pin) throw new Error(`Pin url doesn't exists.`);
      return pin;
    },
  },
  Mutation: {
    register: async (root, args, ctx) => {
      try {
        const password = await bcrypt.hash(args?.input?.password, SALT_ROUNDS);
        const user = await new User({
          ...args.input,
          token: uuid(),
          authBy: 'JWT',
          password,
        }).save();
        await sendMail(confirmAccountTemplate(user));
        return user;
      } catch (error) {
        if (error && error.code === 11000) {
          throw new Error('User with email already exists.');
        }
        throw new Error(error);
      }
    },
    confirmAccount: async (root, args, ctx) => {
      try {
        const { token } = args.input;
        const user = await User.findOneAndUpdate({ token }, { isActive: true, token: '' }, { new: true }).exec();
        if (!user) throw new Error('Invalid token.');
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    login: async (root, args, ctx) => {
      try {
        const { email, password } = args.input;
        const user = await User.findOne({ email, isActive: true });
        if (!user) throw new Error('Please, confirm your account.');
        const compare = bcrypt.compareSync(password, user?.password);
        if (!compare) throw new Error('Incorrect password, try again, or sign in with google.');
        const jwt = await signJWTAsync(user);
        if (!jwt) throw new Error('An error ocurred authenticating user.');
        await user.updateOne({ jwt, authBy: 'JWT' }, { new: true });
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    forgotPassword: async (root, args, ctx) => {
      try {
        const { email } = args.input;
        const user = await User.findOneAndUpdate({ email }, { token: uuid() }, { new: true }).exec();
        if (!user) throw new Error('Email not found.');
        await sendMail(resetPasswordTemplate(user));
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    resetPassword: async (root, args, ctx) => {
      try {
        const { token, password } = args.input;
        const newPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.findOneAndUpdate({ token }, { isActive: true, token: '', password: newPassword }, { new: true }).exec();
        if (!user) throw new Error('Token not found.');
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    createPin: authenticated(async (root, args, ctx) => {
      try {
        const newPin = await new Pin({
          ...args.input,
          author: ctx.currentUser._id,
        }).save();

        const pinAdded = await Pin.populate(newPin, 'author');
        pubsub.publish(PIN_ADDED, { pinAdded });
        return pinAdded;
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      try {
        const pinDeleted = await Pin.findOneAndDelete({
          _id: args.pinId,
        }).exec();
        pubsub.publish(PIN_DELETED, { pinDeleted });
        return pinDeleted;
      } catch (error) {
        throw new Error(error);
      }
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinId = args.pinId;
      const pinUpdated = await Pin.findByIdAndUpdate(pinId, { $push: { comments: newComment } }, { new: true })
        .populate('author')
        .populate('comments.author');
      pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    }),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator([PIN_ADDED]),
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator([PIN_DELETED]),
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator([PIN_UPDATED]),
    },
  },
};
