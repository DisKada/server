const express = require('express')
const router = express.Router()
const {authenticate} = require('../middlewares/auth')
const {UserController} = require('../controllers/userController')

router.post('/login',UserController.login)
router.post('/register',UserController.register)
router.use(authenticate)
router.get('/',UserController.getList)
router.get('/:id',UserController.getUserById)
router.put('/:id',UserController.editUser)

module.exports = router