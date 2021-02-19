const bcrypt = require('bcryptjs')
function hashPassword(plainPassword) {
    const salt = bcrypt.genSaltSync(5)
    const hash = bcrypt.hashSync(plainPassword, salt)
    return hash
}

function comparePassword (plainPassword,dbPassword) {
 return bcrypt.compareSync(plainPassword,dbPassword)
}
module.exports = {hashPassword, comparePassword}