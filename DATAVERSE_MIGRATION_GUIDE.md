# DataVerse Migration Guide for NMS

## Overview
This guide provides step-by-step instructions for migrating the NMS system from the current mock API implementation to Microsoft DataVerse. The migration will enable enterprise-grade features including Entra ID authentication, advanced security, and Power Platform integration.

## Pre-Migration Checklist

### Prerequisites
- [ ] Microsoft 365 tenant with Power Platform license
- [ ] DataVerse environment created
- [ ] Entra ID configured
- [ ] Power Platform admin access
- [ ] Development and production environments planned

### Data Preparation
- [ ] Export current mock data
- [ ] Document all business rules
- [ ] Identify custom fields and calculations
- [ ] Plan data validation rules

## Step 1: DataVerse Environment Setup

### 1.1 Create DataVerse Environment
```powershell
# Using Power Platform CLI
pac org create --name "NMS Production" --region "Europe"
pac org create --name "NMS Development" --region "Europe"
```

### 1.2 Configure Solution
```powershell
# Create solution
pac solution init --publisher-name "NMS" --publisher-prefix "nms"
```

## Step 2: Entity Creation

### 2.1 Orders Entity
**Entity Name**: `nms_orders`
**Display Name**: Orders
**Primary Field**: `nms_ordernumber`

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_ordernumber | Order Number | Single Line of Text | Yes | Format: ORD-YYYY-NNNN |
| nms_clientname | Client Name | Single Line of Text | Yes | Customer company name |
| nms_clientemail | Client Email | Email | Yes | Customer contact email |
| nms_vesselname | Vessel Name | Single Line of Text | Yes | Name of the vessel |
| nms_port | Port | Single Line of Text | Yes | Port name(s) |
| nms_surveytype | Survey Type | Lookup | Yes | Reference to Survey Types |
| nms_status | Status | Choice | Yes | pending, in_progress, completed, cancelled |
| nms_createdby | Created By | Single Line of Text | Yes | User who created the order |
| nms_createdat | Created At | Date and Time | Yes | Creation timestamp |
| nms_updatedat | Updated At | Date and Time | No | Last update timestamp |
| nms_createdbyname | Created By Name | Single Line of Text | No | Display name of creator |
| nms_parentorderid | Parent Order | Lookup | No | Self-reference to Orders |
| nms_ismainorder | Is Main Order | Two Options | Yes | true/false |
| nms_totalports | Total Ports | Whole Number | No | Total number of ports |
| nms_currentportindex | Current Port Index | Whole Number | No | Current port being processed |
| nms_remarks | Remarks | Multiple Lines of Text | No | Additional notes |

**Business Rules**:
- If `nms_ismainorder` = true, then `nms_parentorderid` must be null
- If `nms_ismainorder` = false, then `nms_parentorderid` must not be null
- `nms_ordernumber` must be unique

### 2.2 Order Lines Entity
**Entity Name**: `nms_orderlines`
**Display Name**: Order Lines
**Primary Field**: `nms_description`

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_suborderid | Sub Order | Lookup | Yes | Reference to Orders (sub-orders only) |
| nms_linenumber | Line Number | Whole Number | Yes | Sequential within sub-order |
| nms_description | Description | Single Line of Text | Yes | Description of cargo/item |
| nms_quantity | Quantity | Decimal Number | Yes | Quantity of the item |
| nms_unit | Unit | Single Line of Text | Yes | Unit of measurement |
| nms_unitprice | Unit Price | Currency | Yes | Price per unit |
| nms_totalprice | Total Price | Currency | Yes | Calculated: quantity × unit_price |
| nms_cargotype | Cargo Type | Single Line of Text | No | Type of cargo |
| nms_packagetype | Package Type | Single Line of Text | No | Packaging type |
| nms_weight | Weight | Decimal Number | No | Weight in metric tons |
| nms_volume | Volume | Decimal Number | No | Volume in cubic meters |
| nms_remarks | Remarks | Multiple Lines of Text | No | Additional notes |
| nms_createdat | Created At | Date and Time | Yes | Creation timestamp |

