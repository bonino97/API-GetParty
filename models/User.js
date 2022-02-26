const mongoose = require('mongoose');

const slug = require('slug');
const shortId = require('shortid');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
  {
    email: { type: String, required: 'Email required.', trim: true, unique: true, lowercase: true },
    password: { type: String, trim: true },
    name: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'MEMBER',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    termsAndConditions: {
      type: Boolean,
      default: false,
    },
    authBy: String,
    code: Number,
    token: String,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const SALT_ROUNDS = 10;
  const user = this;
  if (user.isNew) {
    const password = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = password;
    const url = slug(user.name);
    user.profileUrl = `${url}-${shortId.generate()}`;
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('User', UserSchema);
