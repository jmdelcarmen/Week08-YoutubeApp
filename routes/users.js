'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Video = require('../models/video');

module.exports.displayLogin = (req, res) => {
  res.render('login', {title: 'Login'});
}

module.exports.loginUser = (req, res, next) => {
  req.flash('success', 'You are now logged in');
  res.redirect('/');
}

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
}

module.exports.displayRegister = (req, res) => {
  res.render('register', { title: 'Register' });
}

module.exports.registerUser = (req, res) => {
  //set default profile image
  let profileImage = '';
  req.file ? profileImage = "uploads/" + req.file.filename : profileImage = "uploads/default.jpg";

  // Form validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Confirm-password field is required').notEmpty();
  // Check for errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {errors: errors});
  } else if (req.body.password !== req.body.password2) {
    //handle error for password confirmation
    req.flash('error', 'Confirm-password does not match given password.');
    res.redirect('/users/register');
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      profileImage: profileImage
    });

    newUser.save((e, data) => {
      if(e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
      } else {
        req.flash('success', 'You are now registered and can login.');
        res.redirect('/');
      }
    });
  }
}

module.exports.displayUserProfile = (req, res) => {
  //search user's videos
  Video.find({"publisher.username": req.user.username}, (err, videos) => {
    if (err) {
      req.flash('error', 'Failed to load user profile');
      res.redirect('/');
    }
    // res.json({videos: videos});
    res.render('user/profile', {videos: videos});
  });
}
