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
  SamplingRecord
} from '../types';

// Use the base interfaces from types/index.ts which now include all extended fields

// Mock data with hierarchical order structure
const mockOrders: Order[] = [
  // Main Order 1: Multi-port cargo survey
  {
    id: 1,
    order_number: 'ORD-20241201-001',
    client_name: 'Statoil ASA',
    contact_person: 'Lars Hansen',
    vessel_name: 'M/T Nordic Star',
    vessel_imo: 'IMO1234567',
    vessel_flag: 'Norway',
    port: 'Multi-port Survey',
    ports: ['Stavanger', 'Bergen', 'Oslo'],
    is_multi_port: true,
    expected_arrival: '2024-12-01T08:00:00Z',
    expected_departure: '2024-12-03T18:00:00Z',
    survey_type: 'Cargo damage survey',
    order_lines: [],
    created_at: '2024-12-01T08:00:00Z',
    client_email: 'cargo@statoil.com',
    status: 'in_progress',
    created_by: 'admin',
    created_by_name: 'admin',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 3,
    sub_orders: [
      {
        id: 11,
        order_number: 'ORD-20241201-001-1',
        client_name: 'Statoil ASA',
        contact_person: 'Lars Hansen',
        vessel_name: 'M/T Nordic Star',
        vessel_imo: 'IMO1234567',
        vessel_flag: 'Norway',
        port: 'Stavanger',
        ports: ['Stavanger'],
        is_multi_port: false,
        expected_arrival: '2024-12-01T08:00:00Z',
        expected_departure: '2024-12-01T18:00:00Z',
        survey_type: 'Cargo damage survey',
        order_lines: [],
        created_at: '2024-12-01T08:00:00Z',
        client_email: 'cargo@statoil.com',
        status: 'completed',
        created_by: 'admin',
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
        contact_person: 'Lars Hansen',
        vessel_name: 'M/T Nordic Star',
        vessel_imo: 'IMO1234567',
        vessel_flag: 'Norway',
        port: 'Bergen',
        ports: ['Bergen'],
        is_multi_port: false,
        expected_arrival: '2024-12-02T08:00:00Z',
        expected_departure: '2024-12-02T18:00:00Z',
        survey_type: 'Cargo damage survey',
        order_lines: [],
        created_at: '2024-12-01T10:00:00Z',
        client_email: 'cargo@statoil.com',
        status: 'in_progress',
        created_by: 'admin',
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
        contact_person: 'Lars Hansen',
        vessel_name: 'M/T Nordic Star',
        vessel_imo: 'IMO1234567',
        vessel_flag: 'Norway',
        port: 'Oslo',
        ports: ['Oslo'],
        is_multi_port: false,
        expected_arrival: '2024-12-03T08:00:00Z',
        expected_departure: '2024-12-03T18:00:00Z',
        survey_type: 'Cargo damage survey',
        order_lines: [],
        created_at: '2024-12-01T12:00:00Z',
        client_email: 'cargo@statoil.com',
        status: 'pending',
        created_by: 'admin',
        created_by_name: 'admin',
        parent_order_id: 1,
        is_main_order: false,
        current_port_index: 3,
        total_ports: 3
      }
    ]
  },
  // Main Order 2: Multi-port container survey
  {
    id: 2,
    order_number: 'ORD-20241201-002',
    client_name: 'Equinor',
    contact_person: 'Anna Johansen',
    vessel_name: 'M/T North Sea',
    vessel_imo: 'IMO2345678',
    vessel_flag: 'Norway',
    port: 'Multi-port Container Survey',
    ports: ['Hamburg', 'Rotterdam'],
    is_multi_port: true,
    expected_arrival: '2024-12-01T09:30:00Z',
    expected_departure: '2024-12-02T18:00:00Z',
    survey_type: 'Container survey',
    order_lines: [],
    created_at: '2024-12-01T09:30:00Z',
    client_email: 'shipping@equinor.com',
    status: 'in_progress',
    created_by: 'admin',
    created_by_name: 'admin',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 2,
    sub_orders: [
      {
        id: 21,
        order_number: 'ORD-20241201-002-1',
        client_name: 'Equinor',
        contact_person: 'Anna Johansen',
        vessel_name: 'M/T North Sea',
        vessel_imo: 'IMO2345678',
        vessel_flag: 'Norway',
        port: 'Hamburg',
        ports: ['Hamburg'],
        is_multi_port: false,
        expected_arrival: '2024-12-01T09:30:00Z',
        expected_departure: '2024-12-01T18:00:00Z',
        survey_type: 'Container survey',
        order_lines: [],
        created_at: '2024-12-01T09:30:00Z',
        client_email: 'shipping@equinor.com',
        status: 'completed',
        created_by: 'admin',
        created_by_name: 'admin',
        parent_order_id: 2,
        is_main_order: false,
        current_port_index: 1,
        total_ports: 2
      },
      {
        id: 22,
        order_number: 'ORD-20241201-002-2',
        client_name: 'Equinor',
        contact_person: 'Anna Johansen',
        vessel_name: 'M/T North Sea',
        vessel_imo: 'IMO2345678',
        vessel_flag: 'Norway',
        port: 'Rotterdam',
        ports: ['Rotterdam'],
        is_multi_port: false,
        expected_arrival: '2024-12-02T09:30:00Z',
        expected_departure: '2024-12-02T18:00:00Z',
        survey_type: 'Container survey',
        order_lines: [],
        created_at: '2024-12-01T11:30:00Z',
        client_email: 'shipping@equinor.com',
        status: 'in_progress',
        created_by: 'admin',
        created_by_name: 'admin',
        parent_order_id: 2,
        is_main_order: false,
        current_port_index: 2,
        total_ports: 2
      }
    ]
  },
  // Main Order 3: Multi-port bunker survey
  {
    id: 3,
    order_number: 'ORD-20241201-003',
    client_name: 'Aker BP',
    contact_person: 'Kristine Berg',
    vessel_name: 'M/T Norwegian Spirit',
    vessel_imo: 'IMO3456789',
    vessel_flag: 'Norway',
    port: 'Multi-port Bunker Survey',
    ports: ['Kristiansand', 'Bergen'],
    is_multi_port: true,
    expected_arrival: '2024-11-30T14:15:00Z',
    expected_departure: '2024-12-01T18:00:00Z',
    survey_type: 'Bunker survey',
    order_lines: [],
    created_at: '2024-11-30T14:15:00Z',
    client_email: 'operations@akerbp.com',
    status: 'completed',
    created_by: 'surveyor1',
    created_by_name: 'surveyor1',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 2,
    sub_orders: [
      {
        id: 31,
        order_number: 'ORD-20241201-003-1',
        client_name: 'Aker BP',
        contact_person: 'Kristine Berg',
        vessel_name: 'M/T Norwegian Spirit',
        vessel_imo: 'IMO3456789',
        vessel_flag: 'Norway',
        port: 'Kristiansand',
        ports: ['Kristiansand'],
        is_multi_port: false,
        expected_arrival: '2024-11-30T14:15:00Z',
        expected_departure: '2024-11-30T18:00:00Z',
        survey_type: 'Bunker survey',
        order_lines: [],
        created_at: '2024-11-30T14:15:00Z',
        client_email: 'operations@akerbp.com',
        status: 'completed',
        created_by: 'surveyor1',
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
        contact_person: 'Kristine Berg',
        vessel_name: 'M/T Norwegian Spirit',
        vessel_imo: 'IMO3456789',
        vessel_flag: 'Norway',
        port: 'Bergen',
        ports: ['Bergen'],
        is_multi_port: false,
        expected_arrival: '2024-12-01T14:15:00Z',
        expected_departure: '2024-12-01T18:00:00Z',
        survey_type: 'Bunker survey',
        order_lines: [],
        created_at: '2024-11-30T16:30:00Z',
        client_email: 'operations@akerbp.com',
        status: 'completed',
        created_by: 'surveyor1',
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
    contact_person: 'Thomas Andersen',
    vessel_name: 'M/T Edvard Grieg',
    vessel_imo: 'IMO4567890',
    vessel_flag: 'Norway',
    port: 'Oslo',
    ports: ['Oslo'],
    is_multi_port: false,
    expected_arrival: '2024-11-30T16:45:00Z',
    expected_departure: '2024-12-01T18:00:00Z',
    survey_type: 'Condition survey',
    order_lines: [],
    created_at: '2024-11-30T16:45:00Z',
    client_email: 'marine@lundinenergy.com',
    status: 'in_progress',
    created_by: 'surveyor2',
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
    contact_person: 'Peter Nielsen',
    vessel_name: 'M/T Balder',
    vessel_imo: 'IMO5678901',
    vessel_flag: 'Norway',
    port: 'Multi-port Pre-loading',
    ports: ['Stavanger', 'Bergen', 'Oslo', 'Kristiansand'],
    is_multi_port: true,
    expected_arrival: '2024-12-01T11:20:00Z',
    expected_departure: '2024-12-04T18:00:00Z',
    survey_type: 'Pre-loading survey',
    order_lines: [],
    created_at: '2024-12-01T11:20:00Z',
    client_email: 'shipping@varenergi.no',
    status: 'pending',
    created_by: 'admin',
    created_by_name: 'admin',
    parent_order_id: undefined,
    is_main_order: true,
    total_ports: 4,
    sub_orders: [
      {
        id: 51,
        order_number: 'ORD-20241201-005-1',
        client_name: 'Vår Energi',
        contact_person: 'Peter Nielsen',
        vessel_name: 'M/T Balder',
        vessel_imo: 'IMO5678901',
        vessel_flag: 'Norway',
        port: 'Stavanger',
        ports: ['Stavanger'],
        is_multi_port: false,
        expected_arrival: '2024-12-01T11:20:00Z',
        expected_departure: '2024-12-01T18:00:00Z',
        survey_type: 'Pre-loading survey',
        order_lines: [],
        created_at: '2024-12-01T11:20:00Z',
        client_email: 'shipping@varenergi.no',
        status: 'pending',
        created_by: 'admin',
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
        contact_person: 'Peter Nielsen',
        vessel_name: 'M/T Balder',
        vessel_imo: 'IMO5678901',
        vessel_flag: 'Norway',
        port: 'Bergen',
        ports: ['Bergen'],
        is_multi_port: false,
        expected_arrival: '2024-12-02T11:20:00Z',
        expected_departure: '2024-12-02T18:00:00Z',
        survey_type: 'Pre-loading survey',
        order_lines: [],
        created_at: '2024-12-01T13:00:00Z',
        client_email: 'shipping@varenergi.no',
        status: 'pending',
        created_by: 'admin',
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
        contact_person: 'Peter Nielsen',
        vessel_name: 'M/T Balder',
        vessel_imo: 'IMO5678901',
        vessel_flag: 'Norway',
        port: 'Oslo',
        ports: ['Oslo'],
        is_multi_port: false,
        expected_arrival: '2024-12-03T11:20:00Z',
        expected_departure: '2024-12-03T18:00:00Z',
        survey_type: 'Pre-loading survey',
        order_lines: [],
        created_at: '2024-12-01T14:30:00Z',
        client_email: 'shipping@varenergi.no',
        status: 'pending',
        created_by: 'admin',
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
        contact_person: 'Peter Nielsen',
        vessel_name: 'M/T Balder',
        vessel_imo: 'IMO5678901',
        vessel_flag: 'Norway',
        port: 'Kristiansand',
        ports: ['Kristiansand'],
        is_multi_port: false,
        expected_arrival: '2024-12-04T11:20:00Z',
        expected_departure: '2024-12-04T18:00:00Z',
        survey_type: 'Pre-loading survey',
        order_lines: [],
        created_at: '2024-12-01T16:00:00Z',
        client_email: 'shipping@varenergi.no',
        status: 'pending',
        created_by: 'admin',
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
  // Timelog entries for Sub-order 11 (Stavanger Port)
  {
    id: 1,
    sub_order_id: 11, // Stavanger Port
    activity: 'Vessel berthed',
    start_time: '2024-12-01T08:00:00Z',
    end_time: '2024-12-01T08:15:00Z',
    remarks: 'Vessel arrived on schedule - Stavanger',
    created_by: 'admin',
    created_at: '2024-12-01T08:00:00Z',
    timestamp: '2024-12-01T08:00:00Z',
    created_by_name: 'admin'
  },
  {
    id: 2,
    sub_order_id: 11, // Stavanger Port
    activity: 'Surveyor on board',
    start_time: '2024-12-01T08:15:00Z',
    end_time: '2024-12-01T08:30:00Z',
    remarks: 'Safety briefing completed - Stavanger',
    created_by: 'admin',
    created_at: '2024-12-01T08:15:00Z',
    timestamp: '2024-12-01T08:15:00Z',
    created_by_name: 'admin'
  },
  {
    id: 3,
    sub_order_id: 11, // Stavanger Port
    activity: 'Cargo inspection started',
    start_time: '2024-12-01T08:30:00Z',
    end_time: '2024-12-01T10:00:00Z',
    remarks: 'Cargo inspection completed - Stavanger',
    created_by: 'admin',
    created_at: '2024-12-01T08:30:00Z',
    timestamp: '2024-12-01T08:30:00Z',
    created_by_name: 'admin'
  },
  // Timelog entries for Sub-order 12 (Bergen Port)
  {
    id: 4,
    sub_order_id: 12, // Bergen Port
    activity: 'Vessel berthed',
    start_time: '2024-12-01T10:30:00Z',
    end_time: '2024-12-01T10:45:00Z',
    remarks: 'Vessel arrived on schedule - Bergen',
    created_by: 'admin',
    created_at: '2024-12-01T10:30:00Z',
    timestamp: '2024-12-01T10:30:00Z',
    created_by_name: 'admin'
  },
  {
    id: 5,
    sub_order_id: 12, // Bergen Port
    activity: 'Cargo loading started',
    start_time: '2024-12-01T11:00:00Z',
    end_time: '2024-12-01T13:00:00Z',
    remarks: 'Cargo loading completed - Bergen',
    created_by: 'admin',
    created_at: '2024-12-01T11:00:00Z',
    timestamp: '2024-12-01T11:00:00Z',
    created_by_name: 'admin'
  },
  // Timelog entries for Sub-order 13 (Oslo Port)
  {
    id: 6,
    sub_order_id: 13, // Oslo Port
    activity: 'Vessel berthed',
    start_time: '2024-12-01T14:00:00Z',
    end_time: '2024-12-01T14:15:00Z',
    remarks: 'Vessel arrived on schedule - Oslo',
    created_by: 'admin',
    created_at: '2024-12-01T14:00:00Z',
    timestamp: '2024-12-01T14:00:00Z',
    created_by_name: 'admin'
  },
  {
    id: 7,
    sub_order_id: 13, // Oslo Port
    activity: 'Container operations',
    start_time: '2024-12-01T14:30:00Z',
    end_time: '2024-12-01T16:00:00Z',
    remarks: 'Container operations completed - Oslo',
    created_by: 'admin',
    created_at: '2024-12-01T14:30:00Z',
    timestamp: '2024-12-01T14:30:00Z',
    created_by_name: 'admin'
  }
];

const mockSamplingRecords: SamplingRecord[] = [
  // Sampling records for Sub-order 11 (Stavanger Port)
  {
    id: 1,
    sub_order_id: 11, // Stavanger Port
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
    remarks: 'Standard fuel oil sample - Stavanger',
    created_by_name: 'admin'
  },
  {
    id: 2,
    sub_order_id: 11, // Stavanger Port
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
    remarks: 'Diesel quality sample - Stavanger',
    created_by_name: 'admin'
  },
  // Sampling records for Sub-order 12 (Bergen Port)
  {
    id: 3,
    sub_order_id: 12, // Bergen Port
    sample_number: 'S-2024-003',
    sample_type: 'Crude Oil',
    laboratory: 'SGS',
    analysis_type: 'API Gravity',
    status: 'Pending',
    created_by: 'admin',
    created_at: '2024-12-01T11:30:00Z',
    quantity: '2 liters',
    destination: 'SGS Laboratory',
    seal_number: 'SEAL-003',
    remarks: 'Crude oil sample - Bergen',
    created_by_name: 'admin'
  },
  // Sampling records for Sub-order 13 (Oslo Port)
  {
    id: 4,
    sub_order_id: 13, // Oslo Port
    sample_number: 'S-2024-004',
    sample_type: 'Container Cargo',
    laboratory: 'Bureau Veritas',
    analysis_type: 'Contamination Check',
    status: 'Completed',
    created_by: 'admin',
    created_at: '2024-12-01T15:00:00Z',
    quantity: '1 sample',
    destination: 'Bureau Veritas Laboratory',
    seal_number: 'SEAL-004',
    remarks: 'Container cargo sample - Oslo',
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
  // Order lines for Sub-order 11 (Stavanger Port - Main Order 1)
  {
    id: 1,
    sub_order_id: 11, // Stavanger Port
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
    created_at: '2024-12-01T08:00:00Z'
  },
  {
    id: 2,
    sub_order_id: 11, // Stavanger Port
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
    created_at: '2024-12-01T08:00:00Z'
  },
  // Order lines for Sub-order 12 (Bergen Port - Main Order 1)
  {
    id: 3,
    sub_order_id: 12, // Bergen Port
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
    created_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 4,
    sub_order_id: 12, // Bergen Port
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
    created_at: '2024-12-01T10:00:00Z'
  },
  // Order lines for Sub-order 13 (Oslo Port - Main Order 1)
  {
    id: 5,
    sub_order_id: 13, // Oslo Port
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
  // Order lines for Sub-order 21 (Hamburg Port - Main Order 2)
  {
    id: 6,
    sub_order_id: 21, // Hamburg Port
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
    sub_order_id: 21, // Hamburg Port
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
  // Order lines for Sub-order 22 (Rotterdam Port - Main Order 2)
  {
    id: 8,
    sub_order_id: 22, // Rotterdam Port
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
      is_main_order: true,
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
  getTimelogEntries: async (subOrderId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entries = mockTimelogEntries.filter(entry => entry.sub_order_id === subOrderId);
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
  getSamplingRecords: async (subOrderId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSamplingRecords.filter(record => record.sub_order_id === subOrderId);
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
      laboratory: 'Demo Laboratory',
      analysis_type: 'Standard Analysis',
      status: 'Pending',
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
  },

  // Products
  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.filter(product => product.is_active);
  },

  getProduct: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  createProduct: async (productData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProduct = {
      id: mockProducts.length + 1,
      created_at: new Date().toISOString(),
      is_active: true,
      ...productData
    } as Product;
    
    mockProducts.push(newProduct);
    return {
      message: 'Product created successfully',
      product: newProduct
    };
  },

  updateProduct: async (id: number, productData: Partial<Product>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    return {
      message: 'Product updated successfully',
      product: mockProducts[productIndex]
    };
  },

  deleteProduct: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts.splice(productIndex, 1);
    return { message: 'Product deleted successfully' };
  },

  // Ports
  getPorts: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPorts.filter(port => port.is_active);
  },

  getPort: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const port = mockPorts.find(p => p.id === id);
    if (!port) {
      throw new Error('Port not found');
    }
    return port;
  },

  createPort: async (portData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPort = {
      id: mockPorts.length + 1,
      created_at: new Date().toISOString(),
      is_active: true,
      ...portData
    } as Port;
    
    mockPorts.push(newPort);
    return {
      message: 'Port created successfully',
      port: newPort
    };
  },

  updatePort: async (id: number, portData: Partial<Port>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const portIndex = mockPorts.findIndex(p => p.id === id);
    if (portIndex === -1) {
      throw new Error('Port not found');
    }
    
    mockPorts[portIndex] = {
      ...mockPorts[portIndex],
      ...portData,
      updated_at: new Date().toISOString()
    };
    
    return {
      message: 'Port updated successfully',
      port: mockPorts[portIndex]
    };
  },

  deletePort: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const portIndex = mockPorts.findIndex(p => p.id === id);
    if (portIndex === -1) {
      throw new Error('Port not found');
    }
    
    mockPorts.splice(portIndex, 1);
    return { message: 'Port deleted successfully' };
  }
};
