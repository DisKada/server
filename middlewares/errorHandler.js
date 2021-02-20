function errorHandler (err, req, res, next) {
    let status = 500;
	let message = 'Internal Server Error';
	if (err.name === 'SequelizeValidationError') {
		status = 400;
		message = [];
		err.errors.forEach((el) => {
			message.push(el.message);
		});
	} else if (err.name === 'SequelizeUniqueConstraintError') {
		status = 400;
		message = 'This Email has been Taken, try another one';
	} else if (err.name === 'InvalidEmailOrPassword') {
		status = 401;
		message = 'Invalid Email or Password';
	} else if (err.name === 'NotCalon') {
		status = 401;
		message = 'Only Calon Who Have Authorization for this Action';
	} else if (err.name === 'NotLoginYet') {
		status = 401;
		message = 'Please Login First';
	} else if (err.name === 'JsonWebTokenError') {
		status = 401;
		message = 'Invalid Email Or Password';
	} else if (err.name === 'EmailOrPasswordCannotBeNull') {
		status = 400;
		message = 'Email or Password is required';
	} else if (err.name === 'UserNotFound') {
		status = 404;
		message = 'User Not Found';
	} 
	res.status(status).json({
		message: message,
	});
}

module.exports = {errorHandler}