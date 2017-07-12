/**
 * GET /
 * Logout
 */

 module.exports = (req, res) => {
 	//res.send('Hello world');
 	req.logout();
 	res.render('index', {
 		title: "Home Page"
 	});
 }