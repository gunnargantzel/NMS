import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { mockApi, SurveyType } from '../services/mockApi';

// Interface is now imported from mockApi

const SurveyTypes: React.FC = () => {
  const [surveyTypes, setSurveyTypes] = useState<SurveyType[]>([]);
  const [, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingType, setEditingType] = useState<SurveyType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchSurveyTypes();
  }, []);

  const fetchSurveyTypes = async () => {
    try {
      const response = await mockApi.getSurveyTypes();
      setSurveyTypes(response);
    } catch (error) {
      console.error('Error fetching survey types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type?: SurveyType) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        description: type.description || '',
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingType(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingType) {
        // For demo purposes, we'll just create a new one since we don't have update in mock API
        await mockApi.createSurveyType(formData);
      } else {
        await mockApi.createSurveyType(formData);
      }
      handleCloseDialog();
      fetchSurveyTypes();
    } catch (error: any) {
      console.error('Error saving survey type:', error);
      alert(error.response?.data?.message || 'Error saving survey type');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this survey type?')) {
      try {
        // For demo purposes, we'll just show a message since we don't have delete in mock API
        alert('Delete functionality not implemented in demo mode');
        fetchSurveyTypes();
      } catch (error: any) {
        console.error('Error deleting survey type:', error);
        alert(error.response?.data?.message || 'Error deleting survey type');
      }
    }
  };

  // formatDate function removed as it's not used

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Survey Types
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Survey Type
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveyTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {type.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {type.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>{new Date().toLocaleDateString('nb-NO')}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(type)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(type.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingType ? 'Edit Survey Type' : 'Add Survey Type'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingType ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SurveyTypes;
