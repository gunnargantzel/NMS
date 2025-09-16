// Mock API service for demo purposes
// This replaces all backend API calls with mock data

export interface Order {
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
  created_by_name?: string; // For compatibility with existing code
  // Hierarchical order structure
  parent_order_id?: number; // null for main orders, number for sub-orders
  is_main_order: boolean; // true for main orders, false for sub-orders
  sub_orders?: Order[]; // Array of sub-orders (only for main orders)
  total_ports?: number; // Total number of ports in the order chain
  current_port_index?: number; // Current port being processed (for sub-orders)
}

export interface SurveyType {
  id: number;
  name: string;
  description: string;
}

export interface TimelogEntry {
  id: number;
  order_id: number;
  activity: string;
  start_time: string;
  end_time?: string;
  remarks?: string;
  created_by: string;
  created_at: string;
  timestamp?: string; // For compatibility with existing code
  created_by_name?: string; // For compatibility with existing code
}

export interface SamplingRecord {
  id: number;
  order_id: number;
  sample_number: string;
  sample_type: string;
  laboratory: string;
  analysis_type: string;
  status: string;
  created_by: string;
  created_at: string;
  quantity?: string; // For compatibility with existing code
  destination?: string; // For compatibility with existing code
  seal_number?: string; // For compatibility with existing code
  remarks?: string; // For compatibility with existing code
  created_by_name?: string; // For compatibility with existing code
}

export interface Customer {
  id: number;
  name: string;
  type: 'shipping_company' | 'cargo_owner' | 'port_authority' | 'other';
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  is_active: boolean;
}

