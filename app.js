/**
 *  Module Dependencies
 */
const path = require('path');
const dotenv = require('dotenv');
const compression = require('compression');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const multer = require('multer');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
//const flash = require('express-flash');
const ejs = require('ejs');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const passport = require('passport');
const fs = require('fs');
const rfs = require('rotating-file-stream');

/**
 * Load Environment variables from .env file, where API keys and passwords are configured
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers: Route Handlers
 */
const homeController = require('./controllers/home');
const accountController = require('./controllers/account');

/**
 * API Keys and Passport configuration
 */
const passportConfig = require('./config/passport');

/**
 * Create Express App
 */
const app = express();

 /**
  * Connect to MongoDB
  */
 mongoose.Promise = global.Promise;
 mongoose.connect(process.env.MONGODB_URI);

 // If the connection throws an error
 mongoose.connection.on('error', (err) => {
 	console.log(err);
 	console.log('%s MongoDB connection error, Please make sure MongoDB is running.', chalk.red('X'));
 	process.exit();
 });

// When successfully connected
 mongoose.connection.on('connected', () => {
 	console.log("Mongoose default connection open to " + process.env.MONGODB_URI);
 });

// If the connection is disconnected
 mongoose.connection.on('disconnected', () => {
 	console.log("Mongoose default connection disconnected");
 });

// If the Node Process ends, close the Mongoose connection
 process.on('SIGINT', () => {
 	mongoose.connection.close(() => {
 		process.exit(0);
 	});
 });

/**
 * Express configuration
 */
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, 'views'));
app.use(expressStatusMonitor());
app.use(compression());
/*app.use(sass({
	src: path.join(__dirname, './public/sass'),
	src: path.join(__dirname, './public/css')
}));*/
app.use(logger('dev')); // log every request to the console

//log on file
var logDirectory = path.join(__dirname, 'log');

//ensure log direcotry exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); 

//create a rotating write stream
var accessLogStream = rfs('access.log', {
	interval: '1d', //rotate daily
	path: logDirectory
});

//setup the logger
app.use(logger('default', {stream: accessLogStream})); //write to file in combined format

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({  //just after bodyParser
	errorFormatter: function(param, msg, value) { //[optional], this option can be used to specify a function that must build error objects used in the validation result returned by req.getValidationResult(). 		 
		var namespace = param.split('.'),
		 	root = namespace.shift(),
			formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

/**
 * required for passport
 */
app.use(session({ 
	resave: true,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET, // session secret
	store: new MongoStore({
		url: process.env.MONGODB_URI,
		autoReconnect: true,
		clear_interval: 3600
	})
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session




/**
 * Serving static files
 */
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: 10 }))

/**
 * Global variable
 */
app.use((req, res, next) => {
	res.locals.errors = null;
	next();
});

/**
 * Primary app Routes
 */
app.get('/', homeController.index);
//app.get('/login', accountController.login);
app.route('/login')
	.get(accountController.getLogin)
	.post(accountController.postLogin);

app.route('/register')
	.get(accountController.getRegister)
	.post(accountController.postRegister);

app.route('/forget-password')
	.get(accountController.getForgetPassword)
	.post(accountController.postForgetPassword);

app.route('/logout')
	.get(accountController.getLogout);

/**
 * Api routes
 */


/**
 * OAuth authentication routes
 */

/**
 * 404 routes
 */
app.use(function(req, res, next){
	res.status(404);
    res.status(404).render('errors/404', {title: "Sorry, page not found"});
});

app.use(errorHandler());

/**
 * Start Express Server
 */
 app.listen(app.get('port'), () => {
 	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
 	console.log(' Press CTRL+C to stop\n');
 });

 module.exports = app;