const { AuthenticationError, PubSub } = require('apollo-server');
const {
  PIN_ADDED,
  PIN_DELETED,
  PIN_UPDATED,
} = require('./constants/subscriptions');

const Pin = require('./models/Pin');
const pubsub = new PubSub();

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) throw new AuthenticationError('You must be logged in');
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate('author')
        .populate('comments.author')
        .sort({ createdAt: -1 });
      return pins;
    },
    getPin: async (root, args, ctx) => {
      const pinId = args?.pinId;
      const pin = await Pin.findById(pinId);
      return pin;
    },
  },
  Mutation: {
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
      const pinUpdated = await Pin.findByIdAndUpdate(
        pinId,
        { $push: { comments: newComment } },
        { new: true }
      )
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
