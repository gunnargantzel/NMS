import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { mockApi } from '../services/mockApi';
import { Customer, ContactPerson, SurveyType, OrderLine, Product, Port } from '../types';

interface OrderFormData {
  // Customer Information
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  contact_person_id: number | null;
  
  // Vessel Information
  vessel_name: string;
  vessel_imo: string;
  vessel_flag: string;
  
  // Survey Information
  survey_type: string;
  port: string;
  expected_arrival: string;
  expected_departure: string;
  
  // Order Details
  is_multi_port: boolean;
  ports: string[];
  remarks: string;
  
  // Order Lines
  order_lines: OrderLine[];
}

const OrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>([]);
  
  // Form data
  const [formData, setFormData] = useState<OrderFormData>({
    customer_id: null,
    customer_name: '',
    customer_email: '',
    contact_person_id: null,
    vessel_name: '',
    vessel_imo: '',
    vessel_flag: 'NO',
    survey_type: '',
    port: '',
    expected_arrival: '',
    expected_departure: '',
    is_multi_port: false,
    ports: [],
    remarks: '',
    order_lines: []
  });
  
  // Dialog states
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [orderLineDialogOpen, setOrderLineDialogOpen] = useState(false);
  
  // New customer/contact forms
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    type: 'cargo_owner' as const,
    address: '',
    postal_code: '',
    city: '',
    country: 'Norway',
    phone: '',
    email: '',
    website: '',
    vat_number: '',
    notes: ''
  });
  
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    title: '',
    department: '',
    phone: '',
    mobile: '',
    email: '',
    notes: ''
  });
  
  const [newOrderLine, setNewOrderLine] = useState({
    description: '',
    quantity: 0,
    unit: 'MT',
    unit_price: 0,
    cargo_type: '',
    package_type: '',
    weight: 0,
    volume: 0,
    remarks: '',
    selected_port: '', // Add port selection for order lines
    product_id: null as number | null // Add product selection
  });

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Ports state
  const [ports, setPorts] = useState<Port[]>([]);

  const steps = [
    'Customer & Contact',
    'Vessel Information',
    'Survey Details',
    'Order Lines',
    'Review & Submit'
  ];

  useEffect(() => {
    fetchInitialData();
    if (isEditMode && id) {
      fetchOrderData(parseInt(id));
    }
  }, [isEditMode, id]);

  const fetchInitialData = async () => {
    try {
      setProductsLoading(true);
      const [customersData, surveyTypesData, productsData, portsData] = await Promise.all([
        mockApi.getCustomers(),
        mockApi.getSurveyTypes(),
        mockApi.getProducts(),
        mockApi.getPorts()
      ]);
      
      setCustomers(customersData);
      setSurveyTypes(surveyTypesData);
      setProducts(productsData);
      setPorts(portsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load form data');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrderData = async (orderId: number) => {
    try {
      const order = await mockApi.getOrder(orderId);
      
      // Populate form data with existing order data
      setFormData({
        customer_id: null, // Will be set based on customer name
        customer_name: order.client_name || '',
        customer_email: order.client_email || '',
        contact_person_id: null,
        vessel_name: order.vessel_name || '',
        vessel_imo: '', // Not available in Order interface
        vessel_flag: '', // Not available in Order interface
        expected_arrival: '', // Not available in Order interface
        expected_departure: '', // Not available in Order interface
        port: order.port || '',
        is_multi_port: order.is_main_order && (order.total_ports || 0) > 1,
        ports: order.is_main_order && order.sub_orders 
          ? order.sub_orders.map(sub => sub.port)
          : [order.port || ''],
        survey_type: order.survey_type || '',
        remarks: '', // Not available in Order interface
        order_lines: [] // Will be populated from sub-orders
      });

      // Load order lines from sub-orders
      if (order.is_main_order && order.sub_orders) {
        const allOrderLines: OrderLine[] = [];
        for (const subOrder of order.sub_orders) {
          const subOrderLines = await mockApi.getOrderLines(subOrder.id);
          allOrderLines.push(...subOrderLines);
        }
        setFormData(prev => ({ ...prev, order_lines: allOrderLines }));
      } else {
        const orderLines = await mockApi.getOrderLines(orderId);
        setFormData(prev => ({ ...prev, order_lines: orderLines }));
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      setError('Failed to load order data');
    }
  };

  const fetchContactPersons = async (customerId: number) => {
    try {
      const contacts = await mockApi.getContactPersons(customerId);
      setContactPersons(contacts);
    } catch (error) {
      console.error('Error fetching contact persons:', error);
    }
  };

  const handleCustomerChange = (customer: Customer | null) => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer_id: customer.id,
        customer_name: customer.name,
        customer_email: customer.email || '',
        contact_person_id: null
      }));
      fetchContactPersons(customer.id);
    } else {
      setFormData(prev => ({
        ...prev,
        customer_id: null,
        customer_name: '',
        customer_email: '',
        contact_person_id: null
      }));
      setContactPersons([]);
    }
  };

  const handleContactChange = (contact: ContactPerson | null) => {
    setFormData(prev => ({
      ...prev,
      contact_person_id: contact?.id || null
    }));
  };

  const handleAddPort = () => {
    if (formData.port && !formData.ports.includes(formData.port)) {
      setFormData(prev => ({
        ...prev,
        ports: [...prev.ports, prev.port],
        port: ''
      }));
    }
  };

  const handleRemovePort = (portToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.filter(port => port !== portToRemove)
    }));
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await mockApi.createCustomer(newCustomer);
      setCustomers(prev => [...prev, response.customer]);
      setFormData(prev => ({
        ...prev,
        customer_id: response.customer.id,
        customer_name: response.customer.name,
        customer_email: response.customer.email || ''
      }));
      setCustomerDialogOpen(false);
      setNewCustomer({
        name: '',
        type: 'cargo_owner',
        address: '',
        postal_code: '',
        city: '',
        country: 'Norway',
        phone: '',
        email: '',
        website: '',
        vat_number: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      setError('Failed to create customer');
    }
  };

  const handleCreateContact = async () => {
    if (!formData.customer_id) return;
    
    try {
      const response = await mockApi.createContactPerson({
        ...newContact,
        customer_id: formData.customer_id
      });
      setContactPersons(prev => [...prev, response.contact]);
      setFormData(prev => ({
        ...prev,
        contact_person_id: response.contact.id
      }));
      setContactDialogOpen(false);
      setNewContact({
        first_name: '',
        last_name: '',
        title: '',
        department: '',
        phone: '',
        mobile: '',
        email: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating contact person:', error);
      setError('Failed to create contact person');
    }
  };

  const handleAddOrderLine = () => {
    if (!newOrderLine.selected_port) {
      setError('Please select a port for this order line');
      return;
    }
    
    if (!newOrderLine.product_id) {
      setError('Please select a product for this order line');
      return;
    }
    
    const selectedProduct = products.find(p => p.id === newOrderLine.product_id);
    if (!selectedProduct) {
      setError('Selected product not found');
      return;
    }
    
    const totalPrice = newOrderLine.quantity * newOrderLine.unit_price;
    const orderLine: OrderLine = {
      id: Date.now(), // Temporary ID
      sub_order_id: 0, // Will be set when order is created - order lines belong to specific ports/harbors
      line_number: formData.order_lines.length + 1,
      description: selectedProduct.name, // Use product name as description
      quantity: newOrderLine.quantity,
      unit: newOrderLine.unit,
      unit_price: newOrderLine.unit_price,
      total_price: totalPrice,
      cargo_type: newOrderLine.cargo_type,
      package_type: newOrderLine.package_type,
      weight: newOrderLine.weight,
      volume: newOrderLine.volume,
      remarks: newOrderLine.remarks,
      created_at: new Date().toISOString(),
      selected_port: newOrderLine.selected_port // Store selected port for later use
    };
    
    setFormData(prev => ({
      ...prev,
      order_lines: [...prev.order_lines, orderLine]
    }));
    
    setNewOrderLine({
      description: '',
      quantity: 0,
      unit: 'MT',
      unit_price: 0,
      cargo_type: '',
      package_type: '',
      weight: 0,
      volume: 0,
      remarks: '',
      selected_port: '',
      product_id: null
    });
    setOrderLineDialogOpen(false);
  };

  const handleRemoveOrderLine = (lineId: number) => {
    setFormData(prev => ({
      ...prev,
      order_lines: prev.order_lines.filter(line => line.id !== lineId)
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create the order
      const orderData = {
        client_name: formData.customer_name,
        client_email: formData.customer_email,
        vessel_name: formData.vessel_name,
        port: formData.is_multi_port ? formData.ports.join(', ') : formData.port,
        survey_type: formData.survey_type,
        status: 'pending' as const,
        is_main_order: true,
        parent_order_id: undefined,
        total_ports: formData.is_multi_port ? formData.ports.length : 1,
        remarks: formData.remarks
      };
      
      const response = await mockApi.createOrder(orderData);
      
      // If multi-port order, create sub-orders and distribute order lines
      if (formData.is_multi_port && formData.ports.length > 1) {
        // Create sub-orders for each port
        const subOrderIds = [];
        for (let i = 0; i < formData.ports.length; i++) {
          const port = formData.ports[i];
          const subOrderData = {
            ...orderData,
            port: port,
            is_main_order: false,
            parent_order_id: response.orderId,
            current_port_index: i + 1,
            total_ports: formData.ports.length
          };
          
          const subOrderResponse = await mockApi.createOrder(subOrderData);
          subOrderIds.push(subOrderResponse.orderId);
        }
        
        // Distribute order lines to sub-orders based on selected_port
        for (const line of formData.order_lines) {
          // Find the sub-order ID for the selected port
          const portIndex = formData.ports.indexOf(line.selected_port || '');
          const subOrderId = subOrderIds[portIndex];
          
          if (subOrderId) {
            await mockApi.createOrderLine({
              ...line,
              sub_order_id: subOrderId
            });
          }
        }
      } else {
        // Single port order - create order lines directly
        for (const line of formData.order_lines) {
          await mockApi.createOrderLine({
            ...line,
            sub_order_id: response.orderId
          });
        }
      }
      
      setSuccess(`Order ${response.orderNumber} created successfully!`);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const renderCustomerStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Customer & Contact Information
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name}
            value={customers.find(c => c.id === formData.customer_id) || null}
            onChange={(_, value) => handleCustomerChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                required
                helperText="Select existing customer or create new"
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type} • {option.city}, {option.country}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              onClick={() => setCustomerDialogOpen(true)}
            >
              New Customer
            </Button>
          </Box>
        </Box>
        
        {formData.customer_id && (
          <>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Autocomplete
                options={contactPersons}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                value={contactPersons.find(c => c.id === formData.contact_person_id) || null}
                onChange={(_, value) => handleContactChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contact Person"
                    helperText="Select contact person for this order"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.first_name} {option.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.title} • {option.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => setContactDialogOpen(true)}
              >
                New Contact
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );

  const renderVesselStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vessel Information
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <TextField
            fullWidth
            label="Vessel Name"
            value={formData.vessel_name}
            onChange={(e) => setFormData(prev => ({ ...prev, vessel_name: e.target.value }))}
            required
          />
        </Box>
        
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="IMO Number"
            value={formData.vessel_imo}
            onChange={(e) => setFormData(prev => ({ ...prev, vessel_imo: e.target.value }))}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Flag State"
            value={formData.vessel_flag}
            onChange={(e) => setFormData(prev => ({ ...prev, vessel_flag: e.target.value }))}
          />
        </Box>
      </Box>
    </Box>
  );

  const renderSurveyStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Survey Details
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <FormControl fullWidth required>
            <InputLabel>Survey Type</InputLabel>
            <Select
              value={formData.survey_type}
              label="Survey Type"
              onChange={(e) => setFormData(prev => ({ ...prev, survey_type: e.target.value }))}
            >
              {surveyTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <TextField
            fullWidth
            label="Expected Arrival"
            type="datetime-local"
            value={formData.expected_arrival}
            onChange={(e) => setFormData(prev => ({ ...prev, expected_arrival: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
          <FormControl fullWidth>
            <InputLabel>Port Configuration</InputLabel>
            <Select
              value={formData.is_multi_port ? 'multi' : 'single'}
              label="Port Configuration"
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                is_multi_port: e.target.value === 'multi',
                ports: e.target.value === 'single' ? [] : prev.ports
              }))}
            >
              <MenuItem value="single">Single Port</MenuItem>
              <MenuItem value="multi">Multi-Port</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {!formData.is_multi_port ? (
          <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
            <FormControl fullWidth required>
              <InputLabel>Port</InputLabel>
              <Select
                value={formData.port}
                label="Port"
                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
              >
                {ports.map((port) => (
                  <MenuItem key={port.id} value={port.name}>
                    {port.name} - {port.country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
              <FormControl fullWidth>
                <InputLabel>Select Port</InputLabel>
                <Select
                  value={formData.port}
                  label="Select Port"
                  onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                >
                  {ports.map((port) => (
                    <MenuItem key={port.id} value={port.name}>
                      {port.name} - {port.country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddPort}
                disabled={!formData.port}
              >
                Add Port
              </Button>
            </Box>
            
            {formData.ports.length > 0 && (
              <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Ports ({formData.ports.length}):
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.ports.map((port, index) => (
                    <Chip
                      key={index}
                      label={`${index + 1}. ${port}`}
                      onDelete={() => handleRemovePort(port)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
        
        <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
          <TextField
            fullWidth
            label="Remarks"
            multiline
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          />
        </Box>
      </Box>
    </Box>
  );

  const renderOrderLinesStep = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Order Lines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOrderLineDialogOpen(true)}
        >
          Add Order Line
        </Button>
      </Box>
      
      {formData.order_lines.length === 0 ? (
        <Alert severity="info">
          No order lines added yet. Click "Add Order Line" to get started.
        </Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Line</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.order_lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.line_number}</TableCell>
                  <TableCell>{line.description}</TableCell>
                  <TableCell>{line.quantity}</TableCell>
                  <TableCell>{line.unit}</TableCell>
                  <TableCell>NOK {line.unit_price.toFixed(2)}</TableCell>
                  <TableCell>NOK {line.total_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveOrderLine(line.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderReviewStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Order Details
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography><strong>Customer:</strong> {formData.customer_name}</Typography>
              <Typography><strong>Email:</strong> {formData.customer_email}</Typography>
              {formData.contact_person_id && (
                <Typography>
                  <strong>Contact:</strong> {
                    contactPersons.find(c => c.id === formData.contact_person_id)?.first_name
                  } {
                    contactPersons.find(c => c.id === formData.contact_person_id)?.last_name
                  }
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vessel Information
              </Typography>
              <Typography><strong>Vessel:</strong> {formData.vessel_name}</Typography>
              <Typography><strong>IMO:</strong> {formData.vessel_imo}</Typography>
              <Typography><strong>Flag:</strong> {formData.vessel_flag}</Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Survey Details
              </Typography>
              <Typography><strong>Survey Type:</strong> {formData.survey_type}</Typography>
              <Typography><strong>Port(s):</strong> {
                formData.is_multi_port 
                  ? formData.ports.join(', ') 
                  : formData.port
              }</Typography>
              <Typography><strong>Expected Arrival:</strong> {formData.expected_arrival}</Typography>
              {formData.remarks && (
                <Typography><strong>Remarks:</strong> {formData.remarks}</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        
        {formData.order_lines.length > 0 && (
          <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Lines ({formData.order_lines.length})
                </Typography>
                <Typography>
                  <strong>Total Value:</strong> NOK {
                    formData.order_lines.reduce((sum, line) => sum + line.total_price, 0).toFixed(2)
                  }
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Order
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {index === 0 && renderCustomerStep()}
                  {index === 1 && renderVesselStep()}
                  {index === 2 && renderSurveyStep()}
                  {index === 3 && renderOrderLinesStep()}
                  {index === 4 && renderReviewStep()}
                  
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <div>
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={loading}
                          startIcon={<SaveIcon />}
                        >
                          {loading ? 'Creating Order...' : 'Create Order'}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Continue
                        </Button>
                      )}
                      {index > 0 && (
                        <Button
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
      
      {/* Customer Dialog */}
      <Dialog open={customerDialogOpen} onClose={() => setCustomerDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Company Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newCustomer.type}
                  label="Type"
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="shipping_company">Shipping Company</MenuItem>
                  <MenuItem value="cargo_owner">Cargo Owner</MenuItem>
                  <MenuItem value="port_authority">Port Authority</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <TextField
                fullWidth
                label="Address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Postal Code"
                value={newCustomer.postal_code}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, postal_code: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="City"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Country"
                value={newCustomer.country}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, country: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Website"
                value={newCustomer.website}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, website: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="VAT Number"
                value={newCustomer.vat_number}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, vat_number: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCustomer} variant="contained">
            Create Customer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Contact Person Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Contact Person</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="First Name"
                value={newContact.first_name}
                onChange={(e) => setNewContact(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Last Name"
                value={newContact.last_name}
                onChange={(e) => setNewContact(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Title"
                value={newContact.title}
                onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Department"
                value={newContact.department}
                onChange={(e) => setNewContact(prev => ({ ...prev, department: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Mobile"
                value={newContact.mobile}
                onChange={(e) => setNewContact(prev => ({ ...prev, mobile: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newContact.notes}
                onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateContact} variant="contained">
            Create Contact
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Order Line Dialog */}
      <Dialog open={orderLineDialogOpen} onClose={() => setOrderLineDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Order Line</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <FormControl fullWidth required>
                <InputLabel>Port/Harbor</InputLabel>
                <Select
                  value={newOrderLine.selected_port}
                  label="Port/Harbor"
                  onChange={(e) => setNewOrderLine(prev => ({ ...prev, selected_port: e.target.value }))}
                >
                  {formData.is_multi_port ? 
                    formData.ports.map((port) => (
                      <MenuItem key={port} value={port}>{port}</MenuItem>
                    )) :
                    <MenuItem value={formData.port}>{formData.port}</MenuItem>
                  }
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <Autocomplete
                fullWidth
                options={products}
                getOptionLabel={(option) => option.name}
                value={products.find(p => p.id === newOrderLine.product_id) || null}
                onChange={(event, newValue) => {
                  setNewOrderLine(prev => ({ 
                    ...prev, 
                    product_id: newValue?.id || null,
                    description: newValue?.name || ''
                  }));
                }}
                loading={productsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    required
                    placeholder="Select a product..."
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {option.name}
                      </Typography>
                      {option.description && (
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newOrderLine.quantity}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newOrderLine.unit}
                  label="Unit"
                  onChange={(e) => setNewOrderLine(prev => ({ ...prev, unit: e.target.value }))}
                >
                  <MenuItem value="MT">MT (Metric Tons)</MenuItem>
                  <MenuItem value="TEU">TEU (Twenty-foot Equivalent Unit)</MenuItem>
                  <MenuItem value="FEU">FEU (Forty-foot Equivalent Unit)</MenuItem>
                  <MenuItem value="M3">M³ (Cubic Meters)</MenuItem>
                  <MenuItem value="L">L (Liters)</MenuItem>
                  <MenuItem value="KG">KG (Kilograms)</MenuItem>
                  <MenuItem value="PCS">PCS (Pieces)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <TextField
                fullWidth
                label="Unit Price (NOK)"
                type="number"
                value={newOrderLine.unit_price}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, unit_price: Number(e.target.value) }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Cargo Type"
                value={newOrderLine.cargo_type}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, cargo_type: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Package Type"
                value={newOrderLine.package_type}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, package_type: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Weight (MT)"
                type="number"
                value={newOrderLine.weight}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, weight: Number(e.target.value) }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                label="Volume (M³)"
                type="number"
                value={newOrderLine.volume}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, volume: Number(e.target.value) }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={2}
                value={newOrderLine.remarks}
                onChange={(e) => setNewOrderLine(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderLineDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddOrderLine} variant="contained">
            Add Order Line
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderForm;
