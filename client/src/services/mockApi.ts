// Mock API service for demo purposes
// This replaces all backend API calls with mock data

import { mockProducts } from '../data/mockProducts';
import { mockPorts } from '../data/mockPorts';
import { 
  Order, 
  OrderLine, 
  Customer, 
  ContactPerson, 
  SurveyType, 
  Product, 
  Port, 
  TimelogEntry, 
  SamplingRecord,
  Ship,
  ShipPort,
  Remark
} from '../types';

// Mock data with multi-ship order structure
const mockOrders: Order[] = [
  // Order 1: Single ship, multi-port
  {
    id: 1,
    order_number: 'ORD-20241201-001',
    client_name: 'Statoil ASA',
    client_email: 'cargo@statoil.com',
    survey_type: 'Cargo damage survey',
    status: 'in_progress',
    total_ships: 1,
    total_ports: 2,
    created_by: 1,
    created_by_name: 'admin',
    created_at: '2024-12-01T08:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    remarks: 'Multi-port cargo survey for crude oil transport',
    ships: [
      {
        id: 1,
        order_id: 1,
        vessel_name: 'M/T Nordic Star',
        vessel_imo: 'IMO1234567',
        vessel_flag: 'Norway',
        expected_arrival: '2024-12-01T08:00:00Z',
        expected_departure: '2024-12-03T18:00:00Z',
        status: 'in_progress',
        created_at: '2024-12-01T08:00:00Z',
        updated_at: '2024-12-01T10:00:00Z',
        remarks: 'Primary vessel for cargo transport',
        ship_ports: [
          {
            id: 1,
            ship_id: 1,
            port_name: 'Bergen',
            port_sequence: 1,
        status: 'completed',
            actual_arrival: '2024-12-01T08:00:00Z',
            actual_departure: '2024-12-01T16:00:00Z',
            created_at: '2024-12-01T08:00:00Z',
            updated_at: '2024-12-01T16:00:00Z',
            remarks: 'Loading completed successfully'
          },
          {
            id: 2,
            ship_id: 1,
            port_name: 'Stavanger',
            port_sequence: 2,
        status: 'in_progress',
            actual_arrival: '2024-12-01T18:00:00Z',
            created_at: '2024-12-01T08:00:00Z',
            updated_at: '2024-12-01T18:00:00Z',
            remarks: 'Discharge in progress'
          }
        ]
      }
    ]
  },
  // Order 2: Single ship, single port
  {
    id: 2,
    order_number: 'ORD-20241201-002',
    client_name: 'Equinor',
    client_email: 'shipping@equinor.com',
    survey_type: 'Loading and lashing survey',
    status: 'pending',
    total_ships: 1,
    total_ports: 1,
    created_by: 2,
    created_by_name: 'surveyor1',
    created_at: '2024-12-01T09:00:00Z',
    updated_at: '2024-12-01T09:00:00Z',
    remarks: 'Single port loading survey',
    ships: [
      {
        id: 2,
        order_id: 2,
        vessel_name: 'M/T North Sea',
        vessel_imo: 'IMO2345678',
        vessel_flag: 'Norway',
        expected_arrival: '2024-12-02T08:00:00Z',
        expected_departure: '2024-12-02T18:00:00Z',
        status: 'pending',
        created_at: '2024-12-01T09:00:00Z',
        updated_at: '2024-12-01T09:00:00Z',
        remarks: 'Awaiting vessel arrival',
        ship_ports: [
          {
            id: 3,
            ship_id: 2,
            port_name: 'Bergen',
            port_sequence: 1,
            status: 'pending',
            created_at: '2024-12-01T09:00:00Z',
            updated_at: '2024-12-01T09:00:00Z',
            remarks: 'Loading port'
          }
        ]
      }
    ]
  },
  // Order 3: Multi-ship, multi-port
  {
    id: 3,
    order_number: 'ORD-20241130-003',
    client_name: 'Aker BP',
    client_email: 'logistics@akerbp.com',
    survey_type: 'Pre-shipment survey',
    status: 'completed',
    total_ships: 2,
    total_ports: 4,
    created_by: 1,
    created_by_name: 'admin',
    created_at: '2024-11-30T10:00:00Z',
    updated_at: '2024-11-30T20:00:00Z',
    remarks: 'Multi-ship, multi-port cargo operation',
    ships: [
      {
        id: 3,
        order_id: 3,
        vessel_name: 'M/T Atlantic Explorer',
    vessel_imo: 'IMO3456789',
    vessel_flag: 'Norway',
        expected_arrival: '2024-11-30T10:00:00Z',
    expected_departure: '2024-12-01T18:00:00Z',
    status: 'completed',
        created_at: '2024-11-30T10:00:00Z',
        updated_at: '2024-12-01T18:00:00Z',
        remarks: 'Primary vessel - completed',
        ship_ports: [
          {
            id: 4,
            ship_id: 3,
            port_name: 'Trondheim',
            port_sequence: 1,
        status: 'completed',
            actual_arrival: '2024-11-30T10:00:00Z',
            actual_departure: '2024-11-30T16:00:00Z',
            created_at: '2024-11-30T10:00:00Z',
            updated_at: '2024-11-30T16:00:00Z',
            remarks: 'Loading completed'
          },
          {
            id: 5,
            ship_id: 3,
            port_name: 'Oslo',
            port_sequence: 2,
        status: 'completed',
            actual_arrival: '2024-12-01T08:00:00Z',
            actual_departure: '2024-12-01T18:00:00Z',
            created_at: '2024-11-30T10:00:00Z',
            updated_at: '2024-12-01T18:00:00Z',
            remarks: 'Discharge completed'
          }
        ]
      },
  {
    id: 4,
        order_id: 3,
        vessel_name: 'M/T Pacific Voyager',
    vessel_imo: 'IMO4567890',
    vessel_flag: 'Norway',
        expected_arrival: '2024-11-30T12:00:00Z',
        expected_departure: '2024-12-01T20:00:00Z',
        status: 'completed',
        created_at: '2024-11-30T10:00:00Z',
        updated_at: '2024-12-01T20:00:00Z',
        remarks: 'Secondary vessel - completed',
        ship_ports: [
          {
            id: 6,
            ship_id: 4,
            port_name: 'Kristiansand',
            port_sequence: 1,
            status: 'completed',
            actual_arrival: '2024-11-30T12:00:00Z',
            actual_departure: '2024-11-30T18:00:00Z',
            created_at: '2024-11-30T10:00:00Z',
            updated_at: '2024-11-30T18:00:00Z',
            remarks: 'Loading completed'
          },
          {
            id: 7,
            ship_id: 4,
            port_name: 'Drammen',
            port_sequence: 2,
            status: 'completed',
            actual_arrival: '2024-12-01T10:00:00Z',
            actual_departure: '2024-12-01T20:00:00Z',
            created_at: '2024-11-30T10:00:00Z',
            updated_at: '2024-12-01T20:00:00Z',
            remarks: 'Discharge completed'
          }
        ]
      }
    ]
  }
];

