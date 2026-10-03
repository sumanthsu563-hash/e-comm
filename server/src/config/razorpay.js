import Razorpay from 'razorpay';
import crypto from 'crypto';

export const isRazorpayConfigured = () => {
  return (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_mock_id' &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_SECRET !== 'mock_razorpay_secret'
  );
};

export const isMockPaymentAllowed = () => process.env.NODE_ENV === 'test';

let razorpayInstance = null;

if (isRazorpayConfigured()) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const getRazorpayInstance = () => razorpayInstance;

export const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  // Mock payment support is restricted to the automated test environment.
  if (!isRazorpayConfigured()) {
    return isMockPaymentAllowed() && razorpaySignature === 'mock_sig_valid';
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (razorpaySignature.length !== generatedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(razorpaySignature)
  );
};
