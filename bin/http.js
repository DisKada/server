const app = require("../app.js");
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use('/peerjs', peerServer);
let counter = 0
const RoomController = require("../controllers/roomController")
io.on('connection', function(socket){
  console.log(`connect with socket`)

  socket.on('newMessage', payload => {
    console.log(payload, 'darii on server')
    let msg = {
      username: payload.username,
      text: payload.message
    }
    io.in(`${payload.room}`).emit('msgServer', msg)
  })
  
  socket.on('create-room', function(roomData, id){
    RoomController.create(roomData, function(err, createdRoom){
      if(err) {
        socket.emit('showError', 'Failed to create room')
      } else {
        counter++
        io.emit('counter', counter)
        io.emit('maxPlayer', roomData.max)
        io.emit('roomCreated', createdRoom) 
        socket.join(createdRoom.name) 
        socket.broadcast.emit('userConnected', id);
        socket.emit('getIntoRoom', {...createdRoom, playerKey: `1-${roomData.creator}`, isCreator : true})
      }
    })
  })

  socket.on("join-room", function(payload, id){
    console.log(payload)
    RoomController.join(payload, function(err, result){
      console.log(result,'<<<ini dari result join')
      if (err){
        socket.emit('showError', 'Failed to join '+ payload.roomName )
      } else  {
        counter++
        io.emit('counter', counter)
        socket.join(payload.roomName) 
        // io.to(payload.roomName).broadcast.emit('players', payload.players)
        socket.broadcast.emit('userConnected', id);
        console.log(id,'ini mau ke emit')
        socket.emit('getIntoRoom', result) 
        socket.on('disconnect', () => {
          socket.to(payload.roomName).broadcast.emit('userDisconnected', id)
        })
        RoomController.findAll(function(err, results){
          io.emit('updateClientRoom',results) 
        })
      }
    })
  })

  socket.on('get-rooms', function(){
    RoomController.findAll(function(err, results){
      if(err){
        socket.emit('showError', "Failed to get room data")
      } else {
        socket.emit("getRooms", results) //trigger client untuk menampilkan rooms
      }
    })
  })

  // ====== BAGIAN Metting ========

  socket.on('leave-room', function(payload){
    // console.log(payload,'----ini dari client')
    counter--
    io.emit('counter', counter)
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
        RoomController.findAll(function(err, results){
          io.emit('updateClientRoom',results) //trigger semua client agar update rooms nya
        })
      }
    })
    counter = 0
    io.emit('counter', counter)
    socket.broadcast.to(roomName).emit('endRoom') //trigger room untuk menghentikan permainan
  })
})

const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});