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
import { Customer, ContactPerson, SurveyType, OrderLine, Product } from '../types';
import { mockPorts } from '../data/mockPorts';

interface ShipFormData {
  vessel_name: string;
  vessel_imo: string;
  vessel_flag: string;
  expected_arrival: string;
  expected_departure: string;
  ports: string[];
  remarks: string;
}

interface OrderFormData {
  // Customer Information
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  contact_person_id: number | null;
  
  // Survey Information
  survey_type: string;
  remarks: string;
  
  // Ships Information
  ships: ShipFormData[];
  
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
    survey_type: '',
    remarks: '',
    ships: [{
      vessel_name: '',
      vessel_imo: '',
      vessel_flag: 'NO',
      expected_arrival: '',
      expected_departure: '',
      ports: [],
      remarks: ''
    }],
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
      const [customersData, surveyTypesData, productsData] = await Promise.all([
        mockApi.getCustomers(),
        mockApi.getSurveyTypes(),
        mockApi.getProducts()
      ]);
      
      setCustomers(customersData);
      setSurveyTypes(surveyTypesData);
      setProducts(productsData);
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
      const shipsData: ShipFormData[] = order.ships?.map(ship => ({
        vessel_name: ship.vessel_name || '',
        vessel_imo: ship.vessel_imo || '',
        vessel_flag: ship.vessel_flag || 'NO',
        expected_arrival: ship.expected_arrival || '',
        expected_departure: ship.expected_departure || '',
        ports: ship.ship_ports?.map(sp => sp.port_name) || [],
        remarks: ship.remarks || ''
      })) || [{
        vessel_name: '',
        vessel_imo: '',
        vessel_flag: 'NO',
        expected_arrival: '',
        expected_departure: '',
        ports: [],
        remarks: ''
      }];

      setFormData({
        customer_id: null, // Will be set based on customer name
        customer_name: order.client_name || '',
        customer_email: order.client_email || '',
        contact_person_id: null,
        survey_type: order.survey_type || '',
        remarks: order.remarks || '',
        ships: shipsData,
        order_lines: [] // Will be populated from ship ports
      });

