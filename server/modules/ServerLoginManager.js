const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const PlayerAccount = require('./PlayerAccountModel.js');
const PlayerData = require('./PlayerData.js');

class ServerLoginManager
{
    constructor(publicNamespace, io, serverPlayerManager, serverMapManager, serverPartyManager)
    {
        this.publicNamespace = publicNamespace;
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
        this.serverMapManager = serverMapManager;
        this.serverPartyManager = serverPartyManager;
        this.tokenTimeouts = new Map(); // playerId -> timeoutId for token invalidation after disconnect
    }

    isValidEmail = (email) => 
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword = (password) => 
    {
        return password.length >= 8;
    }

    startListeners()
    {
        this.publicNamespace.on('connection', (socket) =>
        {

            socket.on('clientLogin', async ({ email, password }, cb) =>
            {
                try
                {
                    const existingUser = await PlayerAccount.findOne({ email });
                    if (!existingUser) 
                    {
                        return cb({ error: 'Invalid email or password' });
                    }

                    const isMatch = await argon2.verify(existingUser.password, password);
                    if (!isMatch) 
                    {
                        return cb({ error: 'Invalid email or password' });
                    }
                    
                    const playerId = existingUser.playerId;
                    const JWT = jwt.sign({ playerId }, process.env.JWT_SECRET, { expiresIn: '30d' });
                    existingUser.JWT = JWT;
                    await existingUser.save();

                    if (existingUser.isDead)
                    {
                        const response = await socket.emitWithAck('serverCreateCharacter', {});
                        if (response.error)
                        {
                            return cb({ error: 'An error occurred during character creation' });
                        }

                        existingUser.characterData.playerId = playerId;
                        existingUser.characterData.name = response.name;
                        existingUser.characterData.appearance = response.appearance;
                        existingUser.characterData.location.x = 128;
                        existingUser.characterData.location.y = 128;
                        existingUser.characterData.location.d = 2;
                        existingUser.characterData.location.map = 'Town1';
                        existingUser.characterData.isDead = false;
                        existingUser.isDead = false;
                        existingUser.markModified('characterData');
                        await existingUser.save();
                    }

                    const mapData = this.serverMapManager.maps.get(existingUser.characterData.location.map);
                    let playersOnMap = [];
                    if (this.serverPlayerManager.playersOnMaps.has(existingUser.characterData.location.map))
                    {
                        playersOnMap = Array.from(this.serverPlayerManager.playersOnMaps.get(existingUser.characterData.location.map)?.entries()) || [];
                    }
                    this.serverPlayerManager.socketIdToSocket.set(socket.id, socket);
                    this.serverPlayerManager.characterNameToId.set(existingUser.characterData.name, playerId);
                    return cb({ success: true, JWT, characterData: existingUser.characterData, mapData, playersOnMap });
                }
                catch (error)
                {
                    console.error('Login error:', error);
                    return cb({ error: 'An error occurred during login' });
                }
            });

            socket.on('clientRegister', async ({ email, password }, cb) =>
            {
                try
                {
                    if (!this.isValidEmail(email)) 
                    {
                        return cb({ error: 'Invalid email format' });
                    }

                    if (!this.isValidPassword(password)) 
                    {
                        return cb({ error: 'Password must be at least 8 characters long' });
                    }

                    const existingUser = await PlayerAccount.findOne({ email });
                    if (existingUser) 
                    {
                        return cb({ error: 'Email already in use' });
                    }

                    const hashedPassword = await argon2.hash(password);

                    const newUser = new PlayerAccount({ email, password: hashedPassword });
                    await newUser.save();

                    return cb({ success: true, message: 'Registration successful' });
                } 
                catch (error) 
                {
                    return cb({ error: 'An error occurred during registration' });
                }
            });

            socket.on('disconnect', () =>
            {
            });
        });

        this.io.use(async (socket, next) =>
        {
            if (socket.nsp.name === "/login")
            {
                return next(); // allow login namespace
            }

            if (!this.serverPlayerManager.playersOnline.has(socket.playerId))
            {
                const JWT = socket.handshake.auth?.JWT;
                if (!JWT)
                {
                    return next(new Error('Unauthorized'));
                }

                try
                {
                    const decoded = jwt.verify(JWT, process.env.JWT_SECRET);
                    const playerId = decoded.playerId;
                    const existingUser = await PlayerAccount.findOne({ playerId });
                    if (!existingUser || existingUser.JWT !== JWT) 
                    {
                        return next(new Error('Unauthorized'));
                    }
                    next();
                }
                catch (error)
                {
                    return next(new Error('Invalid token'));
                }
            }
        });

        this.io.on('connection', async (socket) => 
        {

            const decoded = jwt.verify(socket.handshake.auth.JWT, process.env.JWT_SECRET);
            const playerId = decoded.playerId;

            if (!this.serverPlayerManager.playersOnline.has(playerId))
            {
                socket.playerId = playerId;
                const existingUser = await PlayerAccount.findOne({ playerId });
                const playerData = new PlayerData(existingUser.characterData);
                playerData.socketId = socket.id;
                this.serverPlayerManager.playersOnline.set(playerId, playerData);
                this.serverPlayerManager.playerJoinMap(socket, playerId, existingUser.characterData.location.map);
            }

            if (this.tokenTimeouts.has(playerId))
            {
                clearTimeout(this.tokenTimeouts.get(playerId));
                this.tokenTimeouts.delete(playerId);
            }

            socket.on('disconnect', async () => 
            {

                const playerId = socket.playerId;
                if (!playerId) return;
                const playerData = this.serverPlayerManager.playersOnline.get(playerId);
                if (!playerData) return;
                const characterData = playerData.characterData;
                if (this.serverPartyManager.playerParties.has(playerId)) // FIXME remove after testing
                {
                    this.serverPartyManager.playerParties.delete(playerId);
                }
                this.serverPlayerManager.playerLeftMap(socket, playerId, characterData?.location.map); // FIXME remove after testing
                this.serverPlayerManager.playersOnline.delete(playerId); // FIXME remove after testing

                const timeout = setTimeout(async () => 
                {
                    const existingUser = await PlayerAccount.findOne({ playerId });
                    if (existingUser) 
                    {
                        existingUser.JWT = null;
                        await existingUser.save();
                        this.serverPlayerManager.playersOnline.delete(playerId);
                    }
                }, 3 * 60 * 1000);

                this.tokenTimeouts.set(playerId, timeout);
            });
        });
    }
}

module.exports = ServerLoginManager;