import React, { useState, useEffect } from 'react';
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
  IconButton,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Science as ScienceIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';

interface Order {
  id: number;
  order_number: string;
  client_name: string;
  client_email: string;
  vessel_name: string;
  port: string;
  survey_type: string;
  status: string;
  created_at: string;
  created_by_name: string;
}

interface TimelogEntry {
  id: number;
  timestamp: string;
  activity: string;
  remarks: string;
  created_by_name: string;
}

interface SamplingRecord {
  id: number;
  sample_type: string;
  quantity: string;
  destination: string;
  seal_number: string;
  remarks: string;
  created_by_name: string;
}

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
  const [activities, setActivities] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openTimelogDialog, setOpenTimelogDialog] = useState(false);
  const [openSamplingDialog, setOpenSamplingDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [newTimelogEntry, setNewTimelogEntry] = useState({
    timestamp: dayjs().format(),
    activity: '',
    remarks: '',
  });
  const [newSamplingRecord, setNewSamplingRecord] = useState({
    sample_type: '',
    quantity: '',
    destination: '',
    seal_number: '',
    remarks: '',
  });
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchActivities();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const [orderResponse, timelogResponse, samplingResponse] = await Promise.all([
        axios.get(`/api/orders/${id}`),
        axios.get(`/api/timelog/order/${id}`),
        axios.get(`/api/sampling/order/${id}`),
      ]);

      setOrder(orderResponse.data);
      setTimelogEntries(timelogResponse.data.entries);
      setSamplingRecords(samplingResponse.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/timelog/activities');
      setActivities(response.data.map((a: any) => a.activity));
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleAddTimelogEntry = async () => {
    try {
      await axios.post('/api/timelog', {
        order_id: id,
        ...newTimelogEntry,
      });
      setOpenTimelogDialog(false);
      setNewTimelogEntry({ timestamp: dayjs().format(), activity: '', remarks: '' });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error adding timelog entry:', error);
    }
  };

  const handleAddSamplingRecord = async () => {
    try {
      await axios.post('/api/sampling', {
        order_id: id,
        ...newSamplingRecord,
      });
      setOpenSamplingDialog(false);
      setNewSamplingRecord({
        sample_type: '',
        quantity: '',
        destination: '',
        seal_number: '',
        remarks: '',
      });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error adding sampling record:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(`/api/email/order-confirmation/${id}`, {
        customMessage: emailMessage,
      });
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
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Number
              </Typography>
              <Typography variant="h6">{order.order_number}</Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Client
              </Typography>
              <Typography variant="body1">{order.client_name}</Typography>
              {order.client_email && (
                <Typography variant="body2" color="text.secondary">
                  {order.client_email}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Vessel
              </Typography>
              <Typography variant="body1">{order.vessel_name || '-'}</Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Port
              </Typography>
              <Typography variant="body1">{order.port || '-'}</Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Survey Type
              </Typography>
              <Typography variant="body1">{order.survey_type}</Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status) as any}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">{formatDate(order.created_at)}</Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Created By
              </Typography>
              <Typography variant="body1">{order.created_by_name}</Typography>
            </Grid>
          </Grid>
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
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timelogEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.timestamp)}</TableCell>
                    <TableCell>{entry.activity}</TableCell>
                    <TableCell>{entry.remarks || '-'}</TableCell>
                    <TableCell>{entry.created_by_name}</TableCell>
                  </TableRow>
                ))}
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
                  <TableCell>Sample Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Seal Number</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samplingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.sample_type}</TableCell>
                    <TableCell>{record.quantity || '-'}</TableCell>
                    <TableCell>{record.destination || '-'}</TableCell>
                    <TableCell>{record.seal_number || '-'}</TableCell>
                    <TableCell>{record.remarks || '-'}</TableCell>
                    <TableCell>{record.created_by_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" mb={2}>Remarks</Typography>
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
            <DateTimePicker
              label="Timestamp"
              value={dayjs(newTimelogEntry.timestamp)}
              onChange={(newValue) => setNewTimelogEntry(prev => ({
                ...prev,
                timestamp: newValue?.format() || dayjs().format()
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
