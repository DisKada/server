'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  room.init({
    name: {
      type :DataTypes.STRING,
      unique: true
    },
    players: {
      type : DataTypes.JSON,
      validate : {
        isLessThanFour(value){
          if(Object.keys(value).length > 40) {
            throw new Error('Maximum player is 40')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'room',
  });
  return room;
};