export interface ContactPerson {
  id: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  title?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email: string;
  is_primary: boolean;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderLine {
  id: number;
  sub_order_id: number; // Changed from order_id to sub_order_id - order lines belong to specific ports/harbors
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

// Mock data with hierarchical order structure
const mockOrders: Order[] = [
  // Main Order 1: Multi-port cargo survey
  {
    id: 1,
    order_number: 'ORD-20241201-001',
    client_name: 'Statoil ASA',
    client_email: 'cargo@statoil.com',
    vessel_name: 'M/T Nordic Star',
    port: 'Multi-port Survey',
    survey_type: 'Cargo damage survey',
    status: 'in_progress',
    created_by: 'admin',
    created_at: '2024-12-01T08:00:00Z',
    created_by_name: 'admin',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 3,
    sub_orders: [
      {
        id: 11,
        order_number: 'ORD-20241201-001-1',
        client_name: 'Statoil ASA',
        client_email: 'cargo@statoil.com',
        vessel_name: 'M/T Nordic Star',
        port: 'Stavanger',
        survey_type: 'Cargo damage survey',
        status: 'completed',
        created_by: 'admin',
        created_at: '2024-12-01T08:00:00Z',
        created_by_name: 'admin',
        parent_order_id: 1,
        is_main_order: false,
        current_port_index: 1,
        total_ports: 3
      },
      {
        id: 12,
        order_number: 'ORD-20241201-001-2',
        client_name: 'Statoil ASA',
        client_email: 'cargo@statoil.com',
        vessel_name: 'M/T Nordic Star',
        port: 'Bergen',
        survey_type: 'Cargo damage survey',
        status: 'in_progress',
        created_by: 'admin',
        created_at: '2024-12-01T10:00:00Z',
        created_by_name: 'admin',
        parent_order_id: 1,
        is_main_order: false,
        current_port_index: 2,
        total_ports: 3
      },
      {
        id: 13,
        order_number: 'ORD-20241201-001-3',
        client_name: 'Statoil ASA',
        client_email: 'cargo@statoil.com',
        vessel_name: 'M/T Nordic Star',
        port: 'Oslo',
        survey_type: 'Cargo damage survey',
        status: 'pending',
        created_by: 'admin',
        created_at: '2024-12-01T12:00:00Z',
        created_by_name: 'admin',
        parent_order_id: 1,
        is_main_order: false,
        current_port_index: 3,
        total_ports: 3
      }
    ]
  },
  // Main Order 2: Single port survey
  {
    id: 2,
    order_number: 'ORD-20241201-002',
    client_name: 'Equinor',
    client_email: 'shipping@equinor.com',
    vessel_name: 'M/T North Sea',
    port: 'Bergen',
    survey_type: 'Loading and lashing survey',
    status: 'pending',
    created_by: 'admin',
    created_at: '2024-12-01T09:30:00Z',
    created_by_name: 'admin',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 1
  },
  // Main Order 3: Multi-port bunker survey
  {
    id: 3,
    order_number: 'ORD-20241201-003',
    client_name: 'Aker BP',
    client_email: 'operations@akerbp.com',
    vessel_name: 'M/T Norwegian Spirit',
    port: 'Multi-port Bunker Survey',
    survey_type: 'Bunker survey',
    status: 'completed',
    created_by: 'surveyor1',
    created_at: '2024-11-30T14:15:00Z',
    created_by_name: 'surveyor1',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 2,
    sub_orders: [
      {
        id: 31,
        order_number: 'ORD-20241201-003-1',
        client_name: 'Aker BP',
        client_email: 'operations@akerbp.com',
        vessel_name: 'M/T Norwegian Spirit',
        port: 'Trondheim',
        survey_type: 'Bunker survey',
        status: 'completed',
        created_by: 'surveyor1',
        created_at: '2024-11-30T14:15:00Z',
        created_by_name: 'surveyor1',
        parent_order_id: 3,
        is_main_order: false,
        current_port_index: 1,
        total_ports: 2
      },
      {
        id: 32,
        order_number: 'ORD-20241201-003-2',
        client_name: 'Aker BP',
        client_email: 'operations@akerbp.com',
        vessel_name: 'M/T Norwegian Spirit',
        port: 'Kristiansand',
        survey_type: 'Bunker survey',
        status: 'completed',
        created_by: 'surveyor1',
        created_at: '2024-11-30T16:30:00Z',
        created_by_name: 'surveyor1',
        parent_order_id: 3,
        is_main_order: false,
        current_port_index: 2,
        total_ports: 2
      }
    ]
  },
  // Main Order 4: Single port condition survey
  {
    id: 4,
    order_number: 'ORD-20241201-004',
    client_name: 'Lundin Energy',
    client_email: 'marine@lundinenergy.com',
    vessel_name: 'M/T Edvard Grieg',
    port: 'Oslo',
    survey_type: 'Condition survey',
    status: 'in_progress',
    created_by: 'surveyor2',
    created_at: '2024-11-30T16:45:00Z',
    created_by_name: 'surveyor2',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 1
  },
  // Main Order 5: Multi-port pre-loading survey
  {
    id: 5,
    order_number: 'ORD-20241201-005',
    client_name: 'Vår Energi',
    client_email: 'shipping@varenergi.no',
    vessel_name: 'M/T Balder',
    port: 'Multi-port Pre-loading',
    survey_type: 'Pre-loading survey',
    status: 'pending',
    created_by: 'admin',
    created_at: '2024-12-01T11:20:00Z',
    created_by_name: 'admin',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 4,
    sub_orders: [
      {
        id: 51,
        order_number: 'ORD-20241201-005-1',
        client_name: 'Vår Energi',
        client_email: 'shipping@varenergi.no',
        vessel_name: 'M/T Balder',
        port: 'Kristiansand',
        survey_type: 'Pre-loading survey',
        status: 'pending',
        created_by: 'admin',
        created_at: '2024-12-01T11:20:00Z',
        created_by_name: 'admin',
        parent_order_id: 5,
        is_main_order: false,
        current_port_index: 1,
        total_ports: 4
      },
      {
        id: 52,
        order_number: 'ORD-20241201-005-2',
        client_name: 'Vår Energi',
        client_email: 'shipping@varenergi.no',
        vessel_name: 'M/T Balder',
        port: 'Stavanger',
        survey_type: 'Pre-loading survey',
        status: 'pending',
        created_by: 'admin',
        created_at: '2024-12-01T13:00:00Z',
        created_by_name: 'admin',
        parent_order_id: 5,
        is_main_order: false,
        current_port_index: 2,
        total_ports: 4
      },
      {
        id: 53,
        order_number: 'ORD-20241201-005-3',
        client_name: 'Vår Energi',
        client_email: 'shipping@varenergi.no',
        vessel_name: 'M/T Balder',
        port: 'Bergen',
        survey_type: 'Pre-loading survey',
        status: 'pending',
        created_by: 'admin',
        created_at: '2024-12-01T14:30:00Z',
        created_by_name: 'admin',
        parent_order_id: 5,
        is_main_order: false,
        current_port_index: 3,
        total_ports: 4
      },
      {
        id: 54,
        order_number: 'ORD-20241201-005-4',
        client_name: 'Vår Energi',
        client_email: 'shipping@varenergi.no',
        vessel_name: 'M/T Balder',
        port: 'Trondheim',
        survey_type: 'Pre-loading survey',
        status: 'pending',
        created_by: 'admin',
        created_at: '2024-12-01T16:00:00Z',
        created_by_name: 'admin',
        parent_order_id: 5,
        is_main_order: false,
        current_port_index: 4,
        total_ports: 4
      }
    ]
  }
];

const mockSurveyTypes: SurveyType[] = [
  { id: 1, name: 'Cargo damage survey', description: 'Assessment of cargo damage and condition' },
  { id: 2, name: 'Loading and lashing survey', description: 'Verification of cargo loading and securing' },
  { id: 3, name: 'Bunker survey', description: 'Measurement of fuel oil and diesel quantities' },
  { id: 4, name: 'Condition survey', description: 'General condition assessment of vessel and cargo' },
  { id: 5, name: 'Pre-loading survey', description: 'Inspection before cargo loading operations' },
  { id: 6, name: 'Post-discharge survey', description: 'Inspection after cargo discharge' },
  { id: 7, name: 'On/off hire survey', description: 'Vessel condition at charter commencement/termination' }
];

const mockActivities = [
  'Vessel berthed',
  'Surveyor on board',
  'Cargo inspection started',
  'Cargo inspection completed',
  'Documentation review',
  'Client meeting',
  'Report preparation',
  'Survey completed'
];

const mockTimelogEntries: TimelogEntry[] = [
  {
    id: 1,
    order_id: 1,
    activity: 'Vessel berthed',
    start_time: '2024-12-01T08:00:00Z',
    end_time: '2024-12-01T08:15:00Z',
    remarks: 'Vessel arrived on schedule',
    created_by: 'admin',
    created_at: '2024-12-01T08:00:00Z',
    timestamp: '2024-12-01T08:00:00Z',
    created_by_name: 'admin'
  },
  {
    id: 2,
    order_id: 1,
    activity: 'Surveyor on board',
    start_time: '2024-12-01T08:15:00Z',
    end_time: '2024-12-01T08:30:00Z',
    remarks: 'Safety briefing completed',
    created_by: 'admin',
    created_at: '2024-12-01T08:15:00Z',
    timestamp: '2024-12-01T08:15:00Z',
    created_by_name: 'admin'
  },
  {
    id: 3,
    order_id: 1,
    activity: 'Cargo inspection started',
    start_time: '2024-12-01T08:30:00Z',
    created_by: 'admin',
    created_at: '2024-12-01T08:30:00Z',
    timestamp: '2024-12-01T08:30:00Z',
    created_by_name: 'admin'
  }
];

const mockSamplingRecords: SamplingRecord[] = [
  {
    id: 1,
    order_id: 1,
    sample_number: 'S-2024-001',
    sample_type: 'Fuel Oil',
    laboratory: 'Denofa',
    analysis_type: 'Sulfur Content',
    status: 'Pending',
    created_by: 'admin',
    created_at: '2024-12-01T09:00:00Z',
    quantity: '1 liter',
    destination: 'Denofa Laboratory',
    seal_number: 'SEAL-001',
    remarks: 'Standard fuel oil sample',
    created_by_name: 'admin'
  },
  {
    id: 2,
    order_id: 1,
    sample_number: 'S-2024-002',
    sample_type: 'Diesel',
    laboratory: 'Eurofins',
    analysis_type: 'Quality Check',
    status: 'Completed',
    created_by: 'admin',
    created_at: '2024-12-01T09:15:00Z',
    quantity: '500ml',
    destination: 'Eurofins Laboratory',
    seal_number: 'SEAL-002',
    remarks: 'Diesel quality sample',
    created_by_name: 'admin'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Statoil ASA',
    type: 'cargo_owner',
    address: 'Stavanger gate 41',
    postal_code: '4006',
    city: 'Stavanger',
    country: 'Norway',
    phone: '+47 51 99 00 00',
    email: 'contact@statoil.com',
    website: 'https://www.equinor.com',
    vat_number: 'NO 923 609 016 MVA',
    notes: 'Major oil and gas company',
    created_at: '2024-01-15T10:00:00Z',
    is_active: true
  },
  {
    id: 2,
    name: 'Equinor ASA',
    type: 'cargo_owner',
    address: 'Forusbeen 50',
    postal_code: '4035',
    city: 'Stavanger',
    country: 'Norway',
    phone: '+47 51 99 00 00',
    email: 'shipping@equinor.com',
    website: 'https://www.equinor.com',
    vat_number: 'NO 923 609 016 MVA',
    notes: 'International energy company',
    created_at: '2024-01-20T10:00:00Z',
    is_active: true
  },
  {
    id: 3,
    name: 'Aker BP ASA',
    type: 'cargo_owner',
    address: 'Oksenøyveien 10',
    postal_code: '1366',
    city: 'Lysaker',
    country: 'Norway',
    phone: '+47 51 35 30 00',
    email: 'operations@akerbp.com',
    website: 'https://www.akerbp.com',
    vat_number: 'NO 917 632 033 MVA',
    notes: 'Independent oil and gas company',
    created_at: '2024-02-01T10:00:00Z',
    is_active: true
  },
  {
    id: 4,
    name: 'Lundin Energy Norway AS',
    type: 'cargo_owner',
    address: 'Strandveien 4',
    postal_code: '1366',
    city: 'Lysaker',
    country: 'Norway',
    phone: '+47 67 10 00 00',
    email: 'marine@lundinenergy.com',
    website: 'https://www.lundin-energy.com',
    vat_number: 'NO 996 538 067 MVA',
    notes: 'Independent oil and gas exploration company',
    created_at: '2024-02-15T10:00:00Z',
    is_active: true
  },
  {
    id: 5,
    name: 'Maersk Line',
    type: 'shipping_company',
    address: 'Esplanaden 50',
    postal_code: '1263',
    city: 'Copenhagen',
    country: 'Denmark',
    phone: '+45 33 63 33 63',
    email: 'contact@maersk.com',
    website: 'https://www.maersk.com',
    vat_number: 'DK 22 75 60 04',
    notes: 'Global container shipping company',
    created_at: '2024-03-01T10:00:00Z',
    is_active: true
  }
];

const mockContactPersons: ContactPerson[] = [
  {
    id: 1,
    customer_id: 1,
    first_name: 'Lars',
    last_name: 'Hansen',
    title: 'Cargo Operations Manager',
    department: 'Marine Operations',
    phone: '+47 51 99 00 01',
    mobile: '+47 901 23 456',
    email: 'lars.hansen@statoil.com',
    is_primary: true,
    is_active: true,
    notes: 'Primary contact for cargo operations',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    customer_id: 1,
    first_name: 'Anne',
    last_name: 'Olsen',
    title: 'Quality Manager',
    department: 'Quality Assurance',
    phone: '+47 51 99 00 02',
    mobile: '+47 902 34 567',
    email: 'anne.olsen@statoil.com',
    is_primary: false,
    is_active: true,
    notes: 'Contact for quality and sampling issues',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 3,
    customer_id: 2,
    first_name: 'Erik',
    last_name: 'Nordahl',
    title: 'Shipping Coordinator',
    department: 'Logistics',
    phone: '+47 51 99 00 10',
    mobile: '+47 903 45 678',
    email: 'erik.nordahl@equinor.com',
    is_primary: true,
    is_active: true,
    notes: 'Main shipping coordinator',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 4,
    customer_id: 3,
    first_name: 'Kristine',
    last_name: 'Berg',
    title: 'Operations Manager',
    department: 'Marine Operations',
    phone: '+47 51 35 30 01',
    mobile: '+47 904 56 789',
    email: 'kristine.berg@akerbp.com',
    is_primary: true,
    is_active: true,
    notes: 'Responsible for marine operations',
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 5,
    customer_id: 4,
    first_name: 'Thomas',
    last_name: 'Andersen',
    title: 'Marine Advisor',
    department: 'Technical',
    phone: '+47 67 10 00 01',
    mobile: '+47 905 67 890',
    email: 'thomas.andersen@lundinenergy.com',
    is_primary: true,
    is_active: true,
    notes: 'Technical marine advisor',
    created_at: '2024-02-15T10:00:00Z'
  },
  {
    id: 6,
    customer_id: 5,
    first_name: 'Peter',
    last_name: 'Nielsen',
    title: 'Port Captain',
    department: 'Operations',
    phone: '+45 33 63 33 64',
    mobile: '+45 20 12 34 56',
    email: 'peter.nielsen@maersk.com',
    is_primary: true,
    is_active: true,
    notes: 'Port operations manager',
    created_at: '2024-03-01T10:00:00Z'
  }
];

const mockOrderLines: OrderLine[] = [
  // Order lines for Sub-order 2 (Bergen Port - Main Order 1)
  {
    id: 1,
    sub_order_id: 2, // Bergen Port
    line_number: 1,
    description: 'Crude Oil - Brent Blend',
    quantity: 25000,
    unit: 'MT',
    unit_price: 85.50,
    total_price: 2137500,
    cargo_type: 'Crude Oil',
    package_type: 'Bulk',
    weight: 25000,
    volume: 29000,
    remarks: 'API Gravity 38.3° - Bergen loading',
    created_at: '2024-12-01T08:00:00Z'
  },
  {
    id: 2,
    sub_order_id: 2, // Bergen Port
    line_number: 2,
    description: 'Marine Gas Oil',
    quantity: 1000,
    unit: 'MT',
    unit_price: 120.00,
    total_price: 120000,
    cargo_type: 'Refined Product',
    package_type: 'Bulk',
    weight: 1000,
    volume: 1200,
    remarks: 'Bunker fuel for vessel - Bergen',
    created_at: '2024-12-01T08:00:00Z'
  },
  // Order lines for Sub-order 3 (Stavanger Port - Main Order 1)
  {
    id: 3,
    sub_order_id: 3, // Stavanger Port
    line_number: 1,
    description: 'Crude Oil - Brent Blend',
    quantity: 25000,
    unit: 'MT',
    unit_price: 85.50,
    total_price: 2137500,
    cargo_type: 'Crude Oil',
    package_type: 'Bulk',
    weight: 25000,
    volume: 29000,
    remarks: 'API Gravity 38.3° - Stavanger loading',
    created_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 4,
    sub_order_id: 3, // Stavanger Port
    line_number: 2,
    description: 'Marine Gas Oil',
    quantity: 1000,
    unit: 'MT',
    unit_price: 120.00,
    total_price: 120000,
    cargo_type: 'Refined Product',
    package_type: 'Bulk',
    weight: 1000,
    volume: 1200,
    remarks: 'Bunker fuel for vessel - Stavanger',
    created_at: '2024-12-01T10:00:00Z'
  },
  // Order lines for Sub-order 4 (Oslo Port - Main Order 1)
  {
    id: 5,
    sub_order_id: 4, // Oslo Port
    line_number: 1,
    description: 'Container Cargo - Mixed',
    quantity: 75,
    unit: 'TEU',
    unit_price: 1500.00,
    total_price: 112500,
    cargo_type: 'Container',
    package_type: 'Container',
    remarks: 'Mixed container cargo - Oslo',
    created_at: '2024-12-01T12:00:00Z'
  },
  // Order lines for Sub-order 5 (Hamburg Port - Main Order 2)
  {
    id: 6,
    sub_order_id: 5, // Hamburg Port
    line_number: 1,
    description: 'Container Cargo - Electronics',
    quantity: 50,
    unit: 'TEU',
    unit_price: 2000.00,
    total_price: 100000,
    cargo_type: 'Container',
    package_type: 'Container',
    remarks: 'Electronics and consumer goods',
    created_at: '2024-12-01T14:00:00Z'
  },
  {
    id: 7,
    sub_order_id: 5, // Hamburg Port
    line_number: 2,
    description: 'Container Cargo - Machinery',
    quantity: 25,
    unit: 'TEU',
    unit_price: 1800.00,
    total_price: 45000,
    cargo_type: 'Container',
    package_type: 'Container',
    remarks: 'Industrial machinery parts',
    created_at: '2024-12-01T14:00:00Z'
  },
  // Order lines for Sub-order 6 (Rotterdam Port - Main Order 2)
  {
    id: 8,
    sub_order_id: 6, // Rotterdam Port
    line_number: 1,
    description: 'Container Cargo - Textiles',
    quantity: 40,
    unit: 'TEU',
    unit_price: 1200.00,
    total_price: 48000,
    cargo_type: 'Container',
    package_type: 'Container',
    remarks: 'Textile products and clothing',
    created_at: '2024-12-01T16:00:00Z'
  }
];

// Mock API functions
export const mockApi = {
  // Orders
  getOrders: async (params: any = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // Get only main orders for the main list
    let filteredOrders = mockOrders.filter(order => order.is_main_order);
    
    if (params.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status);
    }
    
    if (params.survey_type) {
      filteredOrders = filteredOrders.filter(order => order.survey_type === params.survey_type);
    }
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.client_name.toLowerCase().includes(search) ||
        order.order_number.toLowerCase().includes(search) ||
        order.vessel_name.toLowerCase().includes(search)
      );
    }
    
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / limit)
      }
    };
  },

  getOrder: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // First try to find main order
    let order = mockOrders.find(o => o.id === id);
    
    // If not found, search in sub-orders
    if (!order) {
      for (const mainOrder of mockOrders) {
        if (mainOrder.sub_orders) {
          const subOrder = mainOrder.sub_orders.find(sub => sub.id === id);
          if (subOrder) {
            order = subOrder;
            break;
          }
        }
      }
    }
    
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },

  createOrder: async (orderData: Partial<Order>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOrder: Order = {
      id: mockOrders.length + 1,
      order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      status: 'pending',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      ...orderData
    } as Order;
    
    mockOrders.push(newOrder);
    return {
      message: 'Order created successfully',
      orderId: newOrder.id,
      orderNumber: newOrder.order_number
    };
  },

  updateOrder: async (id: number, orderData: Partial<Order>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...orderData,
      updated_at: new Date().toISOString()
    };
    
    return {
      message: 'Order updated successfully',
      order: mockOrders[orderIndex]
    };
  },

  deleteOrder: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    mockOrders.splice(orderIndex, 1);
    return { message: 'Order deleted successfully' };
  },

  // Survey Types
  getSurveyTypes: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSurveyTypes;
  },

  createSurveyType: async (surveyTypeData: Partial<SurveyType>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newSurveyType: SurveyType = {
      id: mockSurveyTypes.length + 1,
      ...surveyTypeData
    } as SurveyType;
    
    mockSurveyTypes.push(newSurveyType);
    return {
      message: 'Survey type created successfully',
      surveyType: newSurveyType
    };
  },

  // Timelog
  getTimelogEntries: async (orderId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entries = mockTimelogEntries.filter(entry => entry.order_id === orderId);
    return { entries };
  },

  getActivities: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockActivities.map(activity => ({ activity }));
  },

  createTimelogEntry: async (entryData: Partial<TimelogEntry>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newEntry: TimelogEntry = {
      id: mockTimelogEntries.length + 1,
      created_by: 'admin',
      created_at: new Date().toISOString(),
      timestamp: entryData.start_time || new Date().toISOString(),
      created_by_name: 'admin',
      ...entryData
    } as TimelogEntry;
    
    mockTimelogEntries.push(newEntry);
    return {
      message: 'Timelog entry created successfully',
      entry: newEntry
    };
  },

  // Sampling
  getSamplingRecords: async (orderId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSamplingRecords.filter(record => record.order_id === orderId);
  },

  createSamplingRecord: async (recordData: Partial<SamplingRecord>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newRecord: SamplingRecord = {
      id: mockSamplingRecords.length + 1,
      created_by: 'admin',
      created_at: new Date().toISOString(),
      created_by_name: 'admin',
      quantity: '1 liter',
      destination: 'Demo Laboratory',
      seal_number: `SEAL-${Date.now()}`,
      remarks: 'Demo sample',
      ...recordData
    } as SamplingRecord;
    
    mockSamplingRecords.push(newRecord);
    return {
      message: 'Sampling record created successfully',
      record: newRecord
    };
  },


  // Customers
  getCustomers: async (params: any = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    let filteredCustomers = mockCustomers.filter(customer => customer.is_active);
    
    if (params.search) {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(params.search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    if (params.type) {
      filteredCustomers = filteredCustomers.filter(customer => customer.type === params.type);
    }
    
    return filteredCustomers;
  },

  getCustomer: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  },

  createCustomer: async (customerData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newCustomer = {
      id: mockCustomers.length + 1,
      created_at: new Date().toISOString(),
      is_active: true,
      ...customerData
    } as Customer;
    
    mockCustomers.push(newCustomer);
    return {
      message: 'Customer created successfully',
      customer: newCustomer
    };
  },

  // Contact Persons
  getContactPersons: async (customerId?: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    let filteredContacts = mockContactPersons.filter(contact => contact.is_active);
    
    if (customerId) {
      filteredContacts = filteredContacts.filter(contact => contact.customer_id === customerId);
    }
    
    return filteredContacts;
  },

  createContactPerson: async (contactData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newContact = {
      id: mockContactPersons.length + 1,
      created_at: new Date().toISOString(),
      is_active: true,
      is_primary: false,
      ...contactData
    } as ContactPerson;
    
    mockContactPersons.push(newContact);
    return {
      message: 'Contact person created successfully',
      contact: newContact
    };
  },

  // Order Lines
  getOrderLines: async (subOrderId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOrderLines.filter(line => line.sub_order_id === subOrderId);
  },

  createOrderLine: async (lineData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newLine = {
      id: mockOrderLines.length + 1,
      line_number: mockOrderLines.filter(l => l.sub_order_id === lineData.sub_order_id).length + 1,
      created_at: new Date().toISOString(),
      ...lineData
    } as OrderLine;
    
    mockOrderLines.push(newLine);
    return {
      message: 'Order line created successfully',
      line: newLine
    };
  },

  updateOrderLine: async (id: number, lineData: Partial<OrderLine>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lineIndex = mockOrderLines.findIndex(l => l.id === id);
    if (lineIndex === -1) {
      throw new Error('Order line not found');
    }
    
    mockOrderLines[lineIndex] = {
      ...mockOrderLines[lineIndex],
      ...lineData
    };
    
    return {
      message: 'Order line updated successfully',
      line: mockOrderLines[lineIndex]
    };
  },

  deleteOrderLine: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lineIndex = mockOrderLines.findIndex(l => l.id === id);
    if (lineIndex === -1) {
      throw new Error('Order line not found');
    }
    
    mockOrderLines.splice(lineIndex, 1);
    return { message: 'Order line deleted successfully' };
  }
};
