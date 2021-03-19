require('./db/dbConnection');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
// create an http server and takes express as parameter
const server = http.createServer(app);
// socket.io wants an http server as parameter so express can support web sockets
const io = socketio(server);

const { PORT } = require('./config');

// Router
const userRouter = require('./routers/user');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(userRouter);

// Sockets
io.on('connection', (socket) => {
    console.log("NEW CONNECTION");

    socket.on('join', ({ username, room }, callback) => {
        // addUser() returns the user or an error
        const { error, user } = addUser({ id: socket.id, username, room });

        if(error) {
            // In case of error, it returns the callback() to interrupt the code execution
            return callback(error);
        }
        // This piece of code (from here to callback()) is executed if addUser() returns a user
        socket.join(user.room); // the user join the room

        // generateMessage() sends the welcome message to the user
        socket.emit('message', generateMessage('Server', 'Welcome ' + user.username));
        // With broadcast, we send the message to all the users
        socket.broadcast.to(user.room).emit('message', generateMessage('Server', user.username + ' connected'));

        // Obtain the room data
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        // If we are here, everything was fine and we call the callback() without the error
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        // Check if the user was in the room
        if(user) {
            io.to(user.room).emit('message', generateMessage('Server', user.username + " disconnected"));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        console.log("USER DISCONNECTED");
    })
})
server.listen(PORT, () => console.log("Server is running on port:", PORT));