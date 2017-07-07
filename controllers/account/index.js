/**
 * List of controllers added related to accounts page
 */

 module.exports = {
 	getLogin: require('./get-login'),
 	postLogin: require('./post-login'),
 	getRegister: require('./get-register'),
 	postRegister: require('./post-register'),
 	getForgetPassword: require('./get-forget-password'),
 	postForgetPassword: require('./post-forget-password')
 }