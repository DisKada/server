// const request = require('supertest')
// const app = require('../app');
// const { sequelize } = require('../models');
// const { queryInterface } = sequelize;
// const { hashPassword } = require('../helpers/bcrypt');
// const { generateToken } = require('../helpers/jwt');

// let token;
// let dummyUserId;
// beforeAll((done) => {
// 	queryInterface
// 		.bulkInsert(
// 			'Users',
// 			[
// 				{
//                     username:'user',
// 					email: 'user@email.com',
// 					password: hashPassword('123456'),
// 					status: '',
//                     visi:'',
//                     misi:'',
//                     image:'',
// 					createdAt: new Date(),
// 					updatedAt: new Date(),
// 				},
// 			],
// 			{ returning: true }
// 		)
// 		.then((user) => {
// 			// console.log(user)
// 			UserId = user[0].id;
// 			const payload = {
// 				id: user[0].id,
//                 username: user[0].username,
// 				email: user[0].email,
// 				status: user[0].status,
//                 misi: user[0].misi,
//                 visi: user[0].visi,
//                 image: user[0].image,
// 			};
// 			token = generateToken(payload);
// 			// console.log(token_admin);
// 			done();
// 		})
// 		.catch((err) => {
// 			done(err);
// 		});

// 	queryInterface
// 		.bulkInsert(
// 			'Users',
// 			[
// 				{
// 					username:'user1',
// 					email: 'user1@email.com',
// 					password: hashPassword('123456'),
// 					status: 'virified',
//                     visi:'',
//                     misi:'',
//                     image:'',
// 					createdAt: new Date(),
// 					updatedAt: new Date(),
// 				},
// 			],
// 			{ returning: true }
// 		)
// 		.then((user) => {
// 			// console.log(user);
// 			const payload = {
// 				id: user[0].id,
//                 username: user[0].username,
// 				email: user[0].email,
// 				status: user[0].status,
//                 misi: user[0].misi,
//                 visi: user[0].visi,
//                 image: user[0].image,
// 			};
// 			token = generateToken(payload);
// 			// console.log(token_customer);
// 			done();
// 		})
// 		.catch((err) => {
// 			done(err);
// 		});

// 	});

// afterAll((done) => {
// 	queryInterface
// 		.bulkDelete('Users')
// 		.then((response) => {
// 			done();
// 		})
// 		.catch((err) => {
// 			done(err);
// 		});

// });



// describe('Fetch Users GET /users', () => {
// 	describe('Success Fetch Product', () => {
// 		it('Success response with Status 200 - returning list of the users', (done) => {
// 			request(app)
// 				.get('/users')
// 				.set('access_token', token)
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(200);
// 					expect(body[0]).toHaveProperty('username');
// 					expect(body[0]).toHaveProperty('email');
// 					done();
// 				});
// 		});
// 	});

// 	describe('Error Fetch Product', () => {
// 		it('Error response with Status 401 - No Access Token', (done) => {
// 			request(app)
// 				.get('/users')
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(401);
// 					expect(body).toHaveProperty('message', 'Please Login First');
// 					done();
// 				});
// 		});
// 		it('Error response with Status 401 - Invalid Access Token', (done) => {
// 			request(app)
// 				.get('/users')
// 				.set('access_token', 'some wrong token')
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(401);
// 					expect(body).toHaveProperty('message', 'Invalid Email or password');
// 					done();
// 				});
// 		});
// 	});
// });

// describe('Get User by Id GET /users/:id', () => {
// 	describe('Success Get User by Id', () => {
// 		it('Success response with Status 200 - returning the detail of the dummy user', (done) => {
// 			request(app)
// 				.get(`/user/${dummyUserId}`)
// 				.set('access_token', token)
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(200);
// 					expect(body.username).toBe('User Dummy');
// 					done();
// 				});
// 		});
// 	});
// 	describe('Error Get User by Id', () => {
// 		it('Error response with Status 401 - No Access Token', (done) => {
// 			request(app)
// 				.get(`/products/${dummyUserId}`)
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(401);
// 					expect(body).toHaveProperty('message', 'Please Login First');
// 					done();
// 				});
// 		});
// 		it('Error response with Status 401 - Invalid Access Token', (done) => {
// 			request(app)
// 				.get(`/products/${dummyUserId}`)
// 				.set('access_token', 'some wrong token')
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(401);
// 					expect(body).toHaveProperty('message', 'Invalid Email or password');
// 					done();
// 				});
// 		});
// 		it('Error response with Status 404 - User Not Found', (done) => {
// 			request(app)
// 				.get(`/users/0`)
// 				.set('access_token', token)
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(404);
// 					expect(body).toHaveProperty('message', 'User Not Found');
// 					done();
// 				});
// 		});
// 	});
    
// });

// describe('Edit User PUT /users/:id', () => {
// 	describe('Success Edit User', () => {
// 		it('Success Response after Editing with Status 200 - returning value of the edited user', (done) => {
// 			request(app)
// 				.put(`/users/${dummyUserId}`)
// 				.set('access_token', token)
// 				.send({
// 					visi: 'visi saya',
// 					misi: 'visi saya',
// 					image: 'image saya',
// 				})
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(200);
// 					expect(body).toHaveProperty('visi', 'visi saya');
// 					done();
// 				});
// 		});
// 	});
// 	describe('Error Edit User', () => {
// 		it('Error response while Editing with Status 404 - User Id Not Found', (done) => {
// 			request(app)
// 				.put(`/users/0`)
// 				.set('access_token', token)
// 				.send({					
// 					visi: 'visi saya',
// 					misi: 'visi saya',
// 					image: 'image saya',
// 				})
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(404);
// 					expect(body).toHaveProperty('message', 'User Not Found');
// 					done();
// 				});
// 		});
// 		it('Error response while Editing with Status 401 - No Access Token', (done) => {
// 			request(app)
// 				.put(`/users/${dummyUserId}`)
// 				.send({
// 					visi: 'visi saya',
// 					misi: 'visi saya',
// 					image: 'image saya',
// 				})
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(401);
// 					expect(body).toHaveProperty('message', 'Please Login First');
// 					done();
// 				});
// 		});
// 		it('Error response while Editing with Status 401 - Wrong Access Token', (done) => {
// 			request(app)
// 				.put(`/users/${dummyUserId}`)
// 				.set('access_token', 'wrong access token')
// 				.send({
// 					visi: 'visi saya',
// 					misi: 'visi saya',
// 					image: 'image saya',
// 				})
// 				.end((err, res) => {
// 					const { body, status } = res;
// 					if (err) {
// 						return done(err);
// 					}
// 					expect(status).toBe(401);
// 					expect(body).toHaveProperty('message', 'Invalid Email or password');
// 					done();
// 				});
// 		});
// 	});
// });
