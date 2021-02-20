const request = require('supertest')
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const {User} = require('../models/')
const { hashPassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

let dummyUserId;
beforeAll((done) => {
	queryInterface
		.bulkInsert(
			'Users',
			[
				{
                    username:'user',
					email: 'user@email.com',
					password: hashPassword('123456'),
					status: '',
                    visi:'',
                    misi:'',
                    image:'',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{ returning: true }
		)
		.then((user) => {
            dummyUserId = user[0].id,
			done();
		})
		.catch((err) => {
			done(err);
		});

	queryInterface
		.bulkInsert(
			'Users',
			[
				{
					username:'user1',
					email: 'user1@email.com',
					password: hashPassword('123456'),
					status: 'virified',
                    visi:'',
                    misi:'',
                    image:'',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{ returning: true }
		)
		.then((user) => {
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



describe('Fetch Users GET /users', () => {
    let access_token
    beforeAll((done)=>{
       User.findOne({where: {email: 'user@email.com'}})
       .then(data =>{
           let payload = {
               id: data.id,
               username: data.username,
               email: data.email,
               password:data.password,
               status:data.status,
               visi:data.visi,
               misi:data.misi,
               image:data.imag
           }
           access_token = generateToken(payload)
           done()
       })
    })

	describe('Success Fetch user', () => {
		it('Success response with Status 200 - returning list of the users', (done) => {
			request(app)
				.get('/users/')
				.set('access_token', `${access_token}`)
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(200);
                    expect(typeof body).toEqual('object')
                    if(body.lentgh > 0){
                        body.map(product =>{
                            expect(product).toHaveProperty('id')
                            expect(product).toHaveProperty('username')
                            expect(product).toHaveProperty('email')
                            expect(product).toHaveProperty('visi')
                            expect(product).toHaveProperty('misi')
                        })
                    }
					done();
				});
		});
	});

	describe('Error Fetch Product', () => {
		it('Error response with Status 401 - No Access Token', (done) => {
			request(app)
				.get('/users')
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Please Login First');
					done();
				});
		});
		it('Error response with Status 401 - Invalid Access Token', (done) => {
			request(app)
				.get('/users')
				.set('access_token', 'some wrong token')
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Invalid Email Or Password');
					done();
				});
		});
	});
});

describe('Get User by Id GET /users/:id', () => {
    let access_token
    let UserId
    beforeAll((done)=>{
       User.findOne({where: {id: dummyUserId}})
       .then(data =>{
           UserId = data.id
           let payload = {
               id: data.id,
               username: data.username,
               email: data.email,
               password:data.password,
               status:data.status,
               visi:data.visi,
               misi:data.misi,  
               image:data.image
           }
           access_token = generateToken(payload)
           //models.sequelize.close()
           done()
       })
    })

	describe('Success Get User by Id', () => {
		it('Success response with Status 200 - returning the detail of the dummy user', (done) => {
			request(app)
				.get(`/users/${UserId}`)
				.set('access_token', `${access_token}`)
				.end((err, res) => {
					const { body, status } = res;
                    console.log(status)
					if (err) {
						return done(err);
					}
					expect(status).toBe(200);
            
					done();
				});
		});
	});
	describe('Error Get User by Id', () => {
		it('Error response with Status 401 - No Access Token', (done) => {
			request(app)
				.get(`/users/${UserId}`)
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Please Login First');
					done();
				});
		});
		it('Error response with Status 401 - Invalid Access Token', (done) => {
			request(app)
				.get(`/users/${UserId}`)
				.set('access_token', 'some wrong token')
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Invalid Email Or Password');
					done();
				});
		});
		it('Error response with Status 404 - User Not Found', (done) => {
			request(app)
				.get(`/users/0`)
				.set('access_token', `${access_token}`)
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(404);
					expect(body).toHaveProperty('message', 'User Not Found');
					done();
				});
		});
	});
    
});

describe('Edit User PUT /users/:id', () => {
    let access_token
    let UserId
    beforeAll((done)=>{
       User.findOne({where: {id: dummyUserId}})
       .then(data =>{
           UserId = data.id
           let payload = {
               id: data.id,
               username: data.username,
               email: data.email,
               password:data.password,
               status:data.status,
               visi:data.visi,
               misi:data.misi,  
               image:data.image
           }
           access_token = generateToken(payload)
           //models.sequelize.close()
           done()
       })
    })
	describe('Success Edit User', () => {
		it('Success Response after Editing with Status 200 - returning value of the edited user', (done) => {
			request(app)
				.put(`/users/${UserId}`)
				.set('access_token', `${access_token}`)
				.send({
					visi: 'visi saya',
					misi: 'visi saya',
					image: 'image saya',
				})
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(200);
					expect(body).toHaveProperty('message', 'User Edited');
					done();
				});
		});
	});
	describe('Error Edit User', () => {
		it('Error response while Editing with Status 404 - User Id Not Found', (done) => {
			request(app)
				.put(`/users/0`)
				.set('access_token', `${access_token}`)
				.send({					
					visi: 'visi saya',
					misi: 'visi saya',
					image: 'image saya',
				})
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(404);
					expect(body).toHaveProperty('message', 'User Not Found');
					done();
				});
		});
		it('Error response while Editing with Status 401 - No Access Token', (done) => {
			request(app)
				.put(`/users/${dummyUserId}`)
				.send({
					visi: 'visi saya',
					misi: 'visi saya',
					image: 'image saya',
				})
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Please Login First');
					done();
				});
		});
		it('Error response while Editing with Status 401 - Wrong Access Token', (done) => {
			request(app)
				.put(`/users/${dummyUserId}`)
				.set('access_token', 'wrong access token')
				.send({
					visi: 'visi saya',
					misi: 'visi saya',
					image: 'image saya',
				})
				.end((err, res) => {
					const { body, status } = res;
					if (err) {
						return done(err);
					}
					expect(status).toBe(401);
					expect(body).toHaveProperty('message', 'Invalid Email Or Password');
					done();
				});
		});
	});
});
