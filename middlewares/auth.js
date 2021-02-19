const {cekToken} = require('../helpers/jwt')
const { User } = require('../models') 

async function authenticate (req,res,next) {
    try {
		const { access_token } = req.headers;
		if (!access_token) {
			next({
				name: 'NotLoginYet',
			});
		} else {
			const decoded = cekToken(access_token);
			// console.log(decoded);
			req.userid = decoded;
			const user = await User.findOne({
				where: {
					id: decoded.id,
				},
			});
			if (user) {
				next();
			} else {
				next({
					name: 'NotLoginYet',
				});
			}
		}
	} catch (err) {
		next(err);
	}
 }

 function authorize (req, res, next) {
    if (req.userid.status === 'verified') {
		next();
	} else {
		next({
			name: 'NotGovernor',
		});
	}
 }


 module.exports = {authenticate,authorize}