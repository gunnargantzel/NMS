# NMS - Dataverse Implementation Guide

## Overview
This document provides a complete master specification for implementing the NMS (Order Management System) database structure in Microsoft Dataverse. The system is designed to handle multi-ship orders where each order can contain multiple ships, and each ship can visit multiple ports, with associated order lines, timelog entries, and sampling records.

## Dataverse Table Specifications

### 1. Orders Table (nms_orders)
**Purpose**: Main orders containing multiple ships and their associated data.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_orderid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_ordernumber | Single Line of Text (50) | Yes | Human-readable order number | Format: "ORD-YYYY-NNNN" |
| nms_clientname | Single Line of Text (100) | Yes | Customer company name | |
| nms_clientemail | Single Line of Text (100) | Yes | Customer contact email | Email format validation |
| nms_surveytype | Single Line of Text (50) | Yes | Type of survey to be performed | Choice field |
| nms_status | Choice | Yes | Order status | Values: 'Pending', 'In Progress', 'Completed', 'Cancelled' |
| nms_totalships | Whole Number | Yes | Total number of ships in order | Calculated field |
| nms_totalports | Whole Number | Yes | Total number of ports across all ships | Calculated field |
| nms_createdby | Lookup (System User) | Yes | User who created the order | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |
| nms_remarks | Multiple Lines of Text | No | Additional notes | |

**Choice Fields**:
- `nms_status`: Pending, In Progress, Completed, Cancelled
- `nms_surveytype`: Loading Survey, Discharging Survey, Pre-shipment Survey, Cargo Damage Survey, Loading and Lashing Survey

### 2. Ships Table (nms_ships)
**Purpose**: Individual ships within orders.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_shipid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_orderid | Lookup (Orders) | Yes | Reference to parent order | |
| nms_vesselname | Single Line of Text (100) | Yes | Name of the vessel | |
| nms_vesselimo | Single Line of Text (20) | No | Vessel IMO number | IMO format validation |
| nms_vesselflag | Single Line of Text (50) | No | Vessel flag state | |
| nms_expectedarrival | Date and Time | No | Expected arrival time | |
| nms_expecteddeparture | Date and Time | No | Expected departure time | |
| nms_status | Choice | Yes | Ship status | Values: 'Pending', 'In Progress', 'Completed', 'Cancelled' |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |
| nms_remarks | Multiple Lines of Text | No | Additional notes | |

**Choice Fields**:
- `nms_status`: Pending, In Progress, Completed, Cancelled

### 3. Ship Ports Table (nms_shipports)
**Purpose**: Ports visited by each ship.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_shipportid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_shipid | Lookup (Ships) | Yes | Reference to parent ship | |
| nms_portid | Lookup (Ports) | No | Reference to port master data | |
| nms_portname | Single Line of Text (200) | Yes | Port name | |
| nms_portsequence | Whole Number | Yes | Sequence of port visit | Must be > 0 |
| nms_status | Choice | Yes | Port status | Values: 'Pending', 'In Progress', 'Completed', 'Cancelled' |
| nms_actualarrival | Date and Time | No | Actual arrival time | |
| nms_actualdeparture | Date and Time | No | Actual departure time | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |
| nms_remarks | Multiple Lines of Text | No | Additional notes | |

**Choice Fields**:
- `nms_status`: Pending, In Progress, Completed, Cancelled

### 4. Order Lines Table (nms_orderlines)
**Purpose**: Individual line items for each ship port.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_orderlineid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_shipportid | Lookup (Ship Ports) | Yes | Reference to ship port | |
| nms_linenumber | Whole Number | Yes | Line number within the ship port | Sequential numbering |
| nms_description | Single Line of Text (200) | Yes | Description of the cargo/item | |
| nms_quantity | Decimal Number (10,2) | Yes | Quantity of the item | Must be > 0 |
| nms_unit | Single Line of Text (20) | Yes | Unit of measurement | Choice field |
| nms_unitprice | Currency | Yes | Price per unit | Must be >= 0 |
| nms_totalprice | Currency | Yes | Total price for this line | Calculated: quantity × unit_price |
| nms_cargotype | Single Line of Text (50) | No | Type of cargo | |
| nms_packagetype | Single Line of Text (50) | No | Packaging type | |
| nms_weight | Decimal Number (10,2) | No | Weight in metric tons | |
| nms_volume | Decimal Number (10,2) | No | Volume in cubic meters | |
| nms_remarks | Multiple Lines of Text | No | Additional notes | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |

**Choice Fields**:
- `nms_unit`: MT, TEU, M³, KG, L, PCS

### 5. Timelog Entries Table (nms_timelogentries)
**Purpose**: Tracks time spent on activities for each ship port.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_timelogid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_shipportid | Lookup (Ship Ports) | Yes | Reference to ship port | |
| nms_activity | Single Line of Text (100) | Yes | Type of activity performed | |
| nms_starttime | Date and Time | Yes | When the activity started | |
| nms_endtime | Date and Time | No | When the activity ended | Must be > start_time if provided |
| nms_remarks | Multiple Lines of Text | No | Additional notes | |
| nms_createdby | Lookup (System User) | Yes | User who logged the time | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_createdbyname | Single Line of Text (100) | No | Display name of creator | |

