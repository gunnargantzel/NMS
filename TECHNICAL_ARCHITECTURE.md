# NMS - Technical Architecture Documentation

## System Overview
The NMS (Order Management System) is a modern web application built with React and TypeScript, designed to manage hierarchical orders for maritime cargo surveys. The system supports multi-port operations where a single order can span multiple harbors, each with specific order lines and tracking.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Routing**: React Router v6
- **Styling**: CSS Variables + Material-UI theming
- **Build Tool**: Create React App
- **Package Manager**: npm

### Backend (Current - Mock)
- **API**: Mock API service (client-side)
- **Data Storage**: In-memory JavaScript objects
- **Authentication**: Mock authentication system

### Future Backend (Planned)
- **Database**: Microsoft DataVerse
- **Authentication**: Microsoft Entra ID (Azure AD)
- **API**: Power Platform APIs / Custom APIs
- **Hosting**: Azure Static Web Apps + Azure Functions

## Application Architecture

### Component Structure
```
src/
├── components/
│   ├── Layout.tsx              # Main application layout
│   ├── ProtectedRoute.tsx      # Authentication guard
│   ├── SplashScreen.tsx        # Loading screen
│   └── AuthProvider.tsx        # Authentication context
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Dashboard.tsx           # Main dashboard
│   ├── Orders.tsx              # Orders listing
│   ├── OrderDetail.tsx         # Order details view
│   ├── OrderForm.tsx           # Order creation/editing
│   └── SurveyTypes.tsx         # Survey types management
├── services/
│   └── mockApi.ts              # Mock API service
├── styles/
│   ├── modern_app_foundation.css  # Design system
│   └── app.css                 # Application-specific styles
└── App.tsx                     # Main application component
```

### Data Flow Architecture
```
User Interface (React Components)
    ↓
Mock API Service (mockApi.ts)
    ↓
In-Memory Data (JavaScript Objects)
    ↓
Component State (React Hooks)
    ↓
UI Rendering (Material-UI Components)
```

## Key Features

### 1. Hierarchical Order Management
- **Main Orders**: Represent overall cargo movement projects
- **Sub-Orders**: Individual ports/harbors within a main order
- **Order Lines**: Specific cargo items per port/harbor
- **Timelog**: Time tracking per order
- **Sampling**: Laboratory analysis records per order

### 2. User Interface Features
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Material-UI components with custom theming
- **Multi-step Forms**: Wizard-style order creation
- **Real-time Updates**: Live data updates without page refresh
- **Search & Filter**: Advanced filtering capabilities
- **Export Functions**: Data export capabilities

### 3. Authentication & Security
- **Mock Authentication**: Demo login system
- **Protected Routes**: Route-level access control
- **User Context**: Global user state management
- **Session Management**: Persistent login state

## Data Models

### Core Entities

#### Order Entity
```typescript
interface Order {
  id: number;
  order_number: string;
  client_name: string;
  client_email: string;
  vessel_name: string;
  port: string;
  survey_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at?: string;
  created_by_name?: string;
  parent_order_id?: number;
  is_main_order: boolean;
  sub_orders?: Order[];
  total_ports?: number;
  current_port_index?: number;
}
```

#### Order Line Entity
```typescript
interface OrderLine {
  id: number;
  sub_order_id: number;  // Links to sub-order (port/harbor)
  line_number: number;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  cargo_type?: string;
  package_type?: string;
  weight?: number;
  volume?: number;
  remarks?: string;
  created_at: string;
}
```

#### Timelog Entry Entity
```typescript
interface TimelogEntry {
  id: number;
  order_id: number;
  activity: string;
  start_time: string;
  end_time?: string;
  remarks?: string;
  created_by: string;
  created_at: string;
  timestamp?: string;  // Legacy compatibility
  created_by_name?: string;
}
```

## API Design

### Mock API Endpoints

#### Orders
- `getOrders(params?)` - Get all orders with filtering
- `getOrder(id)` - Get specific order with sub-orders
- `createOrder(orderData)` - Create new order
- `updateOrder(id, orderData)` - Update existing order
- `deleteOrder(id)` - Delete order

