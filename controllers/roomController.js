const { room } = require("../models")
class RoomController {
    static create(roomData, callback){
      let newRoom = {
        name : roomData.name,
        players : {
          ["1-" + roomData.creator] : 0,
        }
      }
      room.create(newRoom)
      .then(createdRoom => {   
        callback(null, createdRoom.dataValues) 
      })
      .catch(err => {
        callback(err)
      })
  
    }
  
    static join(payload, callback){
        room.findOne({
            where : {
              name :payload.roomName
            }
          })
          .then(result => {
              let index = Object.keys(result.players).length
              let playerKey = `${index+1}-${payload.playerName}`
              result.players[playerKey] = 0
              result.changed("players", true)
            callback(null, {...result.dataValues, playerKey})
            })
          .catch(err => {  
            callback(err)
          })
    }
    static findAll(callback){
      room.findAll({
        order: [
          ['id', 'ASC'],
        ],
      })
      .then(results => {
        callback(null, results)
      })
      .catch(err => {
        callback(err)
      }) 
    }
    static delete(roomName, callback){
      room.destroy({
        where : {
          name : roomName
        }
      })
      .then(result => {
        callback(null)
      })
      .catch(err => {
        console.log(err)
      })
    }
  
    static leave(payload, callback){
      room.findOne({
        where : {
          name : payload.roomName
        }
      })
      .then(result => {
        if(result){
          delete result.players[payload.playerKey];
          result.changed("players", true)
          return result.save()
        } 
      })
      .then(result => {
        callback(null, result.dataValues)
      })
      .catch(err => {
        callback(err)
      })
    }
  }
  
  module.exports = RoomController