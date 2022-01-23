const mongoose = require('mongoose');

const slug = require('slug');
const shortId = require('shortid');

const PinSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    phone: String,
    image: String,
    category: String, // Buscar diferentes tipos de musica ?
    startDate: Date,
    endDate: Date,

    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    availableTickets: Number,
    priceOfTicket: Number,
    takeFees: Boolean,

    isPeriodic: Boolean,
    isPrivate: Boolean,
    entryRequirements: String,
    tags: [String],
    instagram: String,
    twitter: String,
    facebook: String,

    slug: String,
    latitude: Number,
    longitude: Number,

    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
);

PinSchema.pre('save', function (next) {
  const pin = this;

  if (pin.isNew) {
    const url = slug(pin.title);
    pin.slug = `${url}-${shortId.generate()}`;
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('Pin', PinSchema);
