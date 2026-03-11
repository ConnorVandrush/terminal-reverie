const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

class ServerManager 
{
    constructor()
    {
        this.app = express();
        this.io;
        this.expressServer;
        // define in host when time comes to deploy
        this.uri = "mongodb+srv://connorvandrush_db_user:Uhrj0QS9SM6itCLT@terminalreverie.uyq0cfb.mongodb.net/?appName=TerminalReverie";
    }

    connectToDatabase = async () =>
    {
        try
        {
            await mongoose.connect(this.uri);
            console.log("Connected to database");
        }
        catch (error)
        {
            console.error("Error connecting to database", error);
        }
    }

    serveStaticFiles = (dir) =>
    {
        this.app.use(express.static(path.join(__dirname, '../../', dir)));
    }

    startExpressListeners = (port) =>
    {
        this.expressServer = this.app.listen(port, '0.0.0.0', () =>
        {
            console.log(`Server is running on port ${port}`);
        });
    }

    startSocketIOListeners = () =>
    {
        this.io = socketio(this.expressServer,
        {
            cors: 
            {
                origin: "http://46.110.113.183:5173", // Vite dev URL
                methods: ["GET", "POST"],
                credentials: true
            },
        });

        this.publicNamespace = this.io.of('/login');

        this.publicNamespace.on('connection', (socket) =>
        {
            console.log('A user connected to login namespace');
            socket.on('disconnect', () =>
            {
                console.log('A user disconnected from login namespace');
            });
        });

        this.io.use(async (socket, next) =>
        {
            const token = socket.handshake.query.token;
            if (!token)
            {
                return next(new Error('Unauthorized'));
            }
            try
            {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.decoded = decoded;
                next();
            }
            catch (error)
            {
                return next(new Error('Invalid token'));
            }
        });

        this.io.on('connection', (socket) =>
        {
            console.log('A user connected to server');
            socket.on('disconnect', () =>
            {
                console.log('A user disconnected from server');
            });
        });
    }
}

module.exports = ServerManager;