const request = require('supertest')
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const { hashPassword } = require('../helpers/bcrypt');

const email = 'testing@mail.com';
const password = '123456';
const username = 'usertesting';
const status = '';
const visi = '';
const misi = '';
const image = '';

beforeAll((done) => {
	queryInterface
		.bulkInsert(
			'Users',
			[
				{
					username:username,
					email: email,
					password: hashPassword(password),
					status: status,
					visi: visi,
					misi: misi,
					image: image,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{ returning: true }
		)
		.then((user) => {
			// console.log(user)
			done();
		})
		.catch((err) => {
			done(err);
		});
});
afterAll((done) => {
	queryInterface
		.bulkDelete('Users')
		.then((response) => {
			done();
		})
		.catch((err) => {
			done(err);
		});
});
describe('Register User POST /register', () => {
	describe('Success Register', () => {
		it('Success response with Status 201 - returning email', (done) => {
			request(app)
				.post('/users/register')
				.send({username:'user', email: 'user@email.com', password: '123456' })
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(201);
					expect(body).toHaveProperty('email', 'user@email.com');
					done();
				});
		});
	});
	describe('Error Register', () => {
		it('Error Register with Status 400 - Cant create User because unique validation', (done) => {
			request(app)
				.post('/users/register')
				.send({ username:username,email: email, password: password })
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(400);
					expect(body).toHaveProperty(
						'message',
						'This Email has been Taken, try another one'
					);
					done();
				});
		});
		it('Error Register with Status 400 - Email and Password Cannot be Null', (done) => {
			request(app)
				.post('/users/register')
				.send({ username:'',email: '', password: '' })
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Invalid Email or Password');
					done();
				});
		});
		it('Error Register with Status 401 - Username Cannot be Null', (done) => {
			request(app)
				.post('/users/register')
				.send({username:'', email: 'user@emailcom', password: '123456' })
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(400);
					expect(body).toHaveProperty('message', ['Username is required']);
					done();
				});
		});
		it('Error Register with Status 401 - Email Cannot be Null', (done) => {
			request(app)
				.post('/users/register')
				.send({username:'user', email: '', password: '123456' })
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(400);
					expect(body).toHaveProperty('message', ['Email is required']);
					done();
				});
		});
		it('Error Register with Status 400 - Password Cannot be Null', (done) => {
			request(app)
				.post('/users/register')
				.send({ username:'user',email: 'user@emailcom', password: '' })
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Invalid Email or Password');
					done();
				});
		});
	});
});

describe('Login user POST /users/login', function() {
    describe('success login', function() {
        it('should send response 200 status code', function(done) {
            let body = {
                email: email,
                password: password
            }
            request(app)
                .post('/users/login')
                .send(body)
                .end((err, res) => {
                    const {status, body} = res
                    if(err) done(err);
                    expect(status).toBe(200)
					expect(typeof body).toEqual('object')
                    expect(body).toHaveProperty('acces_token')
					expect(typeof body.access_token).toEqual('string')
                    done();
                })
        })
    })
    // describe('Error login', function() {
    //     it('should send response 400 status code - invalid password', function(done) {
    //         let body = {
    //             email: email,
    //             password:'wrong password'
    //         }
    //         request(app)
    //             .post('/users/login')
    //             .send(body)
    //             .end(function (res, send) {
    //                 const {body, status} = res
    //                 if(err) done(err);

    //                 expect(status).toBe(400)
    //                 expect(body).toHaveProperty('message','Invalid Email or password')
    //                 done()
    //             })
    //     })
    //     it('should send response 400 status code - invalid email', function(done) {
    //         let body = {
    //             email: 'wrong email',
    //             password: password
    //         }
    //         request(app)
    //             .post('/users/login')
    //             .send(body)
    //             .end(function (res, send) {
    //                 const {body, status} = res
    //                 if(err) done(err);

    //                 expect(status).toBe(400)
    //                 expect(body).toHaveProperty('message','Invalid Email or password')
    //                 done()
    //             })
    //     })
    //     it('should send response 401 status code - error email or password cannot be null', function(done) {
    //         let body = {
    //             email: '',
    //             password: ''
    //         }
    //         request(app)
    //             .post('/users/login')
    //             .send(body)
    //             .end(function (res, send) {
    //                 const {body, status} = res
    //                 if(err) done(err);

    //                 expect(status).toBe(400)
    //                 expect(body).toHaveProperty('message','Email or Password is required')
    //                 done()
    //             })
    //     })
    // })
})
