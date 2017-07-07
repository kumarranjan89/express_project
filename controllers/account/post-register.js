/**
 * POST /
 * Register 
 */

 const User = require('../../models/User');

 module.exports = (req, res) => {
 	//req.checkBody('postparam', 'Message') //express validator, check req.body
 	//req.checkParams('urlparam', 'Message') //express validator, check req.params
 	//req.checkQuery('getparam', 'Message'') //express validator, check req.query
 	//req.assert('anyparam', 'Message'') //express validator, any param
 	
 	req.assert('firstname', 'First Name should not empty').notEmpty();
 	req.assert('lastname', 'Last Name should not empty').notEmpty();
 	req.assert('email', 'Email should not empty').notEmpty();
 	req.assert('email', 'Email is not valid').isEmail();
 	req.assert('mobile', 'Mobile should not empty').notEmpty();
 	req.assert('password', 'Password should not empty').notEmpty();
 	req.assert('cpassword', 'Confirm Password should not empty').notEmpty();
 	req.assert('password','Passwords do not match.').equals(req.body.cpassword);

 	//req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

 	errors = req.validationErrors();
 	
 	if(!errors) {
 		const user = new User({
 			email: req.body.email,
 			mobile: req.body.mobile || null,
 			
 			password: req.body.password,
 			profile: {
 				firstname: req.body.firstname,
 				lastname: req.body.lastname,
 				gender: req.body.gender || null
 			}
 		});

 		User.findOne({ "email": req.body.email }, (err, existingUser) => {
 			if(err) console.log(err)

 			if(existingUser) {
 				res.render('account/register', {
			 		title: "Register",
			 		errors: [
			 			{ 'msg': "user is already there" }
			 		]
			 	})
 			} else {
 				user.save(function(err1) {
		 			if(err1) console.log(err1);
		 			res.json({"response": "data inserted successfully"});
		 			console.log("data inserted");
		 		})		
 			}
 		})

 		
 	} else {
		res.render('account/register', {
	 		title: "Register",
	 		errors: errors
	 	}); 		
 	}
 	
 }