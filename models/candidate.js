'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Candidate.hasMany(models.Question);
    }
  };
  Candidate.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    province: DataTypes.STRING,
    vision: DataTypes.STRING,
    mission: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Candidate',
  });
  return Candidate;
};