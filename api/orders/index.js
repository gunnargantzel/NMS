module.exports = async function (context, req) {
    context.log('Orders function processed a request.');

    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers,
            body: ''
        };
        return;
    }

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

    try {
        if (req.method === 'GET') {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const survey_type = req.query.survey_type;
            const search = req.query.search;

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

            context.res = {
                status: 200,
                headers,
                body: {
                    orders: paginatedOrders,
                    pagination: {
                        page,
                        limit,
                        total: filteredOrders.length,
                        pages: Math.ceil(filteredOrders.length / limit)
                    }
                }
            };
            return;
        }

        if (req.method === 'POST') {
            const newOrder = {
                id: orders.length + 1,
                order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                ...req.body,
                created_at: new Date().toISOString()
            };
            orders.push(newOrder);

            context.res = {
                status: 201,
                headers,
                body: {
                    message: 'Order created successfully',
                    orderId: newOrder.id,
                    orderNumber: newOrder.order_number
                }
            };
            return;
        }

        context.res = {
            status: 405,
            headers,
            body: { message: 'Method not allowed' }
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers,
            body: { message: 'Internal server error' }
        };
    }
};