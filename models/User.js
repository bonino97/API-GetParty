const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    picture: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
