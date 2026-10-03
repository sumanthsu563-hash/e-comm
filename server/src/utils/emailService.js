import nodemailer from 'nodemailer';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const sendOrderConfirmationEmail = async ({ order, user }) => {
  try {
    const isMock =
      !process.env.SMTP_HOST ||
      process.env.SMTP_USER === 'mock_user' ||
      process.env.NODE_ENV === 'development';

    if (isMock) {
      console.log('----------------------------------------------------');
      console.log(
        `📧 [MOCK EMAIL DISPATCH] Order Confirmation to: ${user.email}`
      );
      console.log(`Order ID: ${order._id}`);
      console.log(`Total Amount: $${order.totalAmount}`);
      console.log(`Items count: ${order.items?.length}`);
      console.log('----------------------------------------------------');
      return { success: true, mode: 'mock_logged' };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      requireTLS: true,
    });

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.title)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
          </tr>`
      )
      .join('');

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'NexStore Marketplace'}" <${process.env.FROM_EMAIL || 'orders@nexstore.com'}>`,
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
          <h2 style="color: #2563eb;">Thank you for your purchase!</h2>
          <p>Hi ${escapeHtml(user.name)},</p>
          <p>Your order <strong>#${order._id}</strong> has been confirmed and is now being processed by our merchants.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f8fafc; text-align: left;">
                <th style="padding: 8px;">Item</th>
                <th style="padding: 8px;">Qty</th>
                <th style="padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
          <p><strong>Shipping to:</strong> ${escapeHtml(order.shippingAddress.street)}, ${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.postalCode)}</p>

          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            NexStore Multi-Vendor Marketplace • Real-Time Order Management
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ Email dispatch error: ${error.message}`);
    // Non-blocking error so order process does not crash
    return { success: false, error: error.message };
  }
};