      // Load order lines from ship ports
      if (order.ships) {
        const allOrderLines: OrderLine[] = [];
        for (const ship of order.ships) {
          if (ship.ship_ports) {
            for (const shipPort of ship.ship_ports) {
              const shipPortLines = await mockApi.getOrderLines(shipPort.id);
              allOrderLines.push(...shipPortLines);
            }
          }
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
      const contacts = await mockApi.getContactPersons();
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


  // Ship management functions
  const handleAddShip = () => {
    setFormData(prev => ({
      ...prev,
      ships: [...prev.ships, {
        vessel_name: '',
        vessel_imo: '',
        vessel_flag: 'NO',
        expected_arrival: '',
        expected_departure: '',
        ports: [],
        remarks: ''
      }]
    }));
  };

  const handleRemoveShip = (shipIndex: number) => {
    setFormData(prev => ({
      ...prev,
      ships: prev.ships.filter((_, index) => index !== shipIndex)
    }));
  };

  const handleShipChange = (shipIndex: number, field: keyof ShipFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      ships: prev.ships.map((ship, index) => 
        index === shipIndex ? { ...ship, [field]: value } : ship
      )
    }));
  };

  const handleAddPortToShip = (shipIndex: number, port: string) => {
    if (port && !formData.ships[shipIndex].ports.includes(port)) {
      setFormData(prev => ({
        ...prev,
        ships: prev.ships.map((ship, index) => 
          index === shipIndex 
            ? { ...ship, ports: [...ship.ports, port] }
            : ship
        )
      }));
    }
  };

  const handleRemovePortFromShip = (shipIndex: number, portToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      ships: prev.ships.map((ship, index) => 
        index === shipIndex 
          ? { ...ship, ports: ship.ports.filter(port => port !== portToRemove) }
          : ship
      )
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
      ship_port_id: 0, // Will be set when order is created - order lines belong to specific ports/harbors
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
      // Calculate total ports across all ships
      const totalPorts = formData.ships.reduce((sum, ship) => sum + ship.ports.length, 0);
      
      // Create the order with ships data
      const orderData = {
        client_name: formData.customer_name,
        client_email: formData.customer_email,
        survey_type: formData.survey_type,
        status: 'pending' as const,
        total_ships: formData.ships.length,
        total_ports: totalPorts,
        remarks: formData.remarks,
        ships: formData.ships.map(ship => ({
          vessel_name: ship.vessel_name,
          vessel_imo: ship.vessel_imo,
          vessel_flag: ship.vessel_flag,
          expected_arrival: ship.expected_arrival,
          expected_departure: ship.expected_departure,
          remarks: ship.remarks,
          ports: ship.ports.map((portName, index) => ({
            port_name: portName,
            port_sequence: index + 1,
            status: 'pending'
          }))
        }))
      };
      
      const response = await mockApi.createOrder(orderData);
      
      // Create order lines for each ship port
      let shipPortIndex = 0;
      for (const ship of formData.ships) {
        for (const port of ship.ports) {
          // Find order lines assigned to this ship/port combination
          const relevantLines = formData.order_lines.filter(line => 
            line.selected_port === `${ship.vessel_name} - ${port}` || 
            line.selected_port === '' // Default to first ship port if no selection
          );
          
          for (const line of relevantLines) {
            await mockApi.createOrderLine({
              ...line,
              ship_port_id: shipPortIndex + 1 // This would be the actual ship_port_id in real implementation
            });
          }
          shipPortIndex++;
        }
      }
      
      setSuccess(`Order ${response.orderNumber} created successfully with ${formData.ships.length} ship(s)!`);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Ships Information ({formData.ships.length} ship{formData.ships.length !== 1 ? 's' : ''})
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddShip}
          size="small"
        >
          Add Ship
        </Button>
      </Box>
      
      {formData.ships.map((ship, shipIndex) => (
        <Card key={shipIndex} sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              Ship {shipIndex + 1}: {ship.vessel_name || 'Unnamed Vessel'}
            </Typography>
            {formData.ships.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveShip(shipIndex)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Vessel Name"
              value={ship.vessel_name}
              onChange={(e) => handleShipChange(shipIndex, 'vessel_name', e.target.value)}
              required
              sx={{ flex: '1 1 300px', minWidth: '300px' }}
            />
            
            <TextField
              fullWidth
              label="IMO Number"
              value={ship.vessel_imo}
              onChange={(e) => handleShipChange(shipIndex, 'vessel_imo', e.target.value)}
              sx={{ flex: '1 1 200px', minWidth: '200px' }}
            />
            
            <TextField
              fullWidth
              label="Flag State"
              value={ship.vessel_flag}
              onChange={(e) => handleShipChange(shipIndex, 'vessel_flag', e.target.value)}
              sx={{ flex: '1 1 150px', minWidth: '150px' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Expected Arrival"
              type="datetime-local"
              value={ship.expected_arrival}
              onChange={(e) => handleShipChange(shipIndex, 'expected_arrival', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: '1 1 250px', minWidth: '250px' }}
            />
            
            <TextField
              fullWidth
              label="Expected Departure"
              type="datetime-local"
              value={ship.expected_departure}
              onChange={(e) => handleShipChange(shipIndex, 'expected_departure', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: '1 1 250px', minWidth: '250px' }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ports for this ship ({ship.ports.length} port{ship.ports.length !== 1 ? 's' : ''})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Add Port</InputLabel>
                <Select
                  value=""
                  label="Add Port"
                  onChange={(e) => handleAddPortToShip(shipIndex, e.target.value)}
                >
                  {mockPorts.filter(port => !ship.ports.includes(port.name)).map((port) => (
                    <MenuItem key={port.id} value={port.name}>
                      {port.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {ship.ports.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {ship.ports.map((port, portIndex) => (
                  <Chip
                    key={portIndex}
                    label={`${portIndex + 1}. ${port}`}
                    onDelete={() => handleRemovePortFromShip(shipIndex, port)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Ship Remarks"
            value={ship.remarks}
            onChange={(e) => handleShipChange(shipIndex, 'remarks', e.target.value)}
            multiline
            rows={2}
            placeholder="Additional notes for this ship..."
          />
        </Card>
      ))}
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
        
        <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
          <TextField
            fullWidth
            label="Order Remarks"
            value={formData.remarks}
            onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
            multiline
            rows={3}
            placeholder="Additional notes for this order..."
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
        
        <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ships Information ({formData.ships.length} ship{formData.ships.length !== 1 ? 's' : ''})
              </Typography>
              {formData.ships.map((ship, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Ship {index + 1}: {ship.vessel_name || 'Unnamed Vessel'}</strong>
                  </Typography>
                  <Typography><strong>IMO:</strong> {ship.vessel_imo || 'N/A'}</Typography>
                  <Typography><strong>Flag:</strong> {ship.vessel_flag}</Typography>
                  <Typography><strong>Expected Arrival:</strong> {ship.expected_arrival || 'N/A'}</Typography>
                  <Typography><strong>Expected Departure:</strong> {ship.expected_departure || 'N/A'}</Typography>
                  <Typography><strong>Ports ({ship.ports.length}):</strong> {ship.ports.join(', ') || 'None'}</Typography>
                  {ship.remarks && (
                    <Typography><strong>Ship Remarks:</strong> {ship.remarks}</Typography>
                  )}
                </Box>
              ))}
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
              {formData.remarks && (
                <Typography><strong>Order Remarks:</strong> {formData.remarks}</Typography>
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
                <InputLabel>Ship & Port</InputLabel>
                <Select
                  value={newOrderLine.selected_port}
                  label="Ship & Port"
                  onChange={(e) => setNewOrderLine(prev => ({ ...prev, selected_port: e.target.value }))}
                >
                  {formData.ships.map((ship, shipIndex) => 
                    ship.ports.map((port, portIndex) => (
                      <MenuItem key={`${shipIndex}-${portIndex}`} value={`${ship.vessel_name} - ${port}`}>
                        {ship.vessel_name} - {port}
                      </MenuItem>
                    ))
                  ).flat()}
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