### 6. Sampling Records Table (nms_samplingrecords)
**Purpose**: Laboratory sampling and analysis records for each ship port.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_samplingid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_shipportid | Lookup (Ship Ports) | Yes | Reference to ship port | |
| nms_samplenumber | Single Line of Text (50) | Yes | Unique sample identifier | Must be unique |
| nms_sampletype | Single Line of Text (50) | Yes | Type of sample taken | |
| nms_quantity | Single Line of Text (50) | No | Quantity of sample | |
| nms_destination | Single Line of Text (100) | No | Where sample is sent | |
| nms_sealnumber | Single Line of Text (50) | No | Seal number for sample | |
| nms_laboratory | Single Line of Text (100) | No | Laboratory performing analysis | |
| nms_analysistype | Single Line of Text (100) | No | Type of analysis performed | |
| nms_status | Choice | No | Sample status | Values: 'Pending', 'In Progress', 'Completed' |
| nms_remarks | Multiple Lines of Text | No | Additional notes | |
| nms_createdby | Lookup (System User) | Yes | User who created the record | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_createdbyname | Single Line of Text (100) | No | Display name of creator | |
| nms_updatedat | Date and Time | No | Last update timestamp | |

**Choice Fields**:
- `nms_status`: Pending, In Progress, Completed

### 7. Remarks Table (nms_remarks)
**Purpose**: Port-specific remarks and notes for each ship port.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_remarkid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_shipportid | Lookup (Ship Ports) | Yes | Reference to ship port | |
| nms_content | Multiple Lines of Text | Yes | Remark content | |
| nms_createdby | Lookup (System User) | Yes | User who created the remark | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |

### 8. Survey Types Table (nms_surveytypes)
**Purpose**: Master data for available survey types.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_surveytypeid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_name | Single Line of Text (50) | Yes | Survey type name | Must be unique |
| nms_description | Multiple Lines of Text | No | Description of the survey type | |

### 9. Customers Table (nms_customers)
**Purpose**: Master data for customer companies.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_customerid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_name | Single Line of Text (100) | Yes | Company name | Must be unique |
| nms_type | Choice | Yes | Customer type | |
| nms_address | Multiple Lines of Text | No | Company address | |
| nms_city | Single Line of Text (50) | No | City | |
| nms_postalcode | Single Line of Text (20) | No | Postal code | |
| nms_country | Single Line of Text (50) | No | Country | |
| nms_phone | Single Line of Text (20) | No | Phone number | |
| nms_email | Single Line of Text (100) | No | Contact email | Email format validation |
| nms_website | Single Line of Text (100) | No | Company website | |
| nms_vatnumber | Single Line of Text (50) | No | VAT number | |
| nms_notes | Multiple Lines of Text | No | Additional notes | |
| nms_isactive | Two Options | Yes | Whether customer is active | Default: Yes |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |

**Choice Fields**:
- `nms_type`: Cargo Owner, Shipping Company, Oil Company, Port Authority, Other

### 10. Contact Persons Table (nms_contactpersons)
**Purpose**: Contact persons associated with customers.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_contactid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_customerid | Lookup (Customers) | Yes | Reference to customer | |
| nms_firstname | Single Line of Text (50) | Yes | First name | |
| nms_lastname | Single Line of Text (50) | Yes | Last name | |
| nms_name | Single Line of Text (100) | Yes | Full name (calculated) | Calculated: firstname + lastname |
| nms_title | Single Line of Text (50) | No | Job title | |
| nms_email | Single Line of Text (100) | No | Email address | Email format validation |
| nms_phone | Single Line of Text (20) | No | Phone number | |
| nms_mobile | Single Line of Text (20) | No | Mobile number | |
| nms_department | Single Line of Text (50) | No | Department | |
| nms_isprimary | Two Options | No | Primary contact for customer | Default: No |
| nms_isactive | Two Options | Yes | Whether contact is active | Default: Yes |
| nms_notes | Multiple Lines of Text | No | Additional notes | |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |

### 11. Products Table (nms_products)
**Purpose**: Master data for available products that can be selected in order lines.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_productid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_name | Single Line of Text (200) | Yes | Product name | Must be unique |
| nms_description | Multiple Lines of Text | No | Product description | |
| nms_category | Single Line of Text (100) | No | Product category | |
| nms_isactive | Two Options | Yes | Whether product is active | Default: Yes |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |

### 12. Ports Table (nms_ports)
**Purpose**: Master data for available ports/harbors.

| Field Name | Dataverse Type | Required | Description | Business Rules |
|------------|----------------|----------|-------------|----------------|
| nms_portid | Primary Key (GUID) | Yes | Unique identifier | Auto-generated |
| nms_name | Single Line of Text (200) | Yes | Port name | Must be unique |
| nms_country | Single Line of Text (100) | Yes | Country where port is located | |
| nms_region | Single Line of Text (100) | No | Region or state | |
| nms_isactive | Two Options | Yes | Whether port is active | Default: Yes |
| nms_createdat | Date and Time | Yes | Creation timestamp | |
| nms_updatedat | Date and Time | No | Last update timestamp | |

