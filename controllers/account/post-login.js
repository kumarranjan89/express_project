const passport = require('passport');
/**
 * POST /
 * Login 
 */

 module.exports = (req, res, next) => {
 	//req.checkBody('postparam', 'Message') //express validator, check req.body
 	//req.checkParams('urlparam', 'Message') //express validator, check req.params
 	//req.checkQuery('getparam', 'Message'') //express validator, check req.query
 	//req.assert('anyparam', 'Message'') //express validator, any param
 	req.assert('email', 'Email is not valid').isEmail();
 	req.assert('password', 'Password should not empty').notEmpty();
 	req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
 	
 	errors = req.validationErrors();
	// const user = {
	// 	email: req.body.email,
	// 	password: req.body.password
	// };
 	if(!errors) {
 		passport.authenticate('local', (err, user, info) => { 
 			console.log("Working");			
		    if (err) { return next(err); }

		    if (!user) {
		    	console.log("user not found");
		    	//req.flash('errors', info);
		      	//return res.redirect('/login');
		    }
		    
		    req.logIn(user, (err) => {
		      //if (err) { return next(err); }
		      console.log("You are logged in")
		      //req.flash('success', { msg: 'Success! You are logged in.' });
		      //res.redirect(req.session.returnTo || '/');
		    });

		  })(req, res, next);

 	} else {
		res.render('account/login', {
	 		title: "Login",
	 		errors: errors
	 	}); 		
 	}
 }

 /**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};