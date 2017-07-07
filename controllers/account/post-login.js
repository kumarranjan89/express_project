const passport = require('passport');
/**
 * POST /
 * Login 
 */

 module.exports = (req, res) => {
 	//req.checkBody('postparam', 'Message') //express validator, check req.body
 	//req.checkParams('urlparam', 'Message') //express validator, check req.params
 	//req.checkQuery('getparam', 'Message'') //express validator, check req.query
 	//req.assert('anyparam', 'Message'') //express validator, any param
 	
 	req.assert('email', 'Email is not valid').isEmail();
 	req.assert('password', 'Password should not empty').notEmpty();
 	req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
 	
 	errors = req.validationErrors();

 	if(!errors) {

 		passport.authenticate('local', (err, user, info) => { 
 			console.log("Working");			
		    if (err) { return next(err); }

		    if (!user) {
		    	req.flash('errors', info);
		      	console.log("login failed: ", info)
		      	//return res.redirect('/login');
		    }
		    
		    req.logIn(user, (err) => {
		      console.log("login success: ", user)
		      if (err) { return next(err); }
		      console.log("You are logged in")
		      //req.flash('success', { msg: 'Success! You are logged in.' });
		      //res.redirect(req.session.returnTo || '/');
		    });

		  })

 	} else {
		res.render('account/login', {
	 		title: "Login",
	 		errors: errors
	 	}); 		
 	}
 }