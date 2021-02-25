const { User } = require('../models')
const {generateToken} = require('../helpers/jwt')
const {comparePassword} = require('../helpers/bcrypt');
class UserController {
    static async login(req, res, next) {
        const {email, password } = req.body;
        if( !email || !password ) {
            return next({ name: 'EmailOrPasswordCannotBeNull'});
        }
        try {
            const user = await User.findOne( { where : { email } } );
            if ( !user ) {
                return next( { name: 'InvalidEmailOrPassword' } );
            } else {
                const match = comparePassword ( password, user.password );
                if ( match ) {
                    const payload = {
                        id: user.id,
                        email: user.email,
                    }
                    const access_token = generateToken ( payload );
                    res.status(200).json({access_token, username: user.username, id: user.id});
                } else {

                    return next( { name: 'InvalidEmailOrPassword'} );
                }
            }
        } catch ( err ) {
            return next(err);
        }
    }
    static async register (req, res, next) {
        const { username, email, password } = req.body;
        if (!username, !email, !password ) {
            return next ( { name: 'InvalidEmailOrPassword' } );
        }
        try {
            const user = await User.create( {username, email, password} );
            const response = { id: user.id,username: user.username, email: user.email}
            return res.status( 201 ).json( response )
        } catch ( err ) {
            next( err )
        }
    }
    static async getList (req, res, next) {
        try {
            const list = await User.findAll({where: {status: 'verified'}, attributes: { exclude: ['password'] } })
            res.status(200).json(list)
        } catch (err) {
            next(err) 
        }
    }
    static async getUserById (req, res, next) {
        const {id} = req.params
        try {
            const list = await User.findOne({where : {id}, attributes: { exclude: ['password'] } })
            if (!list) {
                next ({name : 'UserNotFound'})
            } else {
                res.status(200).json(list)                
            }
        } catch (err) {
            next(err)
        }
    }
    static async editUser (req, res, next) {
        const { id } = req.params;
        const { visi,misi,image,partai,pekerjaan,pendidikan,username,calon, status,tempat_lahir,tanggal_lahir } = req.body;
        const editUser = {
            username,
            status,
            visi,
            misi,
            image,
            partai,
            pekerjaan,
            pendidikan,
            calon,
            tempat_lahir,
            tanggal_lahir
        }
        try {
            const user = await User.findOne( { where: { id } } )
            if (!user) {
                next ( { name: 'UserNotFound' } )
            } else {
                try {
                    const userData = await User.update(editUser, { where: { id }})
                    return res.status(200).json({message : 'User Edited'});
                } catch (err) {                    
                    next (err);
                }
            }
        } catch (err) {
            next (err)
        }
    }
}

module.exports = {UserController}