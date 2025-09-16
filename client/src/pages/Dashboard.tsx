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
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Assignment as OrdersIcon,
  Category as SurveyTypesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';

// Interface is now imported from mockApi

const Dashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse, statsResponse] = await Promise.all([
        mockApi.getOrders({ limit: '5' }),
        mockApi.getOrders({ limit: '1000' }), // Get all for stats
      ]);

      setRecentOrders(ordersResponse.orders);
      
      const allOrders = statsResponse.orders;
      setStats({
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((o: any) => o.status === 'pending').length,
        completedOrders: allOrders.filter((o: any) => o.status === 'completed').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString('nb-NO');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/orders')}
        >
          New Order
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Stats Cards */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <OrdersIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalOrders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SurveyTypesIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Orders
                  </Typography>
                  <Typography variant="h4">
                    {stats.pendingOrders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SurveyTypesIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Orders
                  </Typography>
                  <Typography variant="h4">
                    {stats.completedOrders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Recent Orders */}
      <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order Number</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Vessel</TableCell>
                      <TableCell>Survey Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {order.order_number}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.client_name}</TableCell>
                        <TableCell>{order.vessel_name || '-'}</TableCell>
                        <TableCell>{order.survey_type}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(order.created_at)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
        </CardContent>
      </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
