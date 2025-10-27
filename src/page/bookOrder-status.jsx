import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAuthToken } from '../utils/getAuthToken';
import API from '../utils/axios';

const BookOrderStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);
    const [userId, setUserId] = useState('');
 const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
   const [couponCode, setCouponCode] = useState('');
  // Get status info passed from payment page
  useEffect(() => {
    if (location.state) {
      const { paymentStatus, orderId, userId, address, phone, couponCode, amount } = location.state;
      setStatus(paymentStatus);
      setOrderId(orderId);
      setAmount(amount);
      setAddress(address);
      setPhone(phone);
      setCouponCode(couponCode);
      setUserId(userId);

    }
  }, [location.state]);

  useEffect(() => {
    if (!orderId) return;

    const verifyPayment = async () => {
      const token = getAuthToken();
      if (!token) {
        setStatus('failed');
        return;
      }

      try {
        const res = await API.post("/payment/verify", { orderId });
        const payment = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!payment || !payment.payment_status) throw new Error('Invalid payment response');
        console.log(payment.payment);
        

        const response = await API.post('/books/order/checkout', { userId, shippingAddress: address, PhoneNumber: phone,status:payment.payment_status,transactionId:payment.order_id, couponCode });
    // if (!response.data.status) return;



        try {
        const respon=  await API.post('/books/order/payment', {
            transactionId: payment.order_id,
            orderId:orderId,
            userId:userId,
            amount:payment.order_amount,
            method:payment.payment_group,
            status:payment.payment_status,
            gatewayResponse:payment.payment_method,
            
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log('payments ',respon.data);
          
        } catch (err) {
          console.error("payments save failed", err);
        }


        setStatus('success');


      } catch (err) {
        setStatus('failed');
      }
    }

    verifyPayment();
  }, [orderId]);



  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container mb-2">
          <div className="text-center mt-5">
            {status === "success" ? (
              <>
                <h1 className="text-success mb-1 text-xlg"> Payment Successful!</h1>
                <p className="mb-4">Your order has been placed successfully! <br /> A confirmation email has been sent.
                  You can track your order in <Link to={'/my-order'} className="fw-bold">"My Books"</Link> . Order ID: <span className="text-primary">{orderId}</span></p>
                <Link to="/books" className="btn-one bg-one color-white py-1 mt-3 text-sm">
                  Go to My Books
                </Link>
              </>
            ) : status === "failed" ? (
              <>
                <h1 className="text-danger mb-3">❌ Payment Failed</h1>
                <p className="mb-2">Your order could not be processed.</p>
                <p className="mb-4">Please try again or contact support.</p>
                <Link to="/cart" className="btn-one bg-two color-white py-1 mt-3 text-sm">
                  Back to Cart
                </Link>
              </>
            ) : (
              <p className="text-muted">Loading status...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookOrderStatus;
