import React, { useEffect, useRef, useState } from 'react';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import API from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { load } from '@cashfreepayments/cashfree-js';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const authToken = getAuthToken();
  const userData = decodeToken(authToken);
  const userId = userData?.id;
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const cashfreeRef = useRef(null);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await API.get(`/books/cart/${userId}`);
        const items = response.data.items || [];
        setCartItems(items);
        calculateSubtotal(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
        setSubtotal(0);
      }
    };
    if (userId) fetchCartItems();
  }, [userId]);

  // Calculate subtotal
  const calculateSubtotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
    setSubtotal(total);
  };

  // Remove item from cart
  const handleRemove = async (bookId) => {
    try {
      await API.delete('/books/cart/delete', { data: { userId, bookId } });
      const updatedItems = cartItems.filter(item => item.bookId !== bookId);
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
      setDiscount(0); // Reset discount if cart changes
      setCouponMessage('');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponMessage('Please enter a coupon code.');
      return;
    }

    try {
      const res = await API.post('/coupon/validate', {
        code: couponCode,
        totalAmount: subtotal
      });

      if (res.data.discount >= 0) {
        setDiscount(res.data.discount);
        setCouponMessage(`Coupon applied! You saved ₹${res.data.discount}`);
      } else {
        setDiscount(0);
        setCouponMessage(res.data.message || 'Invalid or expired coupon.');
      }
    } catch (err) {
      console.error(err);
      setDiscount(0);
      setCouponMessage(err.response?.data?.message || 'Error applying coupon.');
    }
  };

  // handle place order
  const handleCheckout = async () => {
  setErrorMessage('');
  if (cartItems.some(item => item.format === "hardcopy")) {
    if (!address.trim()) { setErrorMessage('Shipping address is required'); return; }
    if (!/^\d{10}$/.test(phone)) { setErrorMessage('Phone number must be 10 digits'); return; }
  }

  let generatedOrderId;  // <- define outside
  try {
    // const res = await API.post('/cart/checkout', { userId, shippingAddress: address, PhoneNumber: phone, couponCode });
    // if (!res.data.status) return;

    const userName = `${userData.firstName || ""} ${userData.middleName || ""} ${userData.lastName || ""}`.trim();
    const finalPrice = subtotal - discount;

    const cf = await load({ mode: 'production' });
    cashfreeRef.current = cf;

    const getSessionId = async () => {
      generatedOrderId = 'ORD' + Date.now();
      const { data } = await API.post('/payment/create-order', {
        order_id: generatedOrderId,
        order_amount: finalPrice,
        customer_details: { customer_id: userData.id, 
          customer_email: 
          userData.email, 
          customer_phone: userData.phone, 
          customer_name: userName },
        order_note: "Book Order"
      });
      if (!data.payment_session_id) throw new Error('Failed to generate session');
      setOrderId(generatedOrderId);
      setPaymentStatus(data.order_status);
      // localStorage.setItem('orderId', generatedOrderId);
      return data.payment_session_id;
    };

    const sessionId = await getSessionId();
    await cashfreeRef.current.checkout({ paymentSessionId: sessionId, redirectTarget: "_modal" });

    navigate('/bookOrder-Status', { state: { paymentStatus: "success", orderId: generatedOrderId, userId, address, phone, couponCode, amount: finalPrice } });
  } catch (err) {
    console.error(err);
    navigate('/bookOrder-Status', { state: { paymentStatus: "success", orderId: generatedOrderId,userId, address, phone, couponCode, amount: finalPrice } });
  } finally {
    setLoading(false);
  }
};

  const handleRedirectBookList = () => {
    navigate('/books')
  }
  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container mb-2">
          <div className="cart-page">
            <h2 className="fw-bold text-lg mb-1 p-0 color-one">Shopping Cart</h2>
            <p className="pb-3">
              <strong>Great choice!</strong> You’re just a step away from completing your purchase. Secure your payment now and enjoy fast delivery and a smooth checkout experience.
            </p>

            <div className='text-end'>
              <span className='btn-one bg-two color-white cursor-pointer' onClick={handleRedirectBookList}>Add More</span>
            </div>
            <hr />
            <div className="row g-1">
              {/* Left Side: Cart Items */}
              <div className="col-md-7">
                {cartItems.length === 0 ? (
                  <p className="text-center text-danger">
                    Your cart is empty. <Link to={'/books'}>Search Book</Link>
                  </p>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={item.bookId || index} className="d-flex justify-content-between align-items-center bg-white shadow-sm p-1 mb-1 rounded">
                      <div className="d-flex">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="rounded-0 me-3"
                          style={{ width: '60px', height: '80px', objectFit: 'cover' }}
                        />
                        <div className="pt-1">
                          <h5 className="mb-0 text-sm fw-semibold">{item.title}</h5>
                          <p className="text-muted small">Qty: {item.quantity}, {item.format}</p>
                          <p className="fw-bold text-danger">
                            ₹{item.salePrice * item.quantity} <del className="mx-1 text-muted fw-normal">₹{item.price * item.quantity}</del>
                          </p>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemove(item.bookId)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Right Side: Cart Summary */}
              {cartItems.length > 0 && (
                <div className="col-md-5">
                  <div className="bg-white shadow-sm p-2 rounded">
                    <h5 className="fw-semibold text-sm mb-2">Order Summary</h5>

                    <div className="d-flex text-sm justify-content-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="d-flex text-sm justify-content-between">
                      <span>Discount</span>
                      <span>-₹0</span>
                    </div>
                    <div className="d-flex text-sm justify-content-between">
                      <span>Coupon</span>
                      <span>-₹{discount}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
                      <span>Total</span>
                      <span>₹{subtotal - discount}</span>
                    </div>

                    <div className="input-group mt-3">
                      <input
                        type="text"
                        className="form-control py-1"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button className="btn btn-primary py-1" onClick={handleApplyCoupon}>Apply</button>

                    </div>

                    {/* Coupon message */}
                    {couponMessage && (
                      <p className="text-xsm mt-0" style={{ color: discount > 0 ? 'green' : 'red' }}>
                        {couponMessage}
                      </p>
                    )}

                    {/* Shipping Details only if cart has hardcopy */}
                    {cartItems.some(item => item.format === "hardcopy") && (
                      <>
                        <div className="mt-2">
                          <label className="form-label text-sm mb-1">Shipping Address</label>
                          <textarea
                            className="form-control text-sm checkout"
                            rows="2"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='49/7, Bhaghirath Palace, Chandni Chowk, Delhi, 110006'
                          />
                        </div>

                        <div>
                          <label className="form-label text-sm mb-1">Phone No.</label>
                          <input
                            type="text"
                            className="form-control checkout"
                            minLength={10}
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,10}$/.test(value)) {
                                setPhone(value);
                              }
                            }}
                            placeholder='Ex. 7922145440'
                          />
                        </div>
                      </>
                    )}

                    <button className="border-0 py-1 w-100 mt-3 bg-one color-white btn-one cursor-pointer" onClick={handleCheckout}>
                      Proceed to Checkout
                    </button>
                    {errorMessage && (
                      <div className="text-danger text-sm mb-2">
                        {errorMessage}
                      </div>
                    )}
                    {message && (
                      <div className="text-success text-sm mb-2">
                        {message}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CartPage;
