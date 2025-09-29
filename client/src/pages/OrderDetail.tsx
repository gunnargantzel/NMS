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
import { mockApi } from '../services/mockApi';
import { Order, TimelogEntry, SamplingRecord, OrderLine } from '../types';

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
  const [remarks, setRemarks] = useState<any[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openTimelogDialog, setOpenTimelogDialog] = useState(false);
  const [openSamplingDialog, setOpenSamplingDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
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
  const [newRemark, setNewRemark] = useState({
    content: '',
    selected_port: '' // Add port selection for remarks
  });
  const [emailMessage, setEmailMessage] = useState('');
  
  // Order line editing state
  const [editingOrderLine, setEditingOrderLine] = useState<OrderLine | null>(null);
  const [editOrderLineDialog, setEditOrderLineDialog] = useState(false);
  const [editOrderLineData, setEditOrderLineData] = useState({
    description: '',
    quantity: 0,
    unit: '',
    unit_price: 0,
    total_price: 0,
    cargo_type: '',
    package_type: '',
    weight: 0,
    volume: 0,
    remarks: '',
    selected_port: ''
  });

  // Edit states for timelog entries
  const [editingTimelogEntry, setEditingTimelogEntry] = useState<TimelogEntry | null>(null);
  const [editTimelogDialog, setEditTimelogDialog] = useState(false);
  const [editTimelogData, setEditTimelogData] = useState({
    activity: '',
    start_time: dayjs().format(),
    end_time: dayjs().format(),
    duration: 0,
    description: '',
    selected_port: ''
  });

  // Edit states for sampling records
  const [editingSamplingRecord, setEditingSamplingRecord] = useState<SamplingRecord | null>(null);
  const [editSamplingDialog, setEditSamplingDialog] = useState(false);
  const [editSamplingData, setEditSamplingData] = useState({
    sample_type: '',
    quantity: '',
    description: '',
    selected_port: ''
  });

  // Edit states for remarks
  const [editingRemark, setEditingRemark] = useState<any | null>(null);
  const [editRemarkDialog, setEditRemarkDialog] = useState(false);
  const [editRemarkData, setEditRemarkData] = useState({
    content: '',
    selected_port: ''
  });

  const fetchOrderDetails = useCallback(async () => {
    try {
      const orderResponse = await mockApi.getOrder(parseInt(id!));
      setOrder(orderResponse);

      // Fetch order lines, timelog, and sampling for all ship ports
      if (orderResponse.ships) {
        const allOrderLines = [];
        const allTimelogEntries = [];
        const allSamplingRecords = [];
        const allRemarks = [];
        
        for (const ship of orderResponse.ships) {
          if (ship.ship_ports) {
            for (const shipPort of ship.ship_ports) {
              const [shipPortLines, timelogResponse, samplingResponse, remarksResponse] = await Promise.all([
                mockApi.getOrderLines(shipPort.id),
                mockApi.getTimelogEntries(shipPort.id),
                mockApi.getSamplingRecords(shipPort.id),
                mockApi.getRemarks(shipPort.id)
              ]);
          
              allOrderLines.push(...shipPortLines);
              allTimelogEntries.push(...timelogResponse.entries);
              allSamplingRecords.push(...samplingResponse);
              allRemarks.push(...remarksResponse);
            }
          }
        }
        
        setOrderLines(allOrderLines);
        setTimelogEntries(allTimelogEntries);
        setSamplingRecords(allSamplingRecords);
        setRemarks(allRemarks);
      } else {
        // Fallback for orders without ships (legacy support)
        const [orderLinesResponse, timelogResponse, samplingResponse, remarksResponse] = await Promise.all([
          mockApi.getOrderLines(parseInt(id!)),
          mockApi.getTimelogEntries(parseInt(id!)),
          mockApi.getSamplingRecords(parseInt(id!)),
          mockApi.getRemarks(parseInt(id!))
        ]);
        
        setOrderLines(orderLinesResponse);
        setTimelogEntries(timelogResponse.entries);
        setSamplingRecords(samplingResponse);
        setRemarks(remarksResponse);
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

  const handleAddRemark = async () => {
    try {
      await mockApi.createRemark({
        content: newRemark.content,
        sub_order_id: parseInt(newRemark.selected_port)
      });
      
      setOpenRemarksDialog(false);
      setNewRemark({ content: '', selected_port: '' });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error adding remark:', error);
    }
  };

  const handleEditOrderLine = (line: OrderLine) => {
    setEditingOrderLine(line);
    setEditOrderLineData({
      description: line.description,
      quantity: line.quantity,
      unit: line.unit,
      unit_price: line.unit_price,
      total_price: line.total_price,
      cargo_type: line.cargo_type || '',
      package_type: line.package_type || '',
      weight: line.weight || 0,
      volume: line.volume || 0,
      remarks: line.remarks || '',
      selected_port: line.selected_port || ''
    });
    setEditOrderLineDialog(true);
  };

  const handleUpdateOrderLine = async () => {
    if (!editingOrderLine) return;
    
    try {
      await mockApi.updateOrderLine(editingOrderLine.id, {
        description: editOrderLineData.description,
        quantity: editOrderLineData.quantity,
        unit: editOrderLineData.unit,
        unit_price: editOrderLineData.unit_price,
        total_price: editOrderLineData.total_price,
        cargo_type: editOrderLineData.cargo_type,
        package_type: editOrderLineData.package_type,
        weight: editOrderLineData.weight,
        volume: editOrderLineData.volume,
        remarks: editOrderLineData.remarks
      });
      
      setEditOrderLineDialog(false);
      setEditingOrderLine(null);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating order line:', error);
    }
  };

  // Edit functions for timelog entries
  const handleEditTimelogEntry = (entry: TimelogEntry) => {
    setEditingTimelogEntry(entry);
    setEditTimelogData({
      activity: entry.activity,
      start_time: entry.start_time,
      end_time: entry.end_time || '',
      duration: entry.duration || 0,
      description: entry.remarks || '',
      selected_port: entry.sub_order_id.toString()
    });
    setEditTimelogDialog(true);
  };

  const handleUpdateTimelogEntry = async () => {
    if (!editingTimelogEntry) return;
    
    try {
      await mockApi.updateTimelogEntry(editingTimelogEntry.id, {
        activity: editTimelogData.activity,
        start_time: editTimelogData.start_time,
        end_time: editTimelogData.end_time,
        duration: editTimelogData.duration,
        remarks: editTimelogData.description,
        sub_order_id: parseInt(editTimelogData.selected_port)
      });
      
      setEditTimelogDialog(false);
      setEditingTimelogEntry(null);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating timelog entry:', error);
    }
  };

  // Edit functions for sampling records
  const handleEditSamplingRecord = (record: SamplingRecord) => {
    setEditingSamplingRecord(record);
    setEditSamplingData({
      sample_type: record.sample_type,
      quantity: record.quantity || '',
      description: record.remarks || '',
      selected_port: record.sub_order_id.toString()
    });
    setEditSamplingDialog(true);
  };

  const handleUpdateSamplingRecord = async () => {
    if (!editingSamplingRecord) return;
    
    try {
      await mockApi.updateSamplingRecord(editingSamplingRecord.id, {
        sample_type: editSamplingData.sample_type,
        quantity: editSamplingData.quantity,
        remarks: editSamplingData.description,
        sub_order_id: parseInt(editSamplingData.selected_port)
      });
      
      setEditSamplingDialog(false);
      setEditingSamplingRecord(null);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating sampling record:', error);
    }
  };

  // Edit functions for remarks
  const handleEditRemark = (remark: any) => {
    setEditingRemark(remark);
    setEditRemarkData({
      content: remark.content,
      selected_port: remark.sub_order_id.toString()
    });
    setEditRemarkDialog(true);
  };

  const handleUpdateRemark = async () => {
    if (!editingRemark) return;
    
    try {
      await mockApi.updateRemark(editingRemark.id, {
        content: editRemarkData.content,
        sub_order_id: parseInt(editRemarkData.selected_port)
      });
      
      setEditRemarkDialog(false);
      setEditingRemark(null);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating remark:', error);
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
                Ships ({order.ships?.length || 0})
              </Typography>
              <Typography variant="body1">
                {order.ships?.map(ship => ship.vessel_name).join(', ') || '-'}
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ports ({order.total_ports || 0})
              </Typography>
              <Typography variant="body1">
                {order.ships?.flatMap(ship => ship.ship_ports?.map(sp => sp.port_name) || []).join(', ') || '-'}
              </Typography>
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
                color={getStatusColor(order.status || 'pending') as any}
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
                      <TableCell>Actions</TableCell>
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
                  const portName = order?.ships?.flatMap(ship => ship.ship_ports || [])
                    .find(sp => sp.id === entry.ship_port_id)?.port_name || 'Unknown Port';
                  
                  return (
                    <TableRow 
                      key={entry.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
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
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditTimelogEntry(entry)}
                        >
                          Edit
                        </Button>
                      </TableCell>
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samplingRecords.map((record) => {
                  // Find the port name for this sampling record
                  const portName = order?.ships?.flatMap(ship => ship.ship_ports || [])
                    .find(sp => sp.id === record.ship_port_id)?.port_name || 'Unknown Port';
                  
                  return (
                    <TableRow 
                      key={record.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
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
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditSamplingRecord(record)}
                        >
                          Edit
                        </Button>
                      </TableCell>
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderLines.map((line) => {
                    // Find the port name for this order line
                    const portName = order?.ships?.flatMap(ship => ship.ship_ports || [])
                      .find(sp => sp.id === line.ship_port_id)?.port_name || 'Unknown Port';
                    
                    return (
                      <TableRow 
                        key={line.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          }
                        }}
                      >
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
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditOrderLine(line)}
                          >
                            Edit
                          </Button>
                        </TableCell>
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
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenRemarksDialog(true)}
            >
              Add Remark
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Port/Harbor</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {remarks.map((remark) => {
                  // Find the port name for this remark
                  const portName = order?.ships?.flatMap(ship => ship.ship_ports || [])
                    .find(sp => sp.id === remark.ship_port_id)?.port_name || 'Unknown Port';
                  
                  return (
                    <TableRow 
                      key={remark.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={portName} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{remark.content}</TableCell>
                      <TableCell>{remark.created_by_name || remark.created_by}</TableCell>
                      <TableCell>{formatDate(remark.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditRemark(remark)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
                {order?.ships?.flatMap(ship => ship.ship_ports || []).map((shipPort) => (
                  <MenuItem key={shipPort.id} value={shipPort.id.toString()}>
                    {shipPort.port_name}
                  </MenuItem>
                )) || (
                  <MenuItem value={id || ''}>
                    {order?.ships?.[0]?.vessel_name || 'Current Port'}
                  </MenuItem>
                )}
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
                {order?.ships?.flatMap(ship => ship.ship_ports || []).map((shipPort) => (
                  <MenuItem key={shipPort.id} value={shipPort.id.toString()}>
                    {shipPort.port_name}
                  </MenuItem>
                )) || (
                  <MenuItem value={id || ''}>
                    {order?.ships?.[0]?.vessel_name || 'Current Port'}
                  </MenuItem>
                )}
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

      {/* Remarks Dialog */}
      <Dialog open={openRemarksDialog} onClose={() => setOpenRemarksDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Port/Harbor</InputLabel>
              <Select
                value={newRemark.selected_port || ''}
                label="Port/Harbor"
                onChange={(e) => setNewRemark(prev => ({ ...prev, selected_port: e.target.value }))}
              >
                {order?.ships?.flatMap(ship => ship.ship_ports || []).map((shipPort) => (
                  <MenuItem key={shipPort.id} value={shipPort.id.toString()}>
                    {shipPort.port_name}
                  </MenuItem>
                )) || (
                  <MenuItem value={id || ''}>
                    {order?.ships?.[0]?.vessel_name || 'Current Port'}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Remark Content"
              multiline
              rows={4}
              value={newRemark.content}
              onChange={(e) => setNewRemark(prev => ({ ...prev, content: e.target.value }))}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemarksDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRemark} variant="contained">Add Remark</Button>
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

      {/* Edit Order Line Dialog */}
      <Dialog open={editOrderLineDialog} onClose={() => setEditOrderLineDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Order Line</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Description"
              value={editOrderLineData.description}
              onChange={(e) => setEditOrderLineData(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Quantity"
                type="number"
                value={editOrderLineData.quantity}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Unit"
                value={editOrderLineData.unit}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, unit: e.target.value }))}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Unit Price"
                type="number"
                value={editOrderLineData.unit_price}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Total Price"
                type="number"
                value={editOrderLineData.total_price}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, total_price: parseFloat(e.target.value) || 0 }))}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Cargo Type"
                value={editOrderLineData.cargo_type}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, cargo_type: e.target.value }))}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Package Type"
                value={editOrderLineData.package_type}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, package_type: e.target.value }))}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Weight (MT)"
                type="number"
                value={editOrderLineData.weight}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Volume (M³)"
                type="number"
                value={editOrderLineData.volume}
                onChange={(e) => setEditOrderLineData(prev => ({ ...prev, volume: parseFloat(e.target.value) || 0 }))}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={3}
              value={editOrderLineData.remarks}
              onChange={(e) => setEditOrderLineData(prev => ({ ...prev, remarks: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOrderLineDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateOrderLine} variant="contained">Update Order Line</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Timelog Entry Dialog */}
      <Dialog open={editTimelogDialog} onClose={() => setEditTimelogDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Timelog Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Port/Harbor</InputLabel>
              <Select
                value={editTimelogData.selected_port}
                onChange={(e) => setEditTimelogData(prev => ({ ...prev, selected_port: e.target.value }))}
                label="Port/Harbor"
              >
                {order?.ships?.flatMap(ship => ship.ship_ports || []).map((shipPort) => (
                  <MenuItem key={shipPort.id} value={shipPort.id.toString()}>
                    {shipPort.port_name}
                  </MenuItem>
                )) || (
                  <MenuItem value={order?.id?.toString() || ''}>
                    {order?.port || 'Current Port'}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Activity</InputLabel>
              <Select
                value={editTimelogData.activity}
                onChange={(e) => setEditTimelogData(prev => ({ ...prev, activity: e.target.value }))}
                label="Activity"
              >
                {activities.map((activity) => (
                  <MenuItem key={activity} value={activity}>
                    {activity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DateTimePicker
              label="Start Time"
              value={dayjs(editTimelogData.start_time)}
              onChange={(newValue) => setEditTimelogData(prev => ({ 
                ...prev, 
                start_time: newValue?.format() || dayjs().format() 
              }))}
              sx={{ mb: 2, width: '100%' }}
            />
            <DateTimePicker
              label="End Time"
              value={editTimelogData.end_time ? dayjs(editTimelogData.end_time) : null}
              onChange={(newValue) => setEditTimelogData(prev => ({ 
                ...prev, 
                end_time: newValue?.format() || '' 
              }))}
              sx={{ mb: 2, width: '100%' }}
            />
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={editTimelogData.duration}
              onChange={(e) => setEditTimelogData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editTimelogData.description}
              onChange={(e) => setEditTimelogData(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTimelogDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTimelogEntry} variant="contained">Update Timelog Entry</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Sampling Record Dialog */}
      <Dialog open={editSamplingDialog} onClose={() => setEditSamplingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Sampling Record</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Port/Harbor</InputLabel>
              <Select
                value={editSamplingData.selected_port}
                onChange={(e) => setEditSamplingData(prev => ({ ...prev, selected_port: e.target.value }))}
                label="Port/Harbor"
              >
                {order?.ships?.flatMap(ship => ship.ship_ports || []).map((shipPort) => (
                  <MenuItem key={shipPort.id} value={shipPort.id.toString()}>
                    {shipPort.port_name}
                  </MenuItem>
                )) || (
                  <MenuItem value={order?.id?.toString() || ''}>
                    {order?.port || 'Current Port'}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Sample Type"
              value={editSamplingData.sample_type}
              onChange={(e) => setEditSamplingData(prev => ({ ...prev, sample_type: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Quantity"
              value={editSamplingData.quantity}
              onChange={(e) => setEditSamplingData(prev => ({ ...prev, quantity: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editSamplingData.description}
              onChange={(e) => setEditSamplingData(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSamplingDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateSamplingRecord} variant="contained">Update Sampling Record</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Remark Dialog */}
      <Dialog open={editRemarkDialog} onClose={() => setEditRemarkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Remark</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Port/Harbor</InputLabel>
              <Select
                value={editRemarkData.selected_port}
                onChange={(e) => setEditRemarkData(prev => ({ ...prev, selected_port: e.target.value }))}
                label="Port/Harbor"
              >
                {order?.ships?.flatMap(ship => ship.ship_ports || []).map((shipPort) => (
                  <MenuItem key={shipPort.id} value={shipPort.id.toString()}>
                    {shipPort.port_name}
                  </MenuItem>
                )) || (
                  <MenuItem value={order?.id?.toString() || ''}>
                    {order?.port || 'Current Port'}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={editRemarkData.content}
              onChange={(e) => setEditRemarkData(prev => ({ ...prev, content: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRemarkDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateRemark} variant="contained">Update Remark</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail;
