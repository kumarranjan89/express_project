/**
 * GET /
 * Login Page
 */

 module.exports = (req, res) => {
 	//res.send('Hello world');
 	res.render('account/login', {
 		title: "Login"
 	});
 }