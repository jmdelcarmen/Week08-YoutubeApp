const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) =>{
  res.render('index');
});

router.route('/login')
  .get((req, res) => {
    res.render('login', {title: 'Login'})
  })
  .post(passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}), (req, res) => {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

router.route("/register")
  .get((req, res) => {
    res.render('register', { title: 'Register' });
  })
  .post((req, res) => {
    //set default profile image
    var profileImage = '';
    req.file ? profileImage = "./uploads/" + req.file.filename : profileImage = "uploads/default.jpg"

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
          req.flash('error', 'Username or Email already exists.');
          res.redirect('/users/register');
        } else {
          req.flash('success', 'You are now registered and can login.');
          res.redirect('/');
        }
      });
    }
  });

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
});



module.exports = router;
