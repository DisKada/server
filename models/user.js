'use strict';
const {
  Model
} = require('sequelize');
const {hashPassword} = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { args: true, msg:'Username is required'},
        notEmpty: { args: true, msg: 'Username is required'}
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { args: true, msg:'Email is required'},
        notEmpty: { args: true, msg: 'Email is required'}
      },
      unique:true
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { args: true, msg:'Passwrod is required'},
        notEmpty: { args: true, msg: 'Password is required'},
        min: { args:[6], msg: 'Password atleast 6 characters'}
      }
    },
    status: DataTypes.STRING,
    visi: DataTypes.TEXT,
    misi: DataTypes.TEXT,
    image: DataTypes.STRING,
    partai: DataTypes.STRING,
    pekerjaan: DataTypes.STRING,
    pendidikan: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATEONLY,
    calon: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.password = hashPassword(instance.password);
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};