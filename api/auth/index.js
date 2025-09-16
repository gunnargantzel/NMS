const { app } = require('@azure/functions');
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

app.http('auth', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Auth function processed a request.');

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return {
        status: 200,
        headers,
        body: ''
      };
    }

    try {
      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action') || 'login';

      if (request.method === 'GET' && action === 'verify') {
        const authHeader = request.headers.get('authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
          return {
            status: 401,
            headers,
            body: JSON.stringify({ message: 'No token provided' })
          };
        }

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
          return {
            status: 200,
            headers,
            body: JSON.stringify({ valid: true, user: decoded })
          };
        } catch (error) {
          return {
            status: 401,
            headers,
            body: JSON.stringify({ message: 'Invalid token' })
          };
        }
      }

      if (request.method === 'POST' && action === 'login') {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
          return {
            status: 400,
            headers,
            body: JSON.stringify({ message: 'Username and password are required' })
          };
        }

        const user = users.find(u => u.username === username);
        if (!user) {
          return {
            status: 400,
            headers,
            body: JSON.stringify({ message: 'Invalid credentials' })
          };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return {
            status: 400,
            headers,
            body: JSON.stringify({ message: 'Invalid credentials' })
          };
        }

        const token = jwt.sign(
          { userId: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '24h' }
        );

        return {
          status: 200,
          headers,
          body: JSON.stringify({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            }
          })
        };
      }

      return {
        status: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };

    } catch (error) {
      context.log.error('Error:', error);
      return {
        status: 500,
        headers,
        body: JSON.stringify({ message: 'Internal server error' })
      };
    }
  }
});