// Mock timelog entries (referencing ship_ports)
const mockTimelogEntries: TimelogEntry[] = [
  {
    id: 1,
    ship_port_id: 1,
    activity: 'Vessel berthed, all fast',
    start_time: '2024-12-01T08:00:00Z',
    end_time: '2024-12-01T08:15:00Z',
    created_by: 1,
    created_at: '2024-12-01T08:00:00Z',
    created_by_name: 'admin',
    remarks: 'Vessel arrived on schedule'
  },
  {
    id: 2,
    ship_port_id: 1,
    activity: 'Surveyor on board',
    start_time: '2024-12-01T08:30:00Z',
    end_time: '2024-12-01T10:00:00Z',
    created_by: 1,
    created_at: '2024-12-01T08:30:00Z',
    created_by_name: 'admin',
    remarks: 'Initial inspection commenced'
  },
  {
    id: 3,
    ship_port_id: 2,
    activity: 'Commenced discharging',
    start_time: '2024-12-01T18:00:00Z',
    created_by: 1,
    created_at: '2024-12-01T18:00:00Z',
    created_by_name: 'admin',
    remarks: 'Discharge operation started'
  }
];

// Mock sampling records (referencing ship_ports)
const mockSamplingRecords: SamplingRecord[] = [
  {
    id: 1,
    ship_port_id: 1,
    sample_number: 'S001',
    sample_type: '3x250ml delivered Denofa laboratory',
    quantity: '750ml',
    destination: 'Denofa Laboratory',
    seal_number: 'SEAL-001',
    laboratory: 'Denofa Laboratory',
    analysis_type: 'Chemical analysis',
    status: 'Completed',
    remarks: 'Samples taken from different tanks',
    created_by: 1,
    created_at: '2024-12-01T10:00:00Z',
    created_by_name: 'admin',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 2,
    ship_port_id: 1,
    sample_number: 'S002',
    sample_type: '1 avg sample retained',
    quantity: '250ml',
    destination: 'NMCS Office',
    seal_number: 'SEAL-002',
    laboratory: 'NMCS Office',
    analysis_type: 'Retention',
    status: 'Stored',
    remarks: 'Retained for 6 months',
    created_by: 1,
    created_at: '2024-12-01T10:00:00Z',
    created_by_name: 'admin',
    updated_at: '2024-12-01T10:00:00Z'
  }
];

