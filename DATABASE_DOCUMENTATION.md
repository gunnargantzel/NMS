# NMS - Database Structure Documentation

## Overview
This document describes the complete database structure for the NMS (Order Management System) application. The system is designed to handle hierarchical orders where a main order can contain multiple sub-orders (ports/harbors), each with their own order lines, timelog entries, and sampling records.

## Table Structure

### 1. Orders Table
**Purpose**: Stores both main orders and sub-orders in a hierarchical structure.

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| order_number | String (50) | Yes | Human-readable order number | Format: "ORD-YYYY-NNNN" |
| client_name | String (100) | Yes | Customer company name | |
| client_email | String (100) | Yes | Customer contact email | |
| vessel_name | String (100) | Yes | Name of the vessel | |
| port | String (200) | Yes | Port name(s) | For main orders: comma-separated list |
| survey_type | String (50) | Yes | Type of survey to be performed | |
| status | Enum | Yes | Order status | Values: 'pending', 'in_progress', 'completed', 'cancelled' |
| created_by | String (50) | Yes | User who created the order | |
| created_at | DateTime | Yes | Creation timestamp | |
| updated_at | DateTime | No | Last update timestamp | |
| created_by_name | String (100) | No | Display name of creator | For UI display |
| parent_order_id | Integer (Foreign Key) | No | Reference to parent order | NULL for main orders, ID for sub-orders |
| is_main_order | Boolean | Yes | Indicates if this is a main order | true = main order, false = sub-order |
| total_ports | Integer | No | Total number of ports in order chain | Only for main orders |
| current_port_index | Integer | No | Current port being processed | Only for sub-orders |
| remarks | Text | No | Additional notes | |
| vessel_imo | String (20) | No | Vessel IMO number | International Maritime Organization number |
| vessel_flag | String (50) | No | Vessel flag state | Country of registration |
| expected_arrival | DateTime | No | Expected arrival time | |
| expected_departure | DateTime | No | Expected departure time | |

**Relationships**:
- Self-referencing: `parent_order_id` → `Orders.id`
- One-to-many: Main orders can have multiple sub-orders
- One-to-many: Orders can have multiple timelog entries
- One-to-many: Orders can have multiple sampling records

### 2. Order Lines Table
**Purpose**: Stores individual line items for each sub-order (port/harbor).

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| sub_order_id | Integer (Foreign Key) | Yes | Reference to sub-order | Links to Orders.id where is_main_order = false |
| line_number | Integer | Yes | Line number within the sub-order | Sequential numbering per sub-order |
| description | String (200) | Yes | Description of the cargo/item | |
| quantity | Decimal(10,2) | Yes | Quantity of the item | |
| unit | String (20) | Yes | Unit of measurement | e.g., 'MT', 'TEU', 'M³' |
| unit_price | Decimal(10,2) | Yes | Price per unit | |
| total_price | Decimal(12,2) | Yes | Total price for this line | Calculated: quantity × unit_price |
| cargo_type | String (50) | No | Type of cargo | e.g., 'Crude Oil', 'Container', 'Refined Product' |
| package_type | String (50) | No | Packaging type | e.g., 'Bulk', 'Container', 'Package' |
| weight | Decimal(10,2) | No | Weight in metric tons | |
| volume | Decimal(10,2) | No | Volume in cubic meters | |
| remarks | Text | No | Additional notes for this line | |
| created_at | DateTime | Yes | Creation timestamp | |

**Relationships**:
- Many-to-one: `sub_order_id` → `Orders.id` (where is_main_order = false)

### 3. Timelog Entries Table
**Purpose**: Tracks time spent on activities for each sub-order (port/harbor).

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| sub_order_id | Integer (Foreign Key) | Yes | Reference to sub-order | Links to Orders.id where is_main_order = false |
| activity | String (100) | Yes | Type of activity performed | |
| start_time | DateTime | Yes | When the activity started | |
| end_time | DateTime | No | When the activity ended | NULL for ongoing activities |
| remarks | Text | No | Additional notes about the activity | |
| created_by | String (50) | Yes | User who logged the time | |
| created_at | DateTime | Yes | Creation timestamp | |
| timestamp | DateTime | No | Legacy field for compatibility | Use start_time instead |
| created_by_name | String (100) | No | Display name of creator | For UI display |