#### Order Lines
- `getOrderLines(subOrderId)` - Get order lines for specific sub-order
- `createOrderLine(lineData)` - Create new order line
- `updateOrderLine(id, lineData)` - Update order line
- `deleteOrderLine(id)` - Delete order line

#### Timelog
- `getTimelogEntries(orderId)` - Get timelog for order
- `createTimelogEntry(entryData)` - Create timelog entry
- `updateTimelogEntry(id, entryData)` - Update timelog entry
- `deleteTimelogEntry(id)` - Delete timelog entry

#### Sampling
- `getSamplingRecords(orderId)` - Get sampling records
- `createSamplingRecord(recordData)` - Create sampling record
- `updateSamplingRecord(id, recordData)` - Update sampling record
- `deleteSamplingRecord(id)` - Delete sampling record

#### Master Data
- `getSurveyTypes()` - Get available survey types
- `getCustomers()` - Get customer list
- `getContactPersons(customerId?)` - Get contact persons
- `getActivities()` - Get available activities

## State Management

### React Hooks Usage
- **useState**: Local component state
- **useEffect**: Side effects and data fetching
- **useCallback**: Memoized functions for performance
- **useContext**: Global state (authentication)

### State Structure
```typescript
// Authentication Context
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Component State Examples
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>('');
```

## Styling Architecture

### Design System
- **CSS Variables**: Centralized design tokens
- **Material-UI Theming**: Custom theme configuration
- **Component Styling**: sx prop and styled components
- **Responsive Design**: Mobile-first approach

### CSS Structure
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #dc2626;
  --color-gray-50: #f8fafc;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
}
```

## Performance Optimizations

### React Optimizations
- **useCallback**: Prevent unnecessary re-renders
- **useMemo**: Memoize expensive calculations
- **React.memo**: Prevent component re-renders
- **Lazy Loading**: Code splitting for routes

### Data Optimizations
- **Pagination**: Large dataset handling
- **Debouncing**: Search input optimization
- **Caching**: API response caching
- **Virtual Scrolling**: Large list rendering

## Security Considerations

### Current Implementation
- **Mock Authentication**: Demo purposes only
- **Client-side Validation**: Input validation
- **XSS Protection**: React's built-in protection
- **CSRF Protection**: Not applicable for SPA

### Future Implementation (DataVerse)
- **Entra ID Integration**: Enterprise authentication
- **Role-based Access**: Granular permissions
- **Data Encryption**: At rest and in transit
- **Audit Logging**: User activity tracking

## Deployment Architecture

### Current Deployment
- **Static Hosting**: GitHub Pages / Netlify
- **Build Process**: npm run build
- **Environment**: Development/Production builds

### Future Deployment (Azure)
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure Functions / Power Platform
- **Database**: DataVerse
- **CDN**: Azure CDN for static assets
- **Monitoring**: Application Insights

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Code Quality
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation

## Migration Strategy to DataVerse

### Phase 1: Data Model Mapping
1. Map current interfaces to DataVerse entities
2. Create custom entities in DataVerse
3. Set up relationships and business rules
4. Configure security roles

### Phase 2: API Integration
1. Replace mock API with DataVerse APIs
2. Implement Power Platform connectors
3. Set up authentication with Entra ID
4. Migrate business logic

### Phase 3: UI Adaptation
1. Update API calls to use DataVerse endpoints
2. Adapt to DataVerse data formats
3. Implement new authentication flow
4. Test and validate functionality

### Phase 4: Deployment
1. Deploy to Azure Static Web Apps
2. Configure DataVerse environment
3. Set up monitoring and logging
4. User training and go-live

## Monitoring and Maintenance

### Application Monitoring
- **Error Tracking**: JavaScript error monitoring
- **Performance Monitoring**: Page load times
- **User Analytics**: Usage patterns
- **API Monitoring**: Response times and errors

### Maintenance Tasks
- **Regular Updates**: Dependencies and security patches
- **Data Backup**: Regular data exports
- **Performance Optimization**: Code and database optimization
- **User Feedback**: Continuous improvement based on feedback

This architecture provides a solid foundation for the NMS system and ensures smooth migration to DataVerse while maintaining all current functionality and adding enterprise-grade features.
