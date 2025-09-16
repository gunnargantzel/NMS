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
  }
};
