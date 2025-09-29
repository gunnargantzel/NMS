// Shared type definitions
export interface Port {
  id: number;
  name: string;
  country: string;
  region: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  client_name: string;
  client_email?: string;
  survey_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_ships: number;
  total_ports: number;
  created_by?: number;
  created_at: string;
  updated_at?: string;
  remarks?: string;
  // Related data
  ships?: Ship[];
}

export interface Ship {
  id: number;
  order_id: number;
  vessel_name: string;
  vessel_imo?: string;
  vessel_flag?: string;
  expected_arrival?: string;
  expected_departure?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at?: string;
  remarks?: string;
  // Related data
  ship_ports?: ShipPort[];
}

export interface ShipPort {
  id: number;
  ship_id: number;
  port_id?: number;
  port_name: string;
  port_sequence: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  actual_arrival?: string;
  actual_departure?: string;
  created_at: string;
  updated_at?: string;
  remarks?: string;
  // Related data
  order_lines?: OrderLine[];
  timelog_entries?: TimelogEntry[];
  sampling_records?: SamplingRecord[];
  remarks_list?: Remark[];
}

export interface OrderLine {
  id: number;
  ship_port_id: number;
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
  // Legacy fields for compatibility
  sub_order_id?: number;
  selected_port?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  // Extended fields for compatibility
  type?: 'shipping_company' | 'cargo_owner' | 'port_authority' | 'other';
  postal_code?: string;
  city?: string;
  country?: string;
  website?: string;
  vat_number?: string;
  notes?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface ContactPerson {
  id: number;
  customer_id: number;
  name?: string;
  email: string;
  phone?: string;
  position?: string;
  created_at: string;
  // Extended fields for compatibility
  first_name?: string;
  last_name?: string;
  title?: string;
  department?: string;
  mobile?: string;
  is_primary?: boolean;
  is_active?: boolean;
  notes?: string;
  updated_at?: string;
}

export interface SurveyType {
  id: number;
  name: string;
  description: string;
}

export interface TimelogEntry {
  id: number;
  ship_port_id: number;
  activity: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  created_by: number;
  created_at: string;
  created_by_name?: string;
  remarks?: string;
  // Legacy fields for compatibility
  sub_order_id?: number;
  timestamp?: string;
}

export interface SamplingRecord {
  id: number;
  ship_port_id: number;
  sample_number: string;
  sample_type: string;
  quantity?: string;
  destination?: string;
  seal_number?: string;
  laboratory?: string;
  analysis_type?: string;
  status?: string;
  remarks?: string;
  created_by: number;
  created_at: string;
  created_by_name?: string;
  updated_at?: string;
  // Legacy fields for compatibility
  sub_order_id?: number;
  location?: string;
  timestamp?: string;
}

export interface Remark {
  id: number;
  ship_port_id: number;
  content: string;
  created_by: number;
  created_at: string;
  updated_at?: string;
  // Legacy fields for compatibility
  sub_order_id?: number;
}