## Relationships

### Primary Relationships
1. **Orders → Ships**: One-to-Many (1:N)
   - `nms_ships.nms_orderid` → `nms_orders.nms_orderid`
   - Cascade Delete: Yes

2. **Ships → Ship Ports**: One-to-Many (1:N)
   - `nms_shipports.nms_shipid` → `nms_ships.nms_shipid`
   - Cascade Delete: Yes

3. **Ship Ports → Order Lines**: One-to-Many (1:N)
   - `nms_orderlines.nms_shipportid` → `nms_shipports.nms_shipportid`
   - Cascade Delete: Yes

4. **Ship Ports → Timelog Entries**: One-to-Many (1:N)
   - `nms_timelogentries.nms_shipportid` → `nms_shipports.nms_shipportid`
   - Cascade Delete: Yes

5. **Ship Ports → Sampling Records**: One-to-Many (1:N)
   - `nms_samplingrecords.nms_shipportid` → `nms_shipports.nms_shipportid`
   - Cascade Delete: Yes

6. **Ship Ports → Remarks**: One-to-Many (1:N)
   - `nms_remarks.nms_shipportid` → `nms_shipports.nms_shipportid`
   - Cascade Delete: Yes

### Master Data Relationships
7. **Customers → Contact Persons**: One-to-Many (1:N)
   - `nms_contactpersons.nms_customerid` → `nms_customers.nms_customerid`
   - Cascade Delete: Yes

8. **Ports → Ship Ports**: One-to-Many (1:N)
   - `nms_shipports.nms_portid` → `nms_ports.nms_portid`
   - Cascade Delete: No (Restrict)

## Business Rules for Dataverse

### Calculated Fields
1. **Orders.nms_totalships**: Count of related ships
2. **Orders.nms_totalports**: Count of related ship ports
3. **Order Lines.nms_totalprice**: `nms_quantity × nms_unitprice`
4. **Contact Persons.nms_name**: `nms_firstname + " " + nms_lastname`

### Validation Rules
1. **Order Number Format**: Must match pattern "ORD-YYYY-NNNN"
2. **Email Validation**: Must be valid email format
3. **IMO Number**: Must be 7 digits if provided
4. **Sequential Line Numbers**: Must be unique within each ship port
5. **Time Validation**: End time must be after start time
6. **Quantity Validation**: Must be greater than 0
7. **Price Validation**: Must be greater than or equal to 0

### Security Roles
1. **NMS Admin**: Full access to all tables
2. **NMS Surveyor**: Read/Write access to orders, ships, ship ports, timelog, sampling, remarks
3. **NMS Viewer**: Read-only access to all tables
4. **NMS Customer**: Read access to own orders only

### Power Platform Integration

#### Power Apps
- **Order Management App**: Main interface for order creation and management
- **Ship Tracking App**: Real-time ship and port status tracking
- **Survey Data Entry App**: Mobile app for field data collection

#### Power Automate Flows
1. **Order Creation Flow**: Auto-generate order numbers and send notifications
2. **Status Update Flow**: Notify stakeholders when order status changes
3. **Report Generation Flow**: Auto-generate loading/discharging reports
4. **Data Validation Flow**: Validate data integrity across related records

#### Power BI Dashboards
1. **Order Overview Dashboard**: High-level order status and metrics
2. **Ship Tracking Dashboard**: Real-time ship locations and status
3. **Survey Analytics Dashboard**: Survey completion rates and quality metrics
4. **Customer Analytics Dashboard**: Customer performance and satisfaction

## Implementation Steps

### Phase 1: Core Tables
1. Create Orders table
2. Create Ships table
3. Create Ship Ports table
4. Set up relationships between these tables

### Phase 2: Transaction Tables
1. Create Order Lines table
2. Create Timelog Entries table
3. Create Sampling Records table
4. Create Remarks table
5. Set up relationships to Ship Ports

### Phase 3: Master Data
1. Create Survey Types table
2. Create Customers table
3. Create Contact Persons table
4. Create Products table
5. Create Ports table
6. Set up relationships and populate initial data

### Phase 4: Security and Validation
1. Create security roles
2. Set up field-level security
3. Create business rules for validation
4. Set up calculated fields

### Phase 5: Power Platform Integration
1. Create Power Apps
2. Set up Power Automate flows
3. Create Power BI dashboards
4. Test end-to-end functionality

## Sample Data for Testing

### Survey Types
- Loading Survey
- Discharging Survey
- Pre-shipment Survey
- Cargo Damage Survey
- Loading and Lashing Survey

### Customer Types
- Cargo Owner
- Shipping Company
- Oil Company
- Port Authority
- Other

### Units of Measurement
- MT (Metric Tons)
- TEU (Twenty-foot Equivalent Units)
- M³ (Cubic Meters)
- KG (Kilograms)
- L (Liters)
- PCS (Pieces)

This specification provides a complete foundation for implementing the NMS system in Dataverse with all necessary tables, relationships, business rules, and integration points.
