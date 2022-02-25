const mongoose = require('mongoose');

const slug = require('slug');
const shortId = require('shortid');

const UserSchema = mongoose.Schema(
  {
    email: { type: String, required: 'Email required.', trim: true, unique: true, lowercase: true },
    password: { type: String, required: 'Password required.', trim: true },
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
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    termsAndConditions: {
      type: Boolean,
      default: false,
    },
    code: Number,
  },
  { timestamps: true }
);

UserSchema.pre('save', (user, next) => {
  const url = slug(user.name);
  user.profileUrl = user.profileUrl ? user.profileUrl : `${url}-${shortId.generate()}`;
  next();
});

module.exports = mongoose.model('User', UserSchema);
