const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//access schema prop of mongoose
const Schema = mongoose.Schema;
//create instance of mongoose schema
var userSchema = new Schema({
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
    type: String
  },
  created_at: {type: Date, default: Date.now },
  //video objects
  videoUploads: {type: Array},
  //path to videos
  favorites: {type: Array}
});

const User = mongoose.model('User', userSchema);

//export the model/collection with the name of 'User'
module.exports = User
