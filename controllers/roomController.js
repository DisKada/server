const { room } = require("../models")
class RoomController {
    static create(roomData, callback){
  
      let newRoom = {
        name : roomData.name,
        players : {
          ["1-" + roomData.creator] : 0
        }
      }
  
      room.create(newRoom)
      .then(createdRoom => {   
        callback(null, createdRoom.dataValues) //bawa infomasi room yang baru saja dibuat
      })
      .catch(err => {
        console.log(err)
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
            console.log(result.dataValues,'ini sebelumm')
              let index = Object.keys(result.players).length //hitung jumlah pemain dalam room untuk indexing player
              let playerKey = `${index+1}-${payload.playerName}`
              result.players[playerKey] = 0
              result.changed("players", true)
              console.log(result.dataValues,'sesudah change')
            //   console.log(result.dataValues,'ini result')
            //   return Promise.all([result.save(), playerKey])
            callback(null, {...result.dataValues, playerKey}) //jika berhasil, bawa data room yang telah terupdate dengan pemain baru agar dapat diambil oleh listener job nya
            })
        //     .then(([result, playerKey]) => {
        //   })
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
        console.log("Success delete room")
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