**Relationships**:
- Many-to-one: `sub_order_id` → `Orders.id` (where is_main_order = false)

### 4. Sampling Records Table
**Purpose**: Stores laboratory sampling and analysis records for each sub-order (port/harbor).

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| sub_order_id | Integer (Foreign Key) | Yes | Reference to sub-order | Links to Orders.id where is_main_order = false |
| sample_number | String (50) | Yes | Unique sample identifier | |
| sample_type | String (50) | Yes | Type of sample taken | |
| laboratory | String (100) | Yes | Laboratory performing analysis | |
| analysis_type | String (100) | Yes | Type of analysis performed | |
| results | Text | No | Analysis results | |
| notes | Text | No | Additional notes | |
| created_at | DateTime | Yes | Creation timestamp | |
| updated_at | DateTime | No | Last update timestamp | |

**Relationships**:
- Many-to-one: `sub_order_id` → `Orders.id` (where is_main_order = false)

### 5. Survey Types Table
**Purpose**: Master data for available survey types.

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| name | String (50) | Yes | Survey type name | |
| description | String (200) | No | Description of the survey type | |

**Relationships**:
- One-to-many: Survey types can be used by multiple orders

### 6. Customers Table
**Purpose**: Master data for customer companies.

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| name | String (100) | Yes | Company name | |
| type | String (50) | Yes | Customer type | e.g., 'Shipping Company', 'Oil Company', 'Port Authority' |
| address | String (200) | No | Company address | |
| city | String (50) | No | City | |
| postal_code | String (20) | No | Postal code | |
| country | String (50) | No | Country | |
| phone | String (20) | No | Phone number | |
| email | String (100) | No | Contact email | |
| website | String (100) | No | Company website | |
| notes | Text | No | Additional notes | |
| created_at | DateTime | Yes | Creation timestamp | |
| updated_at | DateTime | No | Last update timestamp | |

**Relationships**:
- One-to-many: Customers can have multiple orders
- One-to-many: Customers can have multiple contact persons

### 7. Contact Persons Table
**Purpose**: Contact persons associated with customers.

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| customer_id | Integer (Foreign Key) | Yes | Reference to customer | Links to Customers.id |
| first_name | String (50) | Yes | First name | |
| last_name | String (50) | Yes | Last name | |
| title | String (50) | No | Job title | |
| email | String (100) | No | Email address | |
| phone | String (20) | No | Phone number | |
| mobile | String (20) | No | Mobile number | |
| department | String (50) | No | Department | |
| is_primary | Boolean | No | Primary contact for customer | |
| notes | Text | No | Additional notes | |
| created_at | DateTime | Yes | Creation timestamp | |
| updated_at | DateTime | No | Last update timestamp | |

**Relationships**:
- Many-to-one: `customer_id` → `Customers.id`

### 8. Remarks Table
**Purpose**: Stores port-specific remarks and notes for each sub-order.

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| sub_order_id | Integer (Foreign Key) | Yes | Reference to sub-order | Links to Orders.id where is_main_order = false |
| content | Text | Yes | Remark content | |
| created_by | String (50) | Yes | User who created the remark | |
| created_at | DateTime | Yes | Creation timestamp | |
| updated_at | DateTime | No | Last update timestamp | |

**Relationships**:
- Many-to-one: `sub_order_id` → `Orders.id` (where is_main_order = false)

### 9. Products Table
**Purpose**: Master data for available products that can be selected in order lines.

| Field Name | Data Type | Required | Description | Notes |
|------------|-----------|----------|-------------|-------|
| id | Integer (Primary Key) | Yes | Unique identifier | Auto-increment |
| name | String (200) | Yes | Product name | |
| description | Text | No | Product description | |
| category | String (100) | No | Product category | |
| is_active | Boolean | Yes | Whether product is active | |
| created_at | DateTime | Yes | Creation timestamp | |
| updated_at | DateTime | No | Last update timestamp | |

**Relationships**:
- One-to-many: Products can be used in multiple order lines

