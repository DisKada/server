'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  QuestionAnswer.init({
    QuestionId: DataTypes.INTEGER,
    AnswerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionAnswer',
  });
  return QuestionAnswer;
};