**Business Rules**:
- `nms_totalprice` = `nms_quantity` × `nms_unitprice`
- `nms_suborderid` must reference an order where `nms_ismainorder` = false
- `nms_linenumber` must be unique within each sub-order

### 2.3 Timelog Entries Entity
**Entity Name**: `nms_timelogentries`
**Display Name**: Timelog Entries
**Primary Field**: `nms_activity`

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_orderid | Order | Lookup | Yes | Reference to Orders |
| nms_activity | Activity | Single Line of Text | Yes | Type of activity |
| nms_starttime | Start Time | Date and Time | Yes | When activity started |
| nms_endtime | End Time | Date and Time | No | When activity ended |
| nms_remarks | Remarks | Multiple Lines of Text | No | Additional notes |
| nms_createdby | Created By | Single Line of Text | Yes | User who logged time |
| nms_createdat | Created At | Date and Time | Yes | Creation timestamp |
| nms_createdbyname | Created By Name | Single Line of Text | No | Display name |

**Business Rules**:
- `nms_endtime` must be after `nms_starttime` if provided
- `nms_createdby` must be a valid user

### 2.4 Sampling Records Entity
**Entity Name**: `nms_samplingrecords`
**Display Name**: Sampling Records
**Primary Field**: `nms_samplenumber`

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_orderid | Order | Lookup | Yes | Reference to Orders |
| nms_samplenumber | Sample Number | Single Line of Text | Yes | Unique sample identifier |
| nms_sampletype | Sample Type | Single Line of Text | Yes | Type of sample |
| nms_laboratory | Laboratory | Single Line of Text | Yes | Laboratory name |
| nms_analysistype | Analysis Type | Single Line of Text | Yes | Type of analysis |
| nms_results | Results | Multiple Lines of Text | No | Analysis results |
| nms_notes | Notes | Multiple Lines of Text | No | Additional notes |
| nms_createdat | Created At | Date and Time | Yes | Creation timestamp |
| nms_updatedat | Updated At | Date and Time | No | Last update timestamp |

### 2.5 Survey Types Entity
**Entity Name**: `nms_surveytypes`
**Display Name**: Survey Types
**Primary Field**: `nms_name`

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_name | Name | Single Line of Text | Yes | Survey type name |
| nms_description | Description | Multiple Lines of Text | No | Description |

### 2.6 Customers Entity
**Entity Name**: `nms_customers`
**Display Name**: Customers
**Primary Field**: `nms_name`

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_name | Name | Single Line of Text | Yes | Company name |
| nms_type | Type | Choice | Yes | Customer type |
| nms_address | Address | Multiple Lines of Text | No | Company address |
| nms_city | City | Single Line of Text | No | City |
| nms_postalcode | Postal Code | Single Line of Text | No | Postal code |
| nms_country | Country | Single Line of Text | No | Country |
| nms_phone | Phone | Single Line of Text | No | Phone number |
| nms_email | Email | Email | No | Contact email |
| nms_website | Website | URL | No | Company website |
| nms_notes | Notes | Multiple Lines of Text | No | Additional notes |
| nms_createdat | Created At | Date and Time | Yes | Creation timestamp |
| nms_updatedat | Updated At | Date and Time | No | Last update timestamp |

### 2.7 Contact Persons Entity
**Entity Name**: `nms_contactpersons`
**Display Name**: Contact Persons
**Primary Field**: `nms_fullname` (calculated)

| Field Name | Display Name | Type | Required | Description |
|------------|--------------|------|----------|-------------|
| nms_customerid | Customer | Lookup | Yes | Reference to Customers |
| nms_firstname | First Name | Single Line of Text | Yes | First name |
| nms_lastname | Last Name | Single Line of Text | Yes | Last name |
| nms_title | Title | Single Line of Text | No | Job title |
| nms_email | Email | Email | No | Email address |
| nms_phone | Phone | Single Line of Text | No | Phone number |
| nms_mobile | Mobile | Single Line of Text | No | Mobile number |
| nms_department | Department | Single Line of Text | No | Department |
| nms_isprimary | Is Primary | Two Options | No | Primary contact |
| nms_notes | Notes | Multiple Lines of Text | No | Additional notes |
| nms_createdat | Created At | Date and Time | Yes | Creation timestamp |
| nms_updatedat | Updated At | Date and Time | No | Last update timestamp |