// Mock survey types
const mockSurveyTypes: SurveyType[] = [
  { id: 1, name: 'Cargo damage survey', description: 'Survey for cargo damage assessment' },
  { id: 2, name: 'Loading and lashing survey', description: 'Survey for loading and lashing operations' },
  { id: 3, name: 'Pre-shipment survey', description: 'Survey before shipment' },
  { id: 4, name: 'Sampling', description: 'Sampling operations' },
  { id: 5, name: 'Cargo supervision', description: 'Cargo supervision services' },
  { id: 6, name: 'Draft survey', description: 'Draft survey operations' },
  { id: 7, name: 'Transfer', description: 'Transfer operations' }
];

// Mock customers
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Statoil ASA',
    email: 'cargo@statoil.com',
    phone: '+47 22 00 20 00',
    address: 'Forusbeen 50, 4035 Stavanger',
    created_at: '2024-01-01T00:00:00Z',
    type: 'shipping_company',
    postal_code: '4035',
    city: 'Stavanger',
    country: 'Norway',
    website: 'www.statoil.com',
    vat_number: 'NO 950 220 674',
    notes: 'Major Norwegian oil company',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true
  },
  {
    id: 2,
    name: 'Equinor',
    email: 'shipping@equinor.com',
    phone: '+47 51 99 00 00',
    address: 'Forusbeen 50, 4035 Stavanger',
    created_at: '2024-01-01T00:00:00Z',
    type: 'shipping_company',
    postal_code: '4035',
    city: 'Stavanger',
    country: 'Norway',
    website: 'www.equinor.com',
    vat_number: 'NO 950 220 674',
    notes: 'Norwegian energy company',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true
  }
];

// Mock remarks
const mockRemarks: Remark[] = [
  {
    id: 1,
    ship_port_id: 1,
    content: 'Sample remark for port operations',
    created_by: 1,
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  }
];

