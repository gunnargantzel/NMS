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
  contact_person: string;
  vessel_name: string;
  vessel_imo: string;
  vessel_flag: string;
  port: string;
  ports: string[];
  is_multi_port: boolean;
  expected_arrival: string;
  expected_departure: string;
  survey_type: string;
  order_lines: OrderLine[];
  created_at: string;
  updated_at?: string;
  // Extended fields for compatibility
  client_email?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_by?: string;
  created_by_name?: string;
  parent_order_id?: number;
  is_main_order?: boolean;
  sub_orders?: Order[];
  total_ports?: number;
  current_port_index?: number;
}

export interface OrderLine {
  id: number;
  sub_order_id: number;
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
  sub_order_id: number;
  activity: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  created_by: string;
  created_at: string;
  // Extended fields for compatibility
  remarks?: string;
  timestamp?: string;
  created_by_name?: string;
}

export interface SamplingRecord {
  id: number;
  sub_order_id: number;
  sample_type: string;
  sample_number: string;
  location?: string;
  timestamp?: string;
  created_by: string;
  created_at: string;
  // Extended fields for compatibility
  laboratory?: string;
  analysis_type?: string;
  status?: string;
  quantity?: string;
  destination?: string;
  seal_number?: string;
  remarks?: string;
  created_by_name?: string;
}

export interface Remark {
  id: number;
  sub_order_id: number;
  content: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
}