## Data Relationships Diagram

```
Customers (1) ──────── (M) Contact Persons
    │
    │ (1)
    │
    ▼
Orders (Main Orders)
    │
    │ (1)
    │
    ▼
Orders (Sub-Orders) ──── (M) Order Lines ──── (M) Products
    │
    │ (1) ──── (M) Timelog Entries
    │
    │ (1) ──── (M) Sampling Records
    │
    │ (1) ──── (M) Remarks

Survey Types (1) ──────── (M) Orders
```

## Business Rules

### Order Hierarchy
1. **Main Orders**: Represent the overall project/cargo movement
2. **Sub-Orders**: Represent individual ports/harbors within the main order
3. **Order Lines**: Belong to specific sub-orders (ports), not main orders
4. **Products**: Master data referenced by order lines for consistent product naming
5. **Timelog Entries**: Belong to specific sub-orders (ports), not main orders
6. **Sampling Records**: Belong to specific sub-orders (ports), not main orders
7. **Remarks**: Belong to specific sub-orders (ports), not main orders

### Data Integrity Rules
1. `parent_order_id` must be NULL for main orders
2. `parent_order_id` must reference a valid main order for sub-orders
3. `is_main_order` must be true when `parent_order_id` is NULL
4. `is_main_order` must be false when `parent_order_id` is not NULL
5. `sub_order_id` in Order Lines must reference a sub-order (is_main_order = false)
6. `sub_order_id` in Timelog Entries must reference a sub-order (is_main_order = false)
7. `sub_order_id` in Sampling Records must reference a sub-order (is_main_order = false)
8. `sub_order_id` in Remarks must reference a sub-order (is_main_order = false)
9. Order line numbers must be sequential within each sub-order
10. Product names must be unique and non-empty
11. Only active products can be selected in order lines

### Status Workflow
- **pending**: Order created but not started
- **in_progress**: Work has begun on the order
- **completed**: All work finished
- **cancelled**: Order cancelled before completion

## Sample Data Structure

### Main Order Example
```
Order ID: 1
Order Number: "ORD-2024-0001"
Client: "Statoil ASA"
Vessel: "MS Nordkapp"
Port: "Bergen, Stavanger, Oslo"
Survey Type: "Cargo Survey"
Status: "in_progress"
is_main_order: true
parent_order_id: NULL
```

### Sub-Orders Example
```
Sub-Order 1 (Bergen):
- ID: 2
- parent_order_id: 1
- is_main_order: false
- port: "Bergen"
- current_port_index: 1

Sub-Order 2 (Stavanger):
- ID: 3
- parent_order_id: 1
- is_main_order: false
- port: "Stavanger"
- current_port_index: 2
```

### Order Lines Example
```
Order Line 1:
- sub_order_id: 2 (Bergen)
- description: "Crude Oil - Brent Blend"
- quantity: 25000
- unit: "MT"
- unit_price: 85.50

Order Line 2:
- sub_order_id: 3 (Stavanger)
- description: "Crude Oil - Brent Blend"
- quantity: 25000
- unit: "MT"
- unit_price: 85.50
```

## DataVerse Migration Notes

When migrating to DataVerse, consider the following:

### Table Names
- Use PascalCase: `Orders`, `OrderLines`, `TimelogEntries`, etc.
- Prefix with solution prefix if needed: `NMS_Orders`, `NMS_OrderLines`

### Field Types
- Integer → Whole Number
- String → Single Line of Text / Multiple Lines of Text
- DateTime → Date and Time
- Boolean → Two Options
- Decimal → Currency / Decimal Number
- Text → Multiple Lines of Text

### Relationships
- Foreign Keys → Lookup fields
- Self-referencing relationships supported in DataVerse
- Use "Cascade Delete" for dependent records

### Security
- Create security roles for different user types
- Set field-level security for sensitive data
- Use business rules for data validation

### Power Platform Integration
- Create Power Apps for data entry
- Use Power Automate for workflow automation
- Set up Power BI dashboards for reporting

This structure provides a solid foundation for the NMS system and can be easily adapted to DataVerse while maintaining all business logic and relationships.
