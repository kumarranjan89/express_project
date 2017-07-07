/**
 * GET /
 * Forget Password Page
 */

 module.exports = (req, res) => {
 	//res.send('Hello world');
 	res.render('account/forget-password', {
 		title: "Forget Password"
 	});
 }