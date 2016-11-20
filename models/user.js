'use strict';
const mongoose = require('mongoose');
//access schema prop of mongoose
//create instance of mongoose schema
let userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String
  },
  profileImage: {
    type: String,
    default: 'uploads/default.jpg'
  },
  created_at: {type: Date, default: Date.now },
  //video objects
  videoUploads: {type: Array},
  //path to videos
  favorites: {type: Array}
});

module.exports = mongoose.model('User', userSchema);
