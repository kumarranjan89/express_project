/**
 * GET /
 * Logout
 */

 module.exports = (req, res) => {
 	//res.send('Hello world');
 	res.render('home/index', {
 		title: "Welcome"
 	});
 }