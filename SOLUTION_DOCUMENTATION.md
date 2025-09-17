# NMS - Complete Solution Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Key Features](#key-features)
4. [User Interface Guide](#user-interface-guide)
5. [Technical Implementation](#technical-implementation)
6. [Database Structure](#database-structure)
7. [API Documentation](#api-documentation)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

## Overview

The NMS (Order Management System) is a modern web application designed to manage maritime cargo surveys and inspections. The system handles hierarchical orders where a main order can contain multiple sub-orders representing different ports/harbors, each with their own order lines, timelog entries, sampling records, and remarks.

### Key Capabilities
- **Hierarchical Order Management**: Main orders with multiple port-specific sub-orders
- **Port-Specific Data Tracking**: All data (order lines, timelog, sampling, remarks) linked to specific ports
- **Customer Management**: Complete customer and contact person management
- **Real-time Data Entry**: Timelog, sampling, and remarks with port selection
- **Order Editing**: Full CRUD operations for orders and related data
- **Modern UI**: Responsive design with Material-UI components

## System Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Routing**: React Router v6
- **Date Handling**: Day.js with Norwegian locale
- **Styling**: CSS Variables with custom design system
- **Build Tool**: Create React App
- **Backend**: Mock API (ready for real backend integration)

### Component Architecture
```
src/
├── components/
│   ├── Layout.tsx          # Main layout with navigation
│   ├── ProtectedRoute.tsx  # Authentication wrapper
│   └── SplashScreen.tsx    # Loading screen
├── pages/
│   ├── Dashboard.tsx       # Overview and statistics
│   ├── Orders.tsx          # Order listing
│   ├── OrderDetail.tsx     # Order details and management
│   ├── OrderForm.tsx       # Order creation and editing
│   ├── SurveyTypes.tsx     # Survey type management
│   └── Login.tsx           # Authentication
├── services/
│   └── mockApi.ts          # Mock API implementation
├── contexts/
│   └── AuthContext.tsx     # Authentication context
└── styles/
    ├── modern_app_foundation.css  # Design system
    └── app.css                    # App-specific styles
```

## Key Features

### 1. Hierarchical Order Structure
- **Main Orders**: Overall project/cargo movement
- **Sub-Orders**: Individual ports/harbors within main order
- **Port-Specific Data**: All data linked to specific ports

### 2. Order Management
- **Create Orders**: Multi-step wizard for order creation
- **Edit Orders**: Full editing capabilities with data loading
- **View Orders**: Detailed order information with all related data
- **Delete Orders**: Safe deletion with confirmation

### 3. Port-Specific Data Entry
- **Order Lines**: Cargo items linked to specific ports
- **Timelog**: Time tracking with port selection
- **Sampling**: Laboratory samples with port assignment
- **Remarks**: Port-specific notes and comments

### 4. Customer Management
- **Customer Registration**: Company information management
- **Contact Persons**: Individual contact management
- **Relationship Management**: Link contacts to customers

## User Interface Guide

### 1. Dashboard
The dashboard provides an overview of the system with:
- Order statistics (total, pending, in progress, completed)
- Recent orders list
- Quick access to common functions

### 2. Order Management

#### Creating a New Order
1. Navigate to "Orders" → "New Order"
2. **Step 1 - Customer & Contact**: Select or create customer and contact person
3. **Step 2 - Vessel Information**: Enter vessel details (name, IMO, flag, arrival/departure)
4. **Step 3 - Survey Details**: Select survey type and ports
5. **Step 4 - Order Lines**: Add cargo items with port assignment
6. **Step 5 - Review & Submit**: Review all information and submit

#### Editing an Order
1. Navigate to "Orders" → Select order → "Edit"
2. All existing data loads automatically
3. Make changes and save

#### Order Details View
- **Overview**: Basic order information
- **Order Lines**: Cargo items with port information
- **Timelog**: Time entries with port selection
- **Sampling**: Laboratory records with port assignment
- **Remarks**: Port-specific notes

### 3. Port Selection Interface
All data entry forms include port selection:
- **Multi-port Orders**: Dropdown with all available ports
- **Single-port Orders**: Automatic port assignment
- **Visual Indicators**: Color-coded chips showing port information

## Technical Implementation

### 1. Data Flow
```
User Input → Form Validation → Mock API → State Update → UI Refresh
```

### 2. State Management
- **Local State**: Component-level state with useState
- **Context**: Authentication state with AuthContext
- **Data Fetching**: useEffect with async/await patterns

### 3. Form Handling
- **Multi-step Forms**: Stepper component with validation
- **Dynamic Fields**: Conditional rendering based on selections
- **Validation**: Client-side validation with error handling

### 4. API Integration
- **Mock Implementation**: Complete mock API for development
- **Type Safety**: TypeScript interfaces for all data structures
- **Error Handling**: Comprehensive error handling and user feedback

## Database Structure

The system uses a hierarchical database structure:

### Core Tables
1. **Orders**: Main orders and sub-orders
2. **Order Lines**: Cargo items linked to sub-orders
3. **Timelog Entries**: Time tracking linked to sub-orders
4. **Sampling Records**: Laboratory data linked to sub-orders
5. **Remarks**: Notes linked to sub-orders
6. **Customers**: Company information
7. **Contact Persons**: Individual contacts
8. **Survey Types**: Master data for survey types

### Key Relationships
- Main Orders → Sub-Orders (1:many)
- Sub-Orders → Order Lines (1:many)
- Sub-Orders → Timelog Entries (1:many)
- Sub-Orders → Sampling Records (1:many)
- Sub-Orders → Remarks (1:many)
- Customers → Contact Persons (1:many)

## API Documentation

### Order Management
```typescript
// Get all orders
GET /api/orders

// Get specific order
GET /api/orders/:id

// Create new order
POST /api/orders

// Update order
PUT /api/orders/:id

// Delete order
DELETE /api/orders/:id
```

### Order Lines
```typescript
// Get order lines for sub-order
GET /api/orders/:subOrderId/lines

// Create order line
POST /api/order-lines

// Update order line
PUT /api/order-lines/:id

// Delete order line
DELETE /api/order-lines/:id
```

### Timelog
```typescript
// Get timelog entries for sub-order
GET /api/orders/:subOrderId/timelog

// Create timelog entry
POST /api/timelog

// Update timelog entry
PUT /api/timelog/:id

// Delete timelog entry
DELETE /api/timelog/:id
```

### Sampling
```typescript
// Get sampling records for sub-order
GET /api/orders/:subOrderId/sampling

// Create sampling record
POST /api/sampling

// Update sampling record
PUT /api/sampling/:id

// Delete sampling record
DELETE /api/sampling/:id
```

### Remarks
```typescript
// Get remarks for sub-order
GET /api/orders/:subOrderId/remarks

// Create remark
POST /api/remarks

// Update remark
PUT /api/remarks/:id

// Delete remark
DELETE /api/remarks/:id
```

## Deployment Guide

### Development Setup
1. **Prerequisites**:
   - Node.js 16+ and npm
   - Git

2. **Installation**:
   ```bash
   git clone <repository-url>
   cd NMS
   cd client
   npm install
   ```

3. **Development Server**:
   ```bash
   npm start
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

### Production Deployment
1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Serve Static Files**:
   - Use any static file server (nginx, Apache, etc.)
   - Or use `serve` package: `npx serve -s build`

3. **Environment Configuration**:
   - Set `REACT_APP_BUILD_NUMBER` for build tracking
   - Configure API endpoints for production

### Azure Static Web Apps
The application is configured for Azure Static Web Apps deployment:
- Build command: `npm run build`
- Output directory: `build`
- API functions in `api/` directory (when implemented)

## Troubleshooting

### Common Issues

#### 1. Port Dropdown Not Showing Options
**Problem**: Port selection dropdown shows empty or incorrect options
**Solution**: 
- Check that order data is loaded completely
- Verify sub_orders array is populated
- Ensure proper length check in dropdown logic

#### 2. Order Editing Not Working
**Problem**: Edit button doesn't work or shows 404 error
**Solution**:
- Verify route is defined: `/orders/:id/edit`
- Check that OrderForm handles edit mode
- Ensure fetchOrderData function is implemented

#### 3. Data Not Saving
**Problem**: Form submissions don't save data
**Solution**:
- Check mock API implementation
- Verify form validation
- Check browser console for errors

#### 4. Build Errors
**Problem**: TypeScript compilation errors
**Solution**:
- Run `npm run build` to see detailed errors
- Check for missing imports
- Verify interface definitions

### Performance Optimization
1. **Code Splitting**: Implement lazy loading for large components
2. **Memoization**: Use React.memo for expensive components
3. **Virtual Scrolling**: For large data lists
4. **Caching**: Implement proper data caching strategies

### Security Considerations
1. **Input Validation**: Client and server-side validation
2. **Authentication**: Implement proper JWT handling
3. **Authorization**: Role-based access control
4. **Data Sanitization**: Prevent XSS attacks

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Reporting**: PDF generation and export
3. **Mobile App**: React Native version for field workers
4. **Integration**: Connect to real backend APIs
5. **Analytics**: Dashboard with charts and metrics
6. **Notifications**: Email and SMS notifications
7. **Workflow Management**: Approval processes and status tracking

### Technical Improvements
1. **State Management**: Redux or Zustand for complex state
2. **Testing**: Unit and integration tests
3. **CI/CD**: Automated deployment pipeline
4. **Monitoring**: Error tracking and performance monitoring
5. **Accessibility**: WCAG compliance improvements

## Support and Maintenance

### Documentation Updates
- Keep this documentation updated with new features
- Update API documentation when endpoints change
- Maintain user guides for new functionality

### Code Maintenance
- Regular dependency updates
- Security patch management
- Performance monitoring and optimization
- Code quality improvements

### User Support
- Provide training materials for new users
- Create video tutorials for complex workflows
- Maintain FAQ and troubleshooting guides
- Collect user feedback for improvements

---

*This documentation is maintained as part of the NMS project. For questions or updates, please contact the development team.*
