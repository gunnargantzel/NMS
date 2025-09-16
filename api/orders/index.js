const { app } = require('@azure/functions');

// Simple in-memory data for demo
let orders = [
  {
    id: 1,
    order_number: 'ORD-20241201-001',
    client_name: 'Statoil ASA',
    client_email: 'cargo@statoil.com',
    vessel_name: 'M/T Nordic Star',
    port: 'Stavanger',
    survey_type: 'Cargo damage survey',
    status: 'in_progress',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    order_number: 'ORD-20241201-002',
    client_name: 'Equinor',
    client_email: 'shipping@equinor.com',
    vessel_name: 'M/T North Sea',
    port: 'Bergen',
    survey_type: 'Loading and lashing survey',
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

app.http('orders', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('HTTP trigger function processed a request.');

    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return {
        status: 200,
        headers,
        body: ''
      };
    }

    try {
      if (request.method === 'GET') {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status');
        const survey_type = searchParams.get('survey_type');
        const search = searchParams.get('search');

        let filteredOrders = orders;

        if (status) {
          filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        if (survey_type) {
          filteredOrders = filteredOrders.filter(order => order.survey_type === survey_type);
        }

        if (search) {
          filteredOrders = filteredOrders.filter(order => 
            order.client_name.toLowerCase().includes(search.toLowerCase()) ||
            order.order_number.toLowerCase().includes(search.toLowerCase())
          );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

        return {
          status: 200,
          headers,
          body: JSON.stringify({
            orders: paginatedOrders,
            pagination: {
              page,
              limit,
              total: filteredOrders.length,
              pages: Math.ceil(filteredOrders.length / limit)
            }
          })
        };
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const newOrder = {
          id: orders.length + 1,
          order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          ...body,
          created_at: new Date().toISOString()
        };
        orders.push(newOrder);

        return {
          status: 201,
          headers,
          body: JSON.stringify({
            message: 'Order created successfully',
            orderId: newOrder.id,
            orderNumber: newOrder.order_number
          })
        };
      }

      return {
        status: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };

    } catch (error) {
      context.log.error('Error:', error);
      return {
        status: 500,
        headers,
        body: JSON.stringify({ message: 'Internal server error' })
      };
    }
  }
});
