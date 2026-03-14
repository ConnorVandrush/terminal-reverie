const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const PlayerAccount = require('./PlayerAccountModel.js');
const PlayerData = require('./PlayerData.js');

class ServerLoginManager
{
    constructor(publicNamespace, io, serverPlayerManager)
    {
        this.publicNamespace = publicNamespace;
        this.io = io;
        this.serverPlayerManager = serverPlayerManager;
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
            console.log('A user connected to login namespace');

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
                    
                    // FIXME - secret key should be stored in env variable
                    const userId = existingUser.userId;
                    const JWT = jwt.sign({ userId }, 'SECRET', { expiresIn: '30d' });
                    existingUser.JWT = JWT;
                    await existingUser.save();

                    const playerData = new PlayerData(existingUser.userId, existingUser.characterStats, existingUser.characterData, existingUser.location);
                    this.serverPlayerManager.playersOnline.set(socket.id, playerData);

                    return cb({ success: true, JWT });
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
                console.log('A user disconnected from login namespace');
            });
        });

        this.io.use(async (socket, next) =>
        {
            if (socket.nsp.name === "/login")
            {
                return next(); // allow login namespace
            }

            if (!this.serverPlayerManager.playersOnline.has(socket.id))
            {
                const JWT = socket.handshake.auth?.JWT;
                if (!JWT)
                {
                    return next(new Error('Unauthorized'));
                }

                try
                {
                    const decoded = jwt.verify(JWT, 'SECRET'); // FIXME - secret key should be stored in env variable
                    const userId = decoded.userId;
                    const existingUser = await PlayerAccount.findOne({ userId });
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

        this.io.on('connection', (socket) => 
        {
            console.log('A user connected to authenticated server');

            const decoded = jwt.verify(socket.handshake.auth.JWT, 'SECRET'); // FIXME - secret key should be stored in env variable
            const userId = decoded.userId;
            socket.userId = userId;

            if (this.serverPlayerManager.tokenTimeouts.has(userId))
            {
                clearTimeout(this.serverPlayerManager.tokenTimeouts.get(userId));
                this.serverPlayerManager.tokenTimeouts.delete(userId);
            }

            socket.on('disconnect', async () => 
            {
                console.log('A user disconnected from authenticated server');

                const userId = socket.userId;
                if (!userId) return;

                this.serverPlayerManager.playersOnline.delete(socket.id);

                const timeout = setTimeout(async () => 
                {
                    const existingUser = await PlayerAccount.findOne({ userId });
                    if (existingUser) 
                    {
                        existingUser.JWT = null;
                        await existingUser.save();
                        console.log(`Token for user ${userId} invalidated after disconnect grace period`);
                    }
                }, 3 * 60 * 1000);

                this.serverPlayerManager.tokenTimeouts.set(userId, timeout);
            });
        });
    }
}

module.exports = ServerLoginManager;