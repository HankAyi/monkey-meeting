const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// peerjs --port 9000 --key peerjs --path /zoom-clone

const cors = require('cors')
app.use(cors())

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, { debug: true});
const { v4: uuidV4 } = require('uuid')
routes = require('./routes/routes')
app.use('/peerjs', peerServer);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())


// DB CONNECTION
const mongoose = require("mongoose");
// const { MongoClient } = require("mongodb");
mongoose.set('strictQuery', false);
const dotenv = require("dotenv")
dotenv.config();

mongoose.connect(process.env.uri).then(console.log("db connected")).catch((err)=>{console.log("db :",err)})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', routes.home);
app.get('/createmeeting', routes.createmeeting);
app.get('/joinmeeting', routes.joinmeeting);
app.post('/meeting/postcreatemeeting', routes.postcreatemeeting);
app.post('/meeting/postjoinmeeting', routes.postjoinmeeting);
app.post('/meeting/deletemeeting', routes.deletemeeting);



app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/meeting/:room/:name', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
app.get('/room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})




io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3000)