## Step 3: Relationship Configuration

### 3.1 One-to-Many Relationships

#### Orders → Sub-Orders (Self-Reference)
- **Parent**: Orders
- **Child**: Orders
- **Field**: nms_parentorderid
- **Cascade**: Restrict Delete

#### Orders → Order Lines
- **Parent**: Orders
- **Child**: Order Lines
- **Field**: nms_suborderid
- **Cascade**: Cascade Delete

#### Orders → Timelog Entries
- **Parent**: Orders
- **Child**: Timelog Entries
- **Field**: nms_orderid
- **Cascade**: Cascade Delete

#### Orders → Sampling Records
- **Parent**: Orders
- **Child**: Sampling Records
- **Field**: nms_orderid
- **Cascade**: Cascade Delete

#### Survey Types → Orders
- **Parent**: Survey Types
- **Child**: Orders
- **Field**: nms_surveytype
- **Cascade**: Restrict Delete

#### Customers → Orders
- **Parent**: Customers
- **Child**: Orders
- **Field**: nms_customerid
- **Cascade**: Restrict Delete

#### Customers → Contact Persons
- **Parent**: Customers
- **Child**: Contact Persons
- **Field**: nms_customerid
- **Cascade**: Cascade Delete

## Step 4: Business Rules and Validation

### 4.1 Orders Entity Rules
```javascript
// Rule 1: Main Order Validation
if (nms_ismainorder == true) {
    nms_parentorderid = null;
}

// Rule 2: Sub-Order Validation
if (nms_ismainorder == false) {
    nms_parentorderid != null;
}

// Rule 3: Order Number Format
nms_ordernumber = "ORD-" + YEAR(TODAY()) + "-" + FORMAT(SEQUENCE(), "0000");
```

### 4.2 Order Lines Entity Rules
```javascript
// Rule 1: Total Price Calculation
nms_totalprice = nms_quantity * nms_unitprice;

// Rule 2: Sub-Order Validation
if (nms_suborderid != null) {
    nms_suborderid.nms_ismainorder == false;
}

// Rule 3: Line Number Auto-increment
nms_linenumber = COUNT(nms_orderlines WHERE nms_suborderid == this.nms_suborderid) + 1;
```

### 4.3 Timelog Entries Entity Rules
```javascript
// Rule 1: End Time Validation
if (nms_endtime != null) {
    nms_endtime > nms_starttime;
}

// Rule 2: Duration Calculation (Calculated Field)
nms_duration = IF(nms_endtime != null, 
    DATEDIFF(nms_starttime, nms_endtime, MINUTES), 
    null);
```

## Step 5: Security Configuration

### 5.1 Security Roles

#### NMS Administrator
- **Full Access**: All entities
- **Permissions**: Create, Read, Write, Delete, Append, Append To
- **Scope**: Organization

#### NMS Manager
- **Orders**: Create, Read, Write, Delete
- **Order Lines**: Create, Read, Write, Delete
- **Timelog**: Create, Read, Write, Delete
- **Sampling**: Create, Read, Write, Delete
- **Customers**: Create, Read, Write
- **Contact Persons**: Create, Read, Write
- **Survey Types**: Read
- **Scope**: Business Unit

#### NMS User
- **Orders**: Create, Read, Write (own records)
- **Order Lines**: Create, Read, Write (own orders)
- **Timelog**: Create, Read, Write (own orders)
- **Sampling**: Create, Read, Write (own orders)
- **Customers**: Read
- **Contact Persons**: Read
- **Survey Types**: Read
- **Scope**: User

#### NMS Read-Only
- **All Entities**: Read only
- **Scope**: Business Unit

