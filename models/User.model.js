const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      trim: true,
      required: [true, 'Display name is required.'],
      unique: false,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);