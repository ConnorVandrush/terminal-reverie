const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const PlayerAccount = require('./PlayerAccountModel.js');

class ServerLoginManager
{
    constructor(publicNamespace)
    {
        this.publicNamespace = publicNamespace;
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
            socket.on('clientLogin', (data, cb) =>
            {
                console.log('Login attempt:', data);
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
        });
    }
}

module.exports = ServerLoginManager;