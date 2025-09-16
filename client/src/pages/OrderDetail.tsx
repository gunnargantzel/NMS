import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Science as ScienceIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { mockApi, Order, TimelogEntry, SamplingRecord, OrderLine } from '../services/mockApi';

// Interfaces are now imported from mockApi

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [timelogEntries, setTimelogEntries] = useState<TimelogEntry[]>([]);
  const [samplingRecords, setSamplingRecords] = useState<SamplingRecord[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openTimelogDialog, setOpenTimelogDialog] = useState(false);
  const [openSamplingDialog, setOpenSamplingDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [newTimelogEntry, setNewTimelogEntry] = useState({
    start_time: dayjs().format(),
    end_time: '',
    activity: '',
    remarks: '',
    selected_port: '', // Add port selection for timelog entries
  });
  const [newSamplingRecord, setNewSamplingRecord] = useState({
    sample_type: '',
    quantity: '',
    destination: '',
    seal_number: '',
    remarks: '',
    selected_port: '' // Add port selection for sampling records
  });
  const [emailMessage, setEmailMessage] = useState('');

  const fetchOrderDetails = useCallback(async () => {
    try {
      const orderResponse = await mockApi.getOrder(parseInt(id!));
      setOrder(orderResponse);

      // Fetch order lines, timelog, and sampling for all sub-orders if this is a main order
      if (orderResponse.is_main_order && orderResponse.sub_orders) {
        const allOrderLines = [];
        const allTimelogEntries = [];
        const allSamplingRecords = [];
        
        for (const subOrder of orderResponse.sub_orders) {
          const [subOrderLines, timelogResponse, samplingResponse] = await Promise.all([
            mockApi.getOrderLines(subOrder.id),
            mockApi.getTimelogEntries(subOrder.id),
            mockApi.getSamplingRecords(subOrder.id)
          ]);
          
          allOrderLines.push(...subOrderLines);
          allTimelogEntries.push(...timelogResponse.entries);
          allSamplingRecords.push(...samplingResponse);
        }
        
        setOrderLines(allOrderLines);
        setTimelogEntries(allTimelogEntries);
        setSamplingRecords(allSamplingRecords);
      } else {
        // For sub-orders, fetch data directly
        const [orderLinesResponse, timelogResponse, samplingResponse] = await Promise.all([
          mockApi.getOrderLines(parseInt(id!)),
          mockApi.getTimelogEntries(parseInt(id!)),
          mockApi.getSamplingRecords(parseInt(id!))
        ]);
        
        setOrderLines(orderLinesResponse);
        setTimelogEntries(timelogResponse.entries);
        setSamplingRecords(samplingResponse);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchActivities = async () => {
    try {
      const response = await mockApi.getActivities();
      setActivities(response.map((a: any) => a.activity));
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchActivities();
    }
  }, [id, fetchOrderDetails]);

  const handleAddTimelogEntry = async () => {
    try {
      const subOrderId = newTimelogEntry.selected_port ? 
        parseInt(newTimelogEntry.selected_port) : 
        parseInt(id!);
        
      await mockApi.createTimelogEntry({
        sub_order_id: subOrderId,
        activity: newTimelogEntry.activity,
        start_time: newTimelogEntry.start_time,
        end_time: newTimelogEntry.end_time || undefined,
        remarks: newTimelogEntry.remarks,
      });
      setOpenTimelogDialog(false);
      setNewTimelogEntry({ start_time: dayjs().format(), end_time: '', activity: '', remarks: '', selected_port: '' });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error adding timelog entry:', error);
    }
  };

  const handleAddSamplingRecord = async () => {
    try {
      const subOrderId = newSamplingRecord.selected_port ? 
        parseInt(newSamplingRecord.selected_port) : 
        parseInt(id!);
        
      await mockApi.createSamplingRecord({
        sub_order_id: subOrderId,
        sample_number: `S-${Date.now()}`,
        sample_type: newSamplingRecord.sample_type,
        laboratory: 'Demo Lab',
        analysis_type: 'Quality Check',
        status: 'Pending',
      });
      setOpenSamplingDialog(false);
      setNewSamplingRecord({
        sample_type: '',
        quantity: '',
        destination: '',
        seal_number: '',
        remarks: '',
        selected_port: '',
      });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error adding sampling record:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      // For demo purposes, just show a success message
      alert('Email sent successfully! (Demo mode)');
      setOpenEmailDialog(false);
      setEmailMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nb-NO');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!order) {
    return <Typography>Order not found</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Order Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => setOpenEmailDialog(true)}
            sx={{ mr: 1 }}
          >
            Send Email
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/orders/${id}/edit`)}
          >
            Edit Order
          </Button>
        </Box>
      </Box>

      {/* Order Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Number
              </Typography>
              <Typography variant="h6">{order.order_number}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Client
              </Typography>
              <Typography variant="body1">{order.client_name}</Typography>
              {order.client_email && (
                <Typography variant="body2" color="text.secondary">
                  {order.client_email}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Vessel
              </Typography>
              <Typography variant="body1">{order.vessel_name || '-'}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Port{order.is_main_order && order.total_ports && order.total_ports > 1 ? 's' : ''}
              </Typography>
              <Typography variant="body1">{order.port || '-'}</Typography>
              {order.is_main_order && order.sub_orders && order.sub_orders.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Subordrer:
                  </Typography>
                  {order.sub_orders.map((subOrder, index) => (
                    <Box key={subOrder.id} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" sx={{ mr: 1 }}>
                        {index + 1}.
                      </Typography>
                      <Typography variant="caption">
                        {subOrder.port} ({subOrder.status})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Survey Type
              </Typography>
              <Typography variant="body1">{order.survey_type}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status) as any}
                size="small"
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">{formatDate(order.created_at)}</Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Created By
              </Typography>
              <Typography variant="body1">{order.created_by_name || order.created_by}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab
              icon={<ScheduleIcon />}
              label="Timelog"
              iconPosition="start"
            />
            <Tab
              icon={<ScienceIcon />}
              label="Sampling"
              iconPosition="start"
            />
            <Tab
              icon={<CommentIcon />}
              label="Order Lines"
              iconPosition="start"
            />
            <Tab
              icon={<CommentIcon />}
              label="Remarks"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Timelog Entries</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenTimelogDialog(true)}
            >
              Add Entry
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Port/Harbor</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Activity</TableCell>
                      <TableCell>Remarks</TableCell>
                      <TableCell>Created By</TableCell>
                    </TableRow>
                  </TableHead>
              <TableBody>
                {timelogEntries.map((entry) => {
                  const startTime = entry.start_time || entry.timestamp;
                  const endTime = entry.end_time;
                  const duration = startTime && endTime 
                    ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)) // minutes
                    : null;
                  
                  // Find the port name for this timelog entry
                  const portName = order?.sub_orders?.find(sub => sub.id === entry.sub_order_id)?.port || 'Unknown Port';
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Chip 
                          label={portName} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(startTime || '')}</TableCell>
                      <TableCell>{endTime ? formatDate(endTime) : '-'}</TableCell>
                      <TableCell>
                        {duration !== null ? `${duration} min` : '-'}
                      </TableCell>
                      <TableCell>{entry.activity}</TableCell>
                      <TableCell>{entry.remarks || '-'}</TableCell>
                      <TableCell>{entry.created_by_name || entry.created_by}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sampling Records</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenSamplingDialog(true)}
            >
              Add Record
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Port/Harbor</TableCell>
                  <TableCell>Sample Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Seal Number</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samplingRecords.map((record) => {
                  // Find the port name for this sampling record
                  const portName = order?.sub_orders?.find(sub => sub.id === record.sub_order_id)?.port || 'Unknown Port';
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Chip 
                          label={portName} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{record.sample_type}</TableCell>
                      <TableCell>{record.quantity || '-'}</TableCell>
                      <TableCell>{record.destination || '-'}</TableCell>
                      <TableCell>{record.seal_number || record.sample_number || '-'}</TableCell>
                      <TableCell>{record.remarks || '-'}</TableCell>
                      <TableCell>{record.created_by_name || record.created_by}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Order Lines
          </Typography>
          {orderLines.length === 0 ? (
            <Alert severity="info">
              No order lines found for this order.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Port/Harbor</TableCell>
                    <TableCell>Line</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Cargo Type</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderLines.map((line) => {
                    // Find the port name for this order line
                    const portName = order?.sub_orders?.find(sub => sub.id === line.sub_order_id)?.port || 'Unknown Port';
                    
                    return (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Chip 
                            label={portName} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{line.line_number}</TableCell>
                        <TableCell>{line.description}</TableCell>
                        <TableCell>{line.quantity}</TableCell>
                        <TableCell>{line.unit}</TableCell>
                        <TableCell>NOK {line.unit_price.toFixed(2)}</TableCell>
                        <TableCell>NOK {line.total_price.toFixed(2)}</TableCell>
                        <TableCell>{line.cargo_type || '-'}</TableCell>
                        <TableCell>{line.weight ? `${line.weight} MT` : '-'}</TableCell>
                        <TableCell>{line.volume ? `${line.volume} M³` : '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Remarks
          </Typography>
          <Alert severity="info">
            Remarks functionality will be implemented in the next version.
          </Alert>
        </TabPanel>
      </Card>

      {/* Timelog Dialog */}
      <Dialog open={openTimelogDialog} onClose={() => setOpenTimelogDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Timelog Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Port/Harbor</InputLabel>
              <Select
                value={newTimelogEntry.selected_port || ''}
                label="Port/Harbor"
                onChange={(e) => setNewTimelogEntry(prev => ({ ...prev, selected_port: e.target.value }))}
              >
                {order?.is_main_order && order?.sub_orders ? 
                  order.sub_orders.map((subOrder) => (
                    <MenuItem key={subOrder.id} value={subOrder.id.toString()}>
                      {subOrder.port}
                    </MenuItem>
                  )) :
                  <MenuItem value={id || ''}>
                    {order?.port || 'Current Port'}
                  </MenuItem>
                }
              </Select>
            </FormControl>
            <DateTimePicker
              label="Start Time"
              value={dayjs(newTimelogEntry.start_time)}
              onChange={(newValue) => setNewTimelogEntry(prev => ({
                ...prev,
                start_time: newValue?.format() || dayjs().format()
              }))}
              sx={{ mb: 2, width: '100%' }}
            />
            <DateTimePicker
              label="End Time (Optional)"
              value={newTimelogEntry.end_time ? dayjs(newTimelogEntry.end_time) : null}
              onChange={(newValue) => setNewTimelogEntry(prev => ({
                ...prev,
                end_time: newValue?.format() || ''
              }))}
              sx={{ mb: 2, width: '100%' }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Activity</InputLabel>
              <Select
                value={newTimelogEntry.activity}
                label="Activity"
                onChange={(e) => setNewTimelogEntry(prev => ({ ...prev, activity: e.target.value }))}
              >
                {activities.map((activity) => (
                  <MenuItem key={activity} value={activity}>
                    {activity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={3}
              value={newTimelogEntry.remarks}
              onChange={(e) => setNewTimelogEntry(prev => ({ ...prev, remarks: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimelogDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTimelogEntry} variant="contained">Add Entry</Button>
        </DialogActions>
      </Dialog>

      {/* Sampling Dialog */}
      <Dialog open={openSamplingDialog} onClose={() => setOpenSamplingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Sampling Record</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Port/Harbor</InputLabel>
              <Select
                value={newSamplingRecord.selected_port || ''}
                label="Port/Harbor"
                onChange={(e) => setNewSamplingRecord(prev => ({ ...prev, selected_port: e.target.value }))}
              >
                {order?.is_main_order && order?.sub_orders ? 
                  order.sub_orders.map((subOrder) => (
                    <MenuItem key={subOrder.id} value={subOrder.id.toString()}>
                      {subOrder.port}
                    </MenuItem>
                  )) :
                  <MenuItem value={id || ''}>
                    {order?.port || 'Current Port'}
                  </MenuItem>
                }
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Sample Type"
              value={newSamplingRecord.sample_type}
              onChange={(e) => setNewSamplingRecord(prev => ({ ...prev, sample_type: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Quantity"
              value={newSamplingRecord.quantity}
              onChange={(e) => setNewSamplingRecord(prev => ({ ...prev, quantity: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Destination"
              value={newSamplingRecord.destination}
              onChange={(e) => setNewSamplingRecord(prev => ({ ...prev, destination: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Seal Number"
              value={newSamplingRecord.seal_number}
              onChange={(e) => setNewSamplingRecord(prev => ({ ...prev, seal_number: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={3}
              value={newSamplingRecord.remarks}
              onChange={(e) => setNewSamplingRecord(prev => ({ ...prev, remarks: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSamplingDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSamplingRecord} variant="contained">Add Record</Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Order Confirmation Email</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Custom Message (optional)"
              multiline
              rows={4}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Add a custom message to include in the email..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained">Send Email</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail;
