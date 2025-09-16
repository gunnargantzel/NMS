const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate order confirmation email HTML
const generateOrderConfirmationHTML = (order) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Order Confirmation</title>
        <style type="text/css">
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 200px;
            height: auto;
          }
          .order-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .order-details h3 {
            margin-top: 0;
            color: #007bff;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: bold;
            color: #555;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Norwegian Marine & Cargo Survey</h1>
          <p>Order Confirmation</p>
        </div>

        <p>Dear ${order.client_name},</p>

        <p>Thank you for your order. We have received and registered your survey request with the following details:</p>

        <div class="order-details">
          <h3>Order Details</h3>
          <div class="detail-row">
            <span class="detail-label">Order Number:</span>
            <span>${order.order_number}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Survey Type:</span>
            <span>${order.survey_type}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Vessel Name:</span>
            <span>${order.vessel_name || 'Not specified'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Port:</span>
            <span>${order.port || 'Not specified'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span>${order.status}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span>${new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <p>We will contact you shortly to arrange the survey details and schedule.</p>

        <p>If you have any questions or need to make changes to this order, please contact us at <a href="mailto:post@cargosurvey.com">post@cargosurvey.com</a>.</p>

        <div class="footer">
          <p><strong>Kind regards,</strong><br>
          Norwegian Marine & Cargo Survey</p>
          
          <p><strong>Contact Information:</strong><br>
          Email: <a href="mailto:post@cargosurvey.com">post@cargosurvey.com</a><br>
          Website: <a href="http://cargosurvey.no">www.cargosurvey.no</a></p>

          <p><em>Norwegian Marine & Cargo Survey AS, P.O. Box 67, Sentrum, 0101 Oslo, Norway</em></p>
          
          <p><em>All our activities are carried out in accordance with our General Conditions accessible at <a href="http://cargosurvey.no/useful-links/general-conditions">www.cargosurvey.no</a>. Attention is drawn to the limitation of liability, indemnification and jurisdiction issues defined therein.</em></p>
        </div>
      </body>
    </html>
  `;
};

// Send order confirmation email
router.post('/order-confirmation/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customMessage } = req.body;

    // Get order details
    db.get(`
      SELECT o.*, u.username as created_by_name 
      FROM orders o 
      LEFT JOIN users u ON o.created_by = u.id 
      WHERE o.id = ?
    `, [orderId], async (err, order) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (!order.client_email) {
        return res.status(400).json({ message: 'No email address found for this order' });
      }

      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'post@cargosurvey.com',
        to: order.client_email,
        subject: `Order Confirmation - ${order.order_number}`,
        html: generateOrderConfirmationHTML(order)
      };

      // Add custom message if provided
      if (customMessage) {
        mailOptions.html = mailOptions.html.replace(
          '<p>We will contact you shortly to arrange the survey details and schedule.</p>',
          `<p>${customMessage}</p><p>We will contact you shortly to arrange the survey details and schedule.</p>`
        );
      }

      await transporter.sendMail(mailOptions);

      res.json({ message: 'Order confirmation email sent successfully' });
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

// Send custom email
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { to, subject, message, orderId } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ message: 'To, subject, and message are required' });
    }

    const transporter = createTransporter();

    let htmlMessage = message.replace(/\n/g, '<br>');

    // If orderId is provided, add order details
    if (orderId) {
      db.get('SELECT * FROM orders WHERE id = ?', [orderId], async (err, order) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        if (order) {
          htmlMessage = `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h4>Order Reference: ${order.order_number}</h4>
              <p><strong>Survey Type:</strong> ${order.survey_type}</p>
              <p><strong>Vessel:</strong> ${order.vessel_name || 'Not specified'}</p>
              <p><strong>Port:</strong> ${order.port || 'Not specified'}</p>
            </div>
            ${htmlMessage}
          `;
        }

        const mailOptions = {
          from: process.env.EMAIL_FROM || 'post@cargosurvey.com',
          to,
          subject,
          html: htmlMessage
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
      });
    } else {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'post@cargosurvey.com',
        to,
        subject,
        html: htmlMessage
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent successfully' });
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

module.exports = router;