### 5.2 Field-Level Security
- **Sensitive Data**: Financial information, personal data
- **Access Control**: Role-based field access
- **Audit Trail**: Track field-level changes

## Step 6: Data Migration

### 6.1 Data Export Script
```javascript
// Export current mock data to JSON
const exportData = {
  orders: mockOrders,
  orderLines: mockOrderLines,
  timelogEntries: mockTimelogEntries,
  samplingRecords: mockSamplingRecords,
  surveyTypes: mockSurveyTypes,
  customers: mockCustomers,
  contactPersons: mockContactPersons
};

// Save to file
fs.writeFileSync('nms-export.json', JSON.stringify(exportData, null, 2));
```

### 6.2 Data Import Process
1. **Prepare Data**: Clean and validate exported data
2. **Import Master Data**: Survey Types, Customers, Contact Persons
3. **Import Orders**: Main orders first, then sub-orders
4. **Import Related Data**: Order Lines, Timelog, Sampling
5. **Validate**: Check data integrity and relationships

### 6.3 Data Mapping
```javascript
// Example mapping for Orders
const mapOrder = (mockOrder) => ({
  nms_ordernumber: mockOrder.order_number,
  nms_clientname: mockOrder.client_name,
  nms_clientemail: mockOrder.client_email,
  nms_vesselname: mockOrder.vessel_name,
  nms_port: mockOrder.port,
  nms_surveytype: getSurveyTypeId(mockOrder.survey_type),
  nms_status: mapStatus(mockOrder.status),
  nms_createdby: mockOrder.created_by,
  nms_createdat: mockOrder.created_at,
  nms_ismainorder: mockOrder.is_main_order,
  nms_totalports: mockOrder.total_ports,
  nms_remarks: mockOrder.remarks
});
```

## Step 7: API Integration

### 7.1 Power Platform APIs
```typescript
// Replace mock API with DataVerse API calls
class DataVerseAPI {
  private baseUrl: string;
  private accessToken: string;

  async getOrders(filter?: string): Promise<Order[]> {
    const response = await fetch(`${this.baseUrl}/api/data/v9.2/nms_orders${filter ? '?' + filter : ''}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async createOrder(orderData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/data/v9.2/nms_orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return response.json();
  }
}
```

### 7.2 Authentication Integration
```typescript
// Entra ID authentication
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'your-client-id',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: window.location.origin
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Login function
const login = async () => {
  const loginRequest = {
    scopes: ['https://your-org.crm.dynamics.com/.default']
  };
  
  const response = await msalInstance.loginPopup(loginRequest);
  return response.accessToken;
};
```

## Step 8: Testing and Validation

### 8.1 Unit Testing
- Test all API functions
- Validate data transformations
- Check business rule enforcement
- Verify security permissions

### 8.2 Integration Testing
- End-to-end order creation
- Multi-port order workflows
- Timelog and sampling processes
- User role validation

### 8.3 User Acceptance Testing
- Business process validation
- Performance testing
- Security testing
- User interface testing

## Step 9: Deployment

### 9.1 Environment Promotion
1. **Development** → **Test**
2. **Test** → **Production**
3. **Data Migration**
4. **User Training**
5. **Go-Live**

### 9.2 Monitoring Setup
- Application Insights
- DataVerse monitoring
- User activity tracking
- Performance monitoring

## Step 10: Post-Migration

### 10.1 User Training
- DataVerse navigation
- New features and capabilities
- Security and permissions
- Best practices

### 10.2 Support and Maintenance
- User support procedures
- Regular maintenance tasks
- Performance optimization
- Feature enhancements

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Check Entra ID configuration
2. **Permission Issues**: Verify security roles
3. **Data Validation**: Check business rules
4. **Performance Issues**: Optimize queries and indexes

### Support Resources
- Microsoft Power Platform documentation
- DataVerse community forums
- Microsoft support channels
- Internal IT support team

This migration guide provides a comprehensive roadmap for transitioning the NMS system to DataVerse while maintaining all current functionality and adding enterprise-grade capabilities.
