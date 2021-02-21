const app = require("../app.js");
const server = require('http').createServer(app);
const RoomController = require("../controllers/roomController")
var io = require('socket.io')(server);
const roomId = "iniroom"
// console.log(io)
io.on('connection', function(socket){
  // console.log(socket.id);
  socket.on('create-room', function(roomData){
    RoomController.create(roomData, function(err, createdRoom){
      if(err) {
        socket.emit('showError', 'Failed to create room')
      } else {
        io.emit('roomCreated', createdRoom) //send room to all client
        socket.join(createdRoom.name) //daftarin creator room ke room yang dia bikin
        socket.emit('getIntoRoom', {...createdRoom, playerKey: `1-${roomData.creator}`, isCreator : true}) //trigger creator untuk masuuk ker roomnya
      }
      
    })
  })

  socket.on("join-room", function(payload){
    // console.log(payload)
    RoomController.join(payload, function(err, result){
      if (err){
        socket.emit('showError', 'Failed to join '+ payload.roomName )
      } else  {
        socket.join(payload.roomName) //daftarin player ke room yang dia mau join
        io.to(payload.roomName).emit('player-joined', result.players) // kabarin ke anggota room lain kalo ada yang join
        // console.log(result,'ini mau ke emit')
        socket.emit('getIntoRoom', result) //nyuruh yang join untuk masuk ke room
        RoomController.findAll(function(err, results){
          io.emit('updateClientRoom',results) //trigger semua client agar update rooms nya
        })
      }
       
    })
  })

  socket.on('get-rooms', function(){
    RoomController.findAll(function(err, results){
      // console.log(results,'ini result dari get room')
      if(err){
        socket.emit('showError', "Failed to get room data")
      } else {
        // console.log(results,'<<<<')
        socket.emit("getRooms", results) //trigger client untuk menampilkan rooms
      }
    })
  })

  // ====== BAGIAN Metting ========

  socket.on('leave-room', function(payload){
    console.log(payload,'----ini dari client')
    socket.leave(payload.roomName)
    RoomController.leave(payload, function(err, result){
      console.log(result,'---ini dari database')
      io.to(payload.roomName).emit('player-left', result.players) // kabarin ke anggota room lain kalo ada yang leave
      io.emit('update-client-room')
    })
  })
  socket.on('end-room', function(roomName){
    RoomController.delete(roomName, function(err){
      if(!err){
        io.emit('update-client-room') //trigger semua client agar update rooms nya
      }
    })
    socket.broadcast.to(roomName).emit('endRoom') //trigger room untuk menghentikan permainan
  })
})
const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});