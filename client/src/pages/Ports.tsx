import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { mockApi } from '../services/mockApi';

interface Port {
  id: number;
  name: string;
  country: string;
  region: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

const Ports: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    is_active: true
  });

  // Available countries for filter
  const countries = Array.from(new Set(ports.map(port => port.country))).sort();

  useEffect(() => {
    loadPorts();
  }, []);

  const loadPorts = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getPorts();
      setPorts(data);
    } catch (err) {
      setError('Failed to load ports');
      console.error('Error loading ports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (port?: Port) => {
    if (port) {
      setEditingPort(port);
      setFormData({
        name: port.name,
        country: port.country,
        region: port.region,
        is_active: port.is_active
      });
    } else {
      setEditingPort(null);
      setFormData({
        name: '',
        country: '',
        region: '',
        is_active: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPort(null);
    setFormData({
      name: '',
      country: '',
      region: '',
      is_active: true
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingPort) {
        await mockApi.updatePort(editingPort.id, formData);
        setSnackbar({ open: true, message: 'Port updated successfully', severity: 'success' });
      } else {
        await mockApi.createPort(formData);
        setSnackbar({ open: true, message: 'Port created successfully', severity: 'success' });
      }
      handleCloseDialog();
      loadPorts();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save port', severity: 'error' });
      console.error('Error saving port:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this port?')) {
      try {
        await mockApi.deletePort(id);
        setSnackbar({ open: true, message: 'Port deleted successfully', severity: 'success' });
        loadPorts();
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to delete port', severity: 'error' });
        console.error('Error deleting port:', err);
      }
    }
  };

  const filteredPorts = ports.filter(port => {
    const matchesSearch = port.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         port.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !countryFilter || port.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const getCountryColor = (country: string) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    const index = country.length % colors.length;
    return colors[index] as any;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading ports...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Port Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            backgroundColor: 'var(--primary-color)',
            '&:hover': { backgroundColor: 'var(--primary-hover-color)' }
          }}
        >
          Add Port
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
        <TextField
          placeholder="Search ports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={countryFilter}
            label="Country"
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <MenuItem value="">All Countries</MenuItem>
            {countries.map(country => (
              <MenuItem key={country} value={country}>{country}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Refresh">
          <IconButton onClick={loadPorts}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Ports Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'var(--shadow-light)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--background-light)' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Port Name</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Region</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPorts.map((port) => (
              <TableRow key={port.id} hover>
                <TableCell>{port.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationIcon color="primary" fontSize="small" />
                    <Typography variant="body2" fontWeight="medium">
                      {port.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={port.country}
                    size="small"
                    color={getCountryColor(port.country)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {port.region}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={port.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    color={port.is_active ? 'success' : 'default'}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(port.created_at).toLocaleDateString('no-NO')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(port)}
                        sx={{ color: 'var(--primary-color)' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(port.id)}
                        sx={{ color: 'var(--error-color)' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredPorts.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || countryFilter ? 'No ports found matching your criteria' : 'No ports available'}
          </Typography>
          {!searchTerm && !countryFilter && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                backgroundColor: 'var(--primary-color)',
                '&:hover': { backgroundColor: 'var(--primary-hover-color)' }
              }}
            >
              Add First Port
            </Button>
          )}
        </Box>
      )}

      {/* Port Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPort ? 'Edit Port' : 'Add New Port'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Port Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              placeholder="Enter port name"
            />
            <TextField
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              fullWidth
              required
              placeholder="Enter country"
            />
            <TextField
              label="Region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              fullWidth
              placeholder="Enter region/state/province"
            />
            <Box display="flex" alignItems="center" gap={1}>
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label htmlFor="is_active">Active</label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name.trim() || !formData.country.trim()}
            sx={{ 
              backgroundColor: 'var(--primary-color)',
              '&:hover': { backgroundColor: 'var(--primary-hover-color)' }
            }}
          >
            {editingPort ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Ports;
