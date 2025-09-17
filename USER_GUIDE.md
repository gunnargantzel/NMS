# NMS - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login and Authentication](#login-and-authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Order Management](#order-management)
5. [Customer Management](#customer-management)
6. [Data Entry Procedures](#data-entry-procedures)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Screen resolution: 1024x768 or higher

### Accessing the System
1. Open your web browser
2. Navigate to the NMS application URL
3. You will see the splash screen with "Applikasjonen starter opp..."
4. Wait for the application to load (approximately 3 seconds)

## Login and Authentication

### Demo Login Credentials
For demonstration purposes, you can use any of the following:

**Option 1: Demo User**
- Username: `demo`
- Password: Any password with 3+ characters

**Option 2: Admin User**
- Username: `admin`
- Password: Any password with 3+ characters

**Option 3: Field Worker**
- Username: `fieldworker`
- Password: Any password with 3+ characters

### Login Process
1. Enter your username in the "Username" field
2. Enter your password in the "Password" field
3. Click "Login" button
4. You will be redirected to the dashboard

## Dashboard Overview

The dashboard provides a comprehensive overview of your orders and system status.

### Key Information Displayed
- **Total Orders**: Number of all orders in the system
- **Pending Orders**: Orders waiting to be started
- **In Progress Orders**: Orders currently being worked on
- **Completed Orders**: Finished orders

### Recent Orders Section
- Shows the 5 most recent orders
- Displays order number, client name, vessel, and status
- Click on any order to view details

### Navigation Menu
- **Dashboard**: Return to overview
- **Orders**: Manage all orders
- **Products**: Manage product master data
- **Ports**: Manage port/harbor master data
- **Survey Types**: Manage survey type master data
- **Logout**: Sign out of the system

## Order Management

### Viewing Orders

#### Order List
1. Click "Orders" in the navigation menu
2. View all orders in a table format
3. Information displayed:
   - Order Number
   - Client Name
   - Vessel Name
   - Port(s)
   - Status
   - Created Date

#### Order Details
1. Click on any order in the list
2. View comprehensive order information:
   - **Overview**: Basic order details
   - **Order Lines**: Cargo items with port information
   - **Timelog**: Time tracking entries
   - **Sampling**: Laboratory records
   - **Remarks**: Notes and comments

### Creating New Orders

#### Step 1: Customer & Contact Information
1. Click "New Order" button
2. **Customer Selection**:
   - Select existing customer from dropdown
   - Or click "Add New Customer" to create new customer
3. **Contact Person**:
   - Select contact person from dropdown
   - Or click "Add New Contact" to create new contact
4. Click "Next" to proceed

#### Step 2: Vessel Information
1. **Vessel Details**:
   - Vessel Name (required)
   - Vessel IMO Number
   - Vessel Flag State
   - Expected Arrival Date/Time
   - Expected Departure Date/Time
2. Click "Next" to proceed

#### Step 3: Survey Details
1. **Survey Type**: Select from available survey types
2. **Port Configuration**:
   - **Single Port**: Select one port for the entire order
   - **Multi-Port**: Select multiple ports for the order
3. **Remarks**: Add any additional notes
4. Click "Next" to proceed

#### Step 4: Order Lines
1. Click "Add Order Line" button
2. **Port Selection**: Choose which port this line item belongs to
3. **Product Selection**: Choose from available products (dropdown)
4. **Line Details**:
   - Description (auto-filled from product selection)
   - Quantity (required)
   - Unit (MT, TEU, M³, etc.)
   - Unit Price (required)
   - Cargo Type
   - Package Type
   - Weight
   - Volume
   - Remarks
5. Click "Add" to save the line item
6. Repeat for additional line items
7. Click "Next" to proceed

#### Step 5: Review & Submit
1. Review all entered information
2. Check that all required fields are completed
3. Verify port assignments for order lines
4. Click "Submit Order" to create the order
5. You will see a success message and be redirected to the orders list

### Editing Orders

#### Accessing Edit Mode
1. Navigate to the order list
2. Click "Edit" button next to the order you want to modify
3. The order form will load with all existing data

#### Making Changes
1. Navigate through the form steps using the stepper
2. Modify any fields as needed
3. Add or remove order lines
4. Update port assignments
5. Click "Submit Order" to save changes

#### Important Notes
- All existing data is preserved when editing
- Changes are saved immediately upon submission
- Order lines maintain their port assignments

### Deleting Orders
1. Navigate to the order list
2. Click "Delete" button next to the order
3. Confirm deletion in the popup dialog
4. The order and all related data will be removed

## Customer Management

### Creating New Customers
1. In the order form, click "Add New Customer"
2. Fill in customer information:
   - Company Name (required)
   - Customer Type (Cargo Owner, Agent, etc.)
   - Address
   - Postal Code
   - City
   - Country
   - Phone Number
   - Email Address
3. Click "Create Customer"

### Creating New Contact Persons
1. In the order form, click "Add New Contact"
2. Fill in contact information:
   - First Name (required)
   - Last Name (required)
   - Title
   - Department
   - Phone Number
   - Mobile Number
   - Email Address (required)
   - Notes
3. Click "Create Contact"

## Master Data Management

### Product Management
1. Click "Products" in the navigation menu
2. **View Products**: See all available products in a table
3. **Add New Product**:
   - Click "Add Product" button
   - Fill in product details:
     - Name (required)
     - Description
     - Category
     - Active status
   - Click "Create Product"
4. **Edit Product**:
   - Click "Edit" button next to the product
   - Modify fields as needed
   - Click "Update Product"
5. **Delete Product**:
   - Click "Delete" button next to the product
   - Confirm deletion

### Port Management
1. Click "Ports" in the navigation menu
2. **View Ports**: See all available ports in a table
3. **Add New Port**:
   - Click "Add Port" button
   - Fill in port details:
     - Name (required)
     - Country (required)
     - Region
     - Active status
   - Click "Create Port"
4. **Edit Port**:
   - Click "Edit" button next to the port
   - Modify fields as needed
   - Click "Update Port"
5. **Delete Port**:
   - Click "Delete" button next to the port
   - Confirm deletion

## Data Entry Procedures

### Adding Timelog Entries

#### From Order Details
1. Navigate to order details
2. Click "Timelog" tab
3. Click "Add Entry" button
4. **Port Selection**: Choose which port this entry belongs to
5. **Time Information**:
   - Start Time (required)
   - End Time (optional)
6. **Activity Details**:
   - Activity Type (required)
   - Remarks
7. Click "Add" to save the entry

#### Activity Types Available
- Vessel berthed
- Surveyor on board
- Cargo inspection started
- Cargo inspection completed
- Sampling started
- Sampling completed
- Documentation review
- Client meeting
- Report preparation
- Survey completed

### Adding Sampling Records

#### From Order Details
1. Navigate to order details
2. Click "Sampling" tab
3. Click "Add Record" button
4. **Port Selection**: Choose which port this sample belongs to
5. **Sample Information**:
   - Sample Type (required)
   - Quantity
   - Destination
   - Seal Number
   - Remarks
6. Click "Add Record" to save

#### Sample Types Available
- Fuel Oil
- Diesel
- Crude Oil
- Container Cargo
- Refined Product
- Water Sample
- Sediment Sample

### Adding Remarks

#### From Order Details
1. Navigate to order details
2. Click "Remarks" tab
3. Click "Add Remark" button
4. **Port Selection**: Choose which port this remark belongs to
5. **Remark Content**: Enter your notes (multiline text)
6. Click "Add Remark" to save

## Editing Data Entries

### Editing Order Lines
1. Navigate to order details
2. Click "Order Lines" tab
3. Click "Edit" button next to the order line you want to modify
4. **Edit Dialog**: Modify any fields as needed:
   - Description
   - Quantity
   - Unit
   - Unit Price
   - Cargo Type
   - Package Type
   - Weight
   - Volume
   - Remarks
5. Click "Update Order Line" to save changes

### Editing Timelog Entries
1. Navigate to order details
2. Click "Timelog" tab
3. Click "Edit" button next to the timelog entry you want to modify
4. **Edit Dialog**: Modify any fields as needed:
   - Port/Harbor selection
   - Activity type
   - Start Time
   - End Time
   - Duration (minutes)
   - Description/Remarks
5. Click "Update Timelog Entry" to save changes

### Editing Sampling Records
1. Navigate to order details
2. Click "Sampling" tab
3. Click "Edit" button next to the sampling record you want to modify
4. **Edit Dialog**: Modify any fields as needed:
   - Port/Harbor selection
   - Sample Type
   - Quantity
   - Description/Remarks
5. Click "Update Sampling Record" to save changes

### Editing Remarks
1. Navigate to order details
2. Click "Remarks" tab
3. Click "Edit" button next to the remark you want to modify
4. **Edit Dialog**: Modify any fields as needed:
   - Port/Harbor selection
   - Content (multiline text)
5. Click "Update Remark" to save changes

## Port-Specific Data Management

### Understanding Port Assignment
- **Main Orders**: Contain multiple ports (sub-orders)
- **Sub-Orders**: Represent individual ports/harbors
- **Data Linking**: All data (order lines, timelog, sampling, remarks) is linked to specific ports

### Port Selection Interface
When adding data, you will see:
- **Multi-port Orders**: Dropdown with all available ports
- **Single-port Orders**: Automatic port assignment
- **Visual Indicators**: Color-coded chips showing port information

### Best Practices
1. **Always select the correct port** when adding data
2. **Verify port assignments** before submitting
3. **Use consistent port names** across the system
4. **Check port information** in the order details view

## Troubleshooting

### Common Issues and Solutions

#### Login Problems
**Problem**: Cannot log in to the system
**Solutions**:
- Check username and password
- Ensure you're using the correct demo credentials
- Try refreshing the page
- Clear browser cache and cookies

#### Order Creation Issues
**Problem**: Cannot create new orders
**Solutions**:
- Check that all required fields are filled
- Verify customer and contact person are selected
- Ensure at least one order line is added
- Check that port is selected for each order line

#### Data Entry Problems
**Problem**: Cannot add timelog, sampling, or remarks
**Solutions**:
- Ensure you're in the correct order details view
- Check that port is selected in the dropdown
- Verify all required fields are completed
- Try refreshing the page

#### Display Issues
**Problem**: Data not displaying correctly
**Solutions**:
- Refresh the page
- Check browser compatibility
- Clear browser cache
- Try a different browser

#### Performance Issues
**Problem**: Application running slowly
**Solutions**:
- Check internet connection
- Close unnecessary browser tabs
- Clear browser cache
- Restart the browser

### Getting Help
If you encounter issues not covered in this guide:
1. Check the browser console for error messages
2. Try the troubleshooting steps above
3. Contact your system administrator
4. Report the issue with specific details about what you were trying to do

### System Limitations
- **Demo Mode**: Current implementation uses mock data
- **Data Persistence**: Data is not saved between sessions
- **Offline Mode**: Requires internet connection
- **Browser Support**: Best performance in modern browsers

## Tips for Efficient Use

### Navigation Tips
- Use the breadcrumb navigation to understand your current location
- Use the back button in your browser to return to previous pages
- Bookmark frequently used pages for quick access

### Data Entry Tips
- Fill in all required fields before proceeding to next step
- Use consistent naming conventions for ports and vessels
- Add detailed remarks for better documentation
- Verify data before submitting

### Order Management Tips
- Use descriptive order numbers for easy identification
- Keep customer information up to date
- Regularly review and update order status
- Use the search and filter functions to find specific orders

### Time-Saving Features
- Use the "Add New" buttons to quickly create customers and contacts
- Copy existing orders as templates for similar orders
- Use the bulk operations for multiple order lines
- Save frequently used remarks as templates

---

*This user guide is designed to help you get the most out of the NMS system. For additional support or feature requests, please contact your system administrator.*
