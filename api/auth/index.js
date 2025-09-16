const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Demo users
const users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@cargosurvey.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', // admin123
        role: 'admin'
    },
    {
        id: 2,
        username: 'surveyor1',
        email: 'surveyor1@cargosurvey.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', // admin123
        role: 'user'
    },
    {
        id: 3,
        username: 'surveyor2',
        email: 'surveyor2@cargosurvey.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', // admin123
        role: 'user'
    }
];

module.exports = async function (context, req) {
    context.log('Auth function processed a request.');

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers,
            body: ''
        };
        return;
    }

    try {
        // Handle different routes based on URL path
        const url = new URL(req.url, `https://${req.headers.host}`);
        const pathname = url.pathname;
        const isVerify = pathname.includes('verify');
        const isLogin = pathname.includes('login') || req.method === 'POST';

        if (req.method === 'GET' && isVerify) {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                context.res = {
                    status: 401,
                    headers,
                    body: { message: 'No token provided' }
                };
                return;
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
                context.res = {
                    status: 200,
                    headers,
                    body: { valid: true, user: decoded }
                };
                return;
            } catch (error) {
                context.res = {
                    status: 401,
                    headers,
                    body: { message: 'Invalid token' }
                };
                return;
            }
        }

        if (req.method === 'POST' && isLogin) {
            const { username, password } = req.body;

            if (!username || !password) {
                context.res = {
                    status: 400,
                    headers,
                    body: { message: 'Username and password are required' }
                };
                return;
            }

            const user = users.find(u => u.username === username);
            if (!user) {
                context.res = {
                    status: 400,
                    headers,
                    body: { message: 'Invalid credentials' }
                };
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                context.res = {
                    status: 400,
                    headers,
                    body: { message: 'Invalid credentials' }
                };
                return;
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );

            context.res = {
                status: 200,
                headers,
                body: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                }
            };
            return;
        }

        context.res = {
            status: 405,
            headers,
            body: { message: 'Method not allowed' }
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers,
            body: { message: 'Internal server error' }
        };
    }
};