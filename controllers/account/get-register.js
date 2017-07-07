/**
 * GET /
 * Register Page
 */

 module.exports = (req, res) => {
 	res.render('account/register', {
 		title: "Register"
 	})
 	
 }