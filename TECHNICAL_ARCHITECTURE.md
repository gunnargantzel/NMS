# NMS - Technical Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [Performance Considerations](#performance-considerations)
10. [Deployment Architecture](#deployment-architecture)

## System Overview

The NMS (Order Management System) is a modern single-page application (SPA) built with React and TypeScript. It follows a hierarchical data model where main orders contain multiple sub-orders representing different ports/harbors, each with their own specific data.

### Core Principles
- **Component-Based Architecture**: Modular, reusable components
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach with Material-UI
- **Hierarchical Data Model**: Port-specific data organization
- **Mock-First Development**: Ready for backend integration

## Architecture Patterns

### 1. Component Composition Pattern
```typescript
// High-level components compose lower-level ones
<Layout>
  <ProtectedRoute>
    <OrderDetail>
      <Tabs>
        <TabPanel>
          <DataTable />
        </TabPanel>
      </Tabs>
    </OrderDetail>
  </ProtectedRoute>
</Layout>
```

### 2. Custom Hooks Pattern
```typescript
// Reusable logic extraction
const useOrderData = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrderData(orderId);
  }, [orderId]);
  
  return { order, loading, refetch: fetchOrderData };
};
```

### 3. Context Pattern
```typescript
// Global state management
<AuthProvider>
  <App />
</AuthProvider>
```

### 4. Service Layer Pattern
```typescript
// API abstraction
class OrderService {
  async getOrder(id: number): Promise<Order> {
    return mockApi.getOrder(id);
  }
  
  async createOrder(data: OrderData): Promise<Order> {
    return mockApi.createOrder(data);
  }
}
```

## Technology Stack

### Frontend Technologies
- **React 18**: Latest version with concurrent features
- **TypeScript 4.9+**: Type safety and developer experience
- **Material-UI v5**: Component library and design system
- **React Router v6**: Client-side routing
- **Day.js**: Date manipulation and formatting
- **CSS Variables**: Custom design system implementation

### Development Tools
- **Create React App**: Build tooling and development server
- **ESLint**: Code linting and quality
- **TypeScript Compiler**: Type checking and compilation
- **Git**: Version control

### Build and Deployment
- **Webpack**: Module bundling (via CRA)
- **Babel**: JavaScript transpilation
- **PostCSS**: CSS processing
- **Azure Static Web Apps**: Deployment platform

## Component Architecture

### 1. Layout Components
```
Layout/
├── Layout.tsx              # Main application layout
├── AppBar.tsx              # Top navigation bar
├── Drawer.tsx              # Side navigation menu
└── ProtectedRoute.tsx      # Authentication wrapper
```

### 2. Page Components
```
Pages/
├── Dashboard.tsx           # Overview and statistics
├── Orders.tsx              # Order listing and management
├── OrderDetail.tsx         # Detailed order view
├── OrderForm.tsx           # Order creation and editing
├── SurveyTypes.tsx         # Survey type management
└── Login.tsx               # Authentication page
```

### 3. Feature Components
```
Components/
├── SplashScreen.tsx        # Loading screen
├── DataTable.tsx           # Reusable table component
├── FormStepper.tsx         # Multi-step form navigation
├── PortSelector.tsx        # Port selection dropdown
└── StatusChip.tsx          # Status display component
```

### 4. Service Components
```
Services/
├── mockApi.ts              # Mock API implementation
├── authService.ts          # Authentication service
├── orderService.ts         # Order management service
└── validationService.ts    # Form validation utilities
```

## Data Flow

### 1. Unidirectional Data Flow
```
User Action → Event Handler → State Update → Component Re-render → UI Update
```

### 2. Data Fetching Flow
```
Component Mount → useEffect → API Call → State Update → Component Re-render
```

### 3. Form Submission Flow
```
Form Submit → Validation → API Call → Success/Error → State Update → Navigation
```

### 4. Hierarchical Data Flow
```
Main Order → Sub-Orders → Order Lines/Timelog/Sampling/Remarks
```

## State Management

### 1. Local Component State
```typescript
// Component-level state
const [order, setOrder] = useState<Order | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string>('');
```

### 2. Context State
```typescript
// Global authentication state
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

### 3. Form State
```typescript
// Complex form state management
const [formData, setFormData] = useState<OrderFormData>({
  customer_id: null,
  customer_name: '',
  vessel_name: '',
  // ... other fields
});
```

### 4. Derived State
```typescript
// Computed values
const totalPrice = orderLines.reduce((sum, line) => sum + line.total_price, 0);
const isMultiPort = ports.length > 1;
```

## API Design

### 1. RESTful API Structure
```
GET    /api/orders              # List all orders
GET    /api/orders/:id          # Get specific order
POST   /api/orders              # Create new order
PUT    /api/orders/:id          # Update order
DELETE /api/orders/:id          # Delete order

GET    /api/orders/:id/lines    # Get order lines
POST   /api/order-lines         # Create order line
PUT    /api/order-lines/:id     # Update order line
DELETE /api/order-lines/:id     # Delete order line
```

### 2. Mock API Implementation
```typescript
// Mock API with realistic delays
export const mockApi = {
  getOrder: async (id: number): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOrders.find(order => order.id === id)!;
  },
  
  createOrder: async (data: OrderData): Promise<OrderResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simulate order creation
    return { orderId: Date.now(), orderNumber: `ORD-${Date.now()}` };
  }
};
```

### 3. Type-Safe API Calls
```typescript
// TypeScript interfaces for API responses
interface OrderResponse {
  orderId: number;
  orderNumber: string;
  message: string;
}

interface ApiError {
  message: string;
  code: string;
  details?: any;
}
```

## Security Architecture

### 1. Authentication
```typescript
// JWT-based authentication (ready for implementation)
interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
```

### 2. Authorization
```typescript
// Role-based access control
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  FIELD_WORKER = 'field_worker',
  VIEWER = 'viewer'
}
```

### 3. Input Validation
```typescript
// Client-side validation
const validateOrderData = (data: OrderFormData): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.customer_name) errors.push('Customer name is required');
  if (!data.vessel_name) errors.push('Vessel name is required');
  
  return { isValid: errors.length === 0, errors };
};
```

### 4. Data Sanitization
```typescript
// XSS prevention
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

## Performance Considerations

### 1. Code Splitting
```typescript
// Lazy loading for large components
const OrderForm = lazy(() => import('./pages/OrderForm'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
```

### 2. Memoization
```typescript
// Prevent unnecessary re-renders
const MemoizedOrderList = memo(OrderList);
const MemoizedOrderCard = memo(OrderCard);
```

### 3. Virtual Scrolling
```typescript
// For large data sets
import { FixedSizeList as List } from 'react-window';

const VirtualizedOrderList = ({ orders }: { orders: Order[] }) => (
  <List
    height={600}
    itemCount={orders.length}
    itemSize={80}
    itemData={orders}
  >
    {OrderRow}
  </List>
);
```

### 4. Debouncing
```typescript
// Debounce search inputs
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

## Deployment Architecture

### 1. Development Environment
```
Developer Machine
├── Node.js 16+
├── npm/yarn
├── Git
└── VS Code (recommended)
```

### 2. Build Process
```
Source Code
├── TypeScript Compilation
├── React Build
├── CSS Processing
├── Asset Optimization
└── Static Files
```

### 3. Production Deployment
```
Azure Static Web Apps
├── Frontend (React SPA)
├── API Functions (Future)
├── CDN Distribution
└── SSL/TLS Termination
```

### 4. CI/CD Pipeline
```
Git Repository
├── Push Trigger
├── Build Process
├── Test Execution
├── Deployment
└── Health Check
```

## Scalability Considerations

### 1. Frontend Scalability
- **Component Library**: Reusable UI components
- **State Management**: Context + Redux for complex state
- **Code Splitting**: Lazy loading for performance
- **Caching**: Service worker for offline capability

### 2. Backend Integration
- **API Gateway**: Centralized API management
- **Microservices**: Service-oriented architecture
- **Database**: PostgreSQL with proper indexing
- **Caching**: Redis for session and data caching

### 3. Performance Monitoring
- **Error Tracking**: Sentry or similar
- **Performance Metrics**: Web Vitals monitoring
- **User Analytics**: Usage pattern analysis
- **Health Checks**: System status monitoring

## Future Architecture Enhancements

### 1. Real-time Features
```typescript
// WebSocket integration
const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => setLastMessage(JSON.parse(event.data));
    setSocket(ws);
    
    return () => ws.close();
  }, [url]);
  
  return { socket, lastMessage };
};
```

### 2. Offline Support
```typescript
// Service worker for offline capability
const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<Action[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, pendingActions };
};
```

### 3. Progressive Web App
```typescript
// PWA configuration
const pwaConfig = {
  name: 'NMS - Order Management System',
  short_name: 'NMS',
  description: 'Maritime cargo survey management system',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#2563eb',
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};
```

## Monitoring and Observability

### 1. Error Tracking
```typescript
// Error boundary for React components
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### 2. Performance Monitoring
```typescript
// Web Vitals tracking
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

### 3. User Analytics
```typescript
// Custom analytics tracking
const trackUserAction = (action: string, properties?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    analytics.track(action, properties);
  }
};
```

---

*This technical architecture documentation provides a comprehensive overview of the NMS system's technical implementation. It serves as a guide for developers, architects, and stakeholders involved in the system's development and maintenance.*