// Mock contact persons
const mockContactPersons: ContactPerson[] = [
  {
    id: 1,
    customer_id: 1,
    name: 'Lars Hansen',
    email: 'lars.hansen@statoil.com',
    phone: '+47 22 00 20 01',
    position: 'Cargo Operations Manager',
    created_at: '2024-01-01T00:00:00Z',
    first_name: 'Lars',
    last_name: 'Hansen',
    title: 'Manager',
    department: 'Operations',
    mobile: '+47 900 12 345',
    is_primary: true,
    is_active: true,
    notes: 'Primary contact for cargo operations',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// API functions
export const mockApi = {
  // Orders
  getOrders: async (params?: any): Promise<{ orders: Order[]; pagination?: any }> => {
    let filteredOrders = [...mockOrders];
    
    if (params?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status);
    }
    
    if (params?.survey_type) {
      filteredOrders = filteredOrders.filter(order => order.survey_type === params.survey_type);
    }
    
    return {
      orders: filteredOrders,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / 10)
      }
    };
  },

  getOrder: async (id: number): Promise<Order> => {
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },

  createOrder: async (orderData: any): Promise<Order> => {
    const newOrder: Order = {
      id: mockOrders.length + 1,
      order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      client_name: orderData.client_name,
      client_email: orderData.client_email,
      survey_type: orderData.survey_type,
      status: 'pending',
      total_ships: orderData.ships?.length || 1,
      total_ports: orderData.ships?.reduce((sum: number, ship: any) => sum + (ship.ports?.length || 0), 0) || 0,
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      remarks: orderData.remarks,
      ships: orderData.ships || []
    };
    
    mockOrders.push(newOrder);
    return newOrder;
  },

  updateOrder: async (id: number, orderData: any): Promise<Order> => {
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...orderData, updated_at: new Date().toISOString() };
    return mockOrders[orderIndex];
  },

  deleteOrder: async (id: number): Promise<void> => {
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    mockOrders.splice(orderIndex, 1);
  },

  // Ships
  getShips: async (orderId: number): Promise<Ship[]> => {
    const order = mockOrders.find(o => o.id === orderId);
    return order?.ships || [];
  },

  getShip: async (id: number): Promise<Ship> => {
    for (const order of mockOrders) {
      const ship = order.ships?.find(s => s.id === id);
      if (ship) return ship;
    }
    throw new Error('Ship not found');
  },

  createShip: async (shipData: any): Promise<Ship> => {
    const newShip: Ship = {
      id: Date.now(),
      order_id: shipData.order_id,
      vessel_name: shipData.vessel_name,
      vessel_imo: shipData.vessel_imo,
      vessel_flag: shipData.vessel_flag,
      expected_arrival: shipData.expected_arrival,
      expected_departure: shipData.expected_departure,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      remarks: shipData.remarks,
      ship_ports: []
    };
    
    const order = mockOrders.find(o => o.id === shipData.order_id);
    if (order) {
      if (!order.ships) order.ships = [];
      order.ships.push(newShip);
    }
    
    return newShip;
  },

  // Ship Ports
  getShipPorts: async (shipId: number): Promise<ShipPort[]> => {
    for (const order of mockOrders) {
      const ship = order.ships?.find(s => s.id === shipId);
      if (ship) return ship.ship_ports || [];
    }
    return [];
  },

  getShipPort: async (id: number): Promise<ShipPort> => {
    for (const order of mockOrders) {
      for (const ship of order.ships || []) {
        const shipPort = ship.ship_ports?.find(sp => sp.id === id);
        if (shipPort) return shipPort;
      }
    }
    throw new Error('Ship port not found');
  },

  createShipPort: async (shipPortData: any): Promise<ShipPort> => {
    const newShipPort: ShipPort = {
      id: Date.now(),
      ship_id: shipPortData.ship_id,
      port_name: shipPortData.port_name,
      port_sequence: shipPortData.port_sequence,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      remarks: shipPortData.remarks
    };
    
    for (const order of mockOrders) {
      const ship = order.ships?.find(s => s.id === shipPortData.ship_id);
      if (ship) {
        if (!ship.ship_ports) ship.ship_ports = [];
        ship.ship_ports.push(newShipPort);
        break;
      }
    }
    
    return newShipPort;
  },

  // Timelog
  getTimelogEntries: async (shipPortId: number): Promise<{ entries: TimelogEntry[] }> => {
    const entries = mockTimelogEntries.filter(entry => entry.ship_port_id === shipPortId);
    return { entries };
  },

  createTimelogEntry: async (entryData: any): Promise<TimelogEntry> => {
    const newEntry: TimelogEntry = {
      id: mockTimelogEntries.length + 1,
      ship_port_id: entryData.ship_port_id,
      activity: entryData.activity,
      start_time: entryData.start_time,
      end_time: entryData.end_time,
      created_by: 1,
      created_at: new Date().toISOString(),
      created_by_name: 'admin',
      remarks: entryData.remarks
    };
    
    mockTimelogEntries.push(newEntry);
    return newEntry;
  },

  // Sampling
  getSamplingRecords: async (shipPortId: number): Promise<SamplingRecord[]> => {
    return mockSamplingRecords.filter(record => record.ship_port_id === shipPortId);
  },

  createSamplingRecord: async (recordData: any): Promise<SamplingRecord> => {
    const newRecord: SamplingRecord = {
      id: mockSamplingRecords.length + 1,
      ship_port_id: recordData.ship_port_id,
      sample_number: recordData.sample_number,
      sample_type: recordData.sample_type,
      quantity: recordData.quantity,
      destination: recordData.destination,
      seal_number: recordData.seal_number,
      laboratory: recordData.laboratory,
      analysis_type: recordData.analysis_type,
      status: recordData.status || 'Pending',
      remarks: recordData.remarks,
      created_by: 1,
      created_at: new Date().toISOString(),
      created_by_name: 'admin',
      updated_at: new Date().toISOString()
    };
    
    mockSamplingRecords.push(newRecord);
    return newRecord;
  },

  // Survey Types
  getSurveyTypes: async (): Promise<SurveyType[]> => {
    return mockSurveyTypes;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return mockProducts;
  },

  // Ports
  getPorts: async (): Promise<Port[]> => {
    return mockPorts;
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    return mockCustomers;
  },

  // Contact Persons
  getContactPersons: async (): Promise<ContactPerson[]> => {
    return mockContactPersons;
  },

  // Order Lines
  getOrderLines: async (shipPortId: number): Promise<OrderLine[]> => {
    // Mock order lines for ship ports
    return [
      {
        id: 1,
        ship_port_id: shipPortId,
        line_number: 1,
        description: 'Sample cargo line',
        quantity: 100,
        unit: 'MT',
        unit_price: 50.00,
        total_price: 5000.00,
        cargo_type: 'General',
        package_type: 'Bulk',
        weight: 100,
        volume: 120,
        remarks: 'Sample order line',
        created_at: new Date().toISOString()
      }
    ];
  },

  // Remarks
  getRemarks: async (shipPortId: number): Promise<Remark[]> => {
    // Mock remarks for ship ports
    return [
      {
        id: 1,
        ship_port_id: shipPortId,
        content: 'Sample remark for this port',
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  },

  // Activities
  getActivities: async (): Promise<{ activity: string }[]> => {
    return [
      { activity: 'Vessel berthed, all fast' },
      { activity: 'Surveyor on board' },
      { activity: 'Commenced loading' },
      { activity: 'Completed loading' },
      { activity: 'Commenced discharging' },
      { activity: 'Completed discharging' },
      { activity: 'Vessel departed' }
    ];
  },

  // Create methods
  createRemark: async (remarkData: any): Promise<Remark> => {
    const newRemark: Remark = {
      id: Date.now(),
      ship_port_id: remarkData.ship_port_id || remarkData.sub_order_id,
      content: remarkData.content,
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newRemark;
  },

  createOrderLine: async (lineData: any): Promise<OrderLine> => {
    const newLine: OrderLine = {
      id: Date.now(),
      ship_port_id: lineData.ship_port_id || lineData.sub_order_id,
      line_number: lineData.line_number || 1,
      description: lineData.description,
      quantity: lineData.quantity,
      unit: lineData.unit,
      unit_price: lineData.unit_price,
      total_price: lineData.total_price,
      cargo_type: lineData.cargo_type,
      package_type: lineData.package_type,
      weight: lineData.weight,
      volume: lineData.volume,
      remarks: lineData.remarks,
      created_at: new Date().toISOString()
    };
    return newLine;
  },

  // Update methods
  updateTimelogEntry: async (id: number, entryData: any): Promise<TimelogEntry> => {
    const entry = mockTimelogEntries.find(e => e.id === id);
    if (!entry) throw new Error('Timelog entry not found');
    
    Object.assign(entry, entryData, { updated_at: new Date().toISOString() });
    return entry;
  },

  updateSamplingRecord: async (id: number, recordData: any): Promise<SamplingRecord> => {
    const record = mockSamplingRecords.find(r => r.id === id);
    if (!record) throw new Error('Sampling record not found');
    
    Object.assign(record, recordData, { updated_at: new Date().toISOString() });
    return record;
  },

  updateRemark: async (id: number, remarkData: any): Promise<Remark> => {
    const remark = mockRemarks.find(r => r.id === id);
    if (!remark) throw new Error('Remark not found');
    
    Object.assign(remark, remarkData, { updated_at: new Date().toISOString() });
    return remark;
  },

  updateOrderLine: async (id: number, lineData: any): Promise<OrderLine> => {
    // Mock implementation - in real app this would update the database
    const updatedLine: OrderLine = {
      id,
      ship_port_id: lineData.ship_port_id || 1,
      line_number: lineData.line_number || 1,
      description: lineData.description,
      quantity: lineData.quantity,
      unit: lineData.unit,
      unit_price: lineData.unit_price,
      total_price: lineData.total_price,
      cargo_type: lineData.cargo_type,
      package_type: lineData.package_type,
      weight: lineData.weight,
      volume: lineData.volume,
      remarks: lineData.remarks,
      created_at: new Date().toISOString()
    };
    return updatedLine;
  },

  // Customer methods
  createCustomer: async (customerData: any): Promise<{ customer: Customer }> => {
    const newCustomer: Customer = {
      id: mockCustomers.length + 1,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || '',
      address: customerData.address || '',
      created_at: new Date().toISOString(),
      type: customerData.type || 'other',
      postal_code: customerData.postal_code || '',
      city: customerData.city || '',
      country: customerData.country || '',
      website: customerData.website || '',
      vat_number: customerData.vat_number || '',
      notes: customerData.notes || '',
      updated_at: new Date().toISOString(),
      is_active: true
    };
    
    mockCustomers.push(newCustomer);
    return { customer: newCustomer };
  },

  createContactPerson: async (contactData: any): Promise<{ contact: ContactPerson }> => {
    const newContact: ContactPerson = {
      id: mockContactPersons.length + 1,
      customer_id: contactData.customer_id,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      position: contactData.position || '',
      created_at: new Date().toISOString(),
      first_name: contactData.first_name || contactData.name?.split(' ')[0] || '',
      last_name: contactData.last_name || contactData.name?.split(' ')[1] || '',
      title: contactData.title || '',
      department: contactData.department || '',
      mobile: contactData.mobile || '',
      is_primary: contactData.is_primary || false,
      is_active: true,
      notes: contactData.notes || '',
      updated_at: new Date().toISOString()
    };
    
    mockContactPersons.push(newContact);
    return { contact: newContact };
  }
};

export default mockApi;