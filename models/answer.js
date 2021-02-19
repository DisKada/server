'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Answer.belongsTo(models.User);
      Answer.belongsToMany(models.Question, { through: models.QuestionAnswer });
    }
  };
  Answer.init({
    answer: DataTypes.STRING,
    CandidateId: DataTypes.INTEGER,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};