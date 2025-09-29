# NMS Order Registration System

A modern web application for Norwegian Marine & Cargo Survey (NMCS) that replaces the old Access database with a modern system for order registration and ship surveys.

## Features

- **Order Registration**: Create and manage survey orders
- **Timelog**: Register activities and events during surveys
- **Sampling**: Manage sample taking and laboratory analyses
- **Remarks**: Predefined comments and templates
- **Email Integration**: Automatic order confirmations
- **Survey Types**: Manage different types of surveys
- **Modern UI**: Responsive design with Material-UI

## Technical Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **JWT** authentication
- **Nodemailer** for email functionality
- **Helmet** for security

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **Axios** for API calls
- **Day.js** for date handling

## Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd NMS
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Configure environment variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
DB_PATH=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=post@cargosurvey.com
```

### 5. Start the application

#### Simple start with demo data (recommended)
```bash
# Windows
start-demo.bat

# Linux/Mac
./start-demo.sh
```

#### Manual start
```bash
# Start backend
npm run dev

# In a new terminal, start frontend
cd client
npm start
```

#### Production mode
```bash
# Build frontend
npm run build

# Start backend (also serves frontend)
npm start
```

## Using the Application

### 1. First time
- Go to `http://localhost:3000`
- **Login with demo data (mock authentication):**
  - **Username:** `admin` **Password:** `admin123` (admin user)
  - **Username:** `surveyor1` **Password:** `admin123` (regular user)
  - **Username:** `surveyor2` **Password:** `admin123` (regular user)
  - **Note:** Any password with 3+ characters works for demo purposes
- The system uses mock authentication (no real backend authentication)

### 2. Main Features

#### Dashboard
- Overview of all orders
- Order status statistics
- Quick access to new orders

#### Order Registration
- Create new survey orders
- Fill in customer information, ship, port
- Select survey type
- Track order status

#### Timelog
- Register activities during surveys
- Predefined activities (auto-complete)
- Time stamping of events
- Notes and comments

#### Sampling
- Manage sample taking
- Track samples to laboratories
- Register seal numbers
- Document sample handling

#### Email Functionality
- Automatic order confirmations
- Custom email templates
- Integration with customer communication

## Database Structure

The application uses SQLite (in-memory for demo) with the following main tables:

- **users**: User administration
- **orders**: Order information
- **survey_types**: Types of surveys
- **timelog_entries**: Time registration
- **timelog_activities**: Predefined activities
- **remarks_templates**: Comment templates
- **sampling_records**: Sample taking registration

## Demo Data

The application comes with pre-filled demo data:

### Demo Users (Mock Authentication)
- **admin** (admin user) - Password: `admin123` (or any password with 3+ characters)
- **surveyor1** (regular user) - Password: `admin123` (or any password with 3+ characters)
- **surveyor2** (regular user) - Password: `admin123` (or any password with 3+ characters)

**Note:** The application uses mock authentication for demo purposes. No real backend authentication is implemented.

### Demo Orders
- 5 sample orders from Norwegian oil companies (Statoil, Equinor, Aker BP, etc.)
- Various survey types and statuses
- Realistic ship names and ports

### Demo Timelog
- Time registrations for active orders
- Predefined activities such as "Vessel berthed", "Surveyor on board", etc.

### Demo Sampling
- Sample taking registrations
- Laboratory analyses (Denofa, Eurofins)
- Seal numbers and sample handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Survey Types
- `GET /api/surveys/types` - Get all survey types
- `POST /api/surveys/types` - Create new survey type
- `PUT /api/surveys/types/:id` - Update survey type
- `DELETE /api/surveys/types/:id` - Delete survey type

### Timelog
- `GET /api/timelog/activities` - Get activities
- `GET /api/timelog/order/:orderId` - Get timelog for order
- `POST /api/timelog` - Create timelog entry

### Sampling
- `GET /api/sampling/order/:orderId` - Get sampling for order
- `POST /api/sampling` - Create sampling entry

### Email
- `POST /api/email/order-confirmation/:orderId` - Send order confirmation
- `POST /api/email/send` - Send custom email

## Security

- JWT-based authentication
- Rate limiting
- Helmet for security headers
- Input validation
- SQL injection protection

## Development

### Code Structure
```
NMS/
├── server.js              # Main server file
├── config/
│   └── database.js        # Database configuration
├── routes/                # API routes
├── middleware/            # Middleware functions
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Pages
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx        # Main app
└── package.json
```

### Development Commands
```bash
# Start backend in development mode
npm run dev

# Start frontend
cd client && npm start

# Build frontend for production
npm run build

# Run tests (if implemented)
npm test
```

## Deployment

### Heroku
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy with Git:
```bash
git push heroku main
```

### Docker (optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Database errors**: Check that SQLite file can be created
2. **Email errors**: Verify email configuration
3. **CORS errors**: Check that frontend runs on correct port
4. **Token errors**: Check JWT_SECRET in .env

### Logging
Backend logs to console. For production, consider implementing a proper logging solution.

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details.

## Contact

Norwegian Marine & Cargo Survey AS
Email: post@cargosurvey.com
Website: www.cargosurvey.no
