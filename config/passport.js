const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */

//  passport.use(new LocalStrategy(
//   function(email, password, done) {
//     console.log(email, password);
//     User.findOne({ email: email }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       //if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

// passport.use(new LocalStrategy({usernameField:'phoneNumber',
//     passwordField:'password'},(username, password, done) => {
//   User.findOne({ email: email.toLowerCase() }, (err, user) => {
//     if (err) { return done(err); }
//     if (!user) {
//       return done(null, false, { msg: `Email ${email} not found.` });
//     }
//     user.comparePassword(password, (err, isMatch) => {
//       if (err) { return done(err); }
//       if (isMatch) {
//         return done(null, user);
//       }
//       return done(null, false, { msg: 'Invalid email or password.' });
//     });
//   });
// }));


passport.use(new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
}, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    console.log(email, password);
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    /*user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });*/
  });
}));