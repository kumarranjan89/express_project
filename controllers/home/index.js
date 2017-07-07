/**
 * GET /
 * Home Page
 */

 exports.index = (req, res) => {
 	//res.send('Hello world');
 	res.render('index', {
 		title: "Home Page"
 	});
 }