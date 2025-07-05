// src/pages/Payment.tsx
import React, { useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface LocationState {
  cartItems?: CartItem[];
   paymentMethod: string;
  paymentInfo: string;
  salesId?: string; // 🆗 Optional
}





const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };
  const cartItems: CartItem[] = state?.cartItems || [];

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [upiId, setUpiId] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const validatePaymentInputs = (): boolean => {
    if (!paymentMethod) return false;

    if (paymentMethod === 'upi' && !upiId.trim()) {
      alert('Please enter your UPI ID');
      return false;
    }
    if (paymentMethod === 'credit' && !cardNumber.trim()) {
      alert('Please enter your Card Number');
      return false;
    }
    if (paymentMethod === 'cash' && (!name.trim() || !address.trim())) {
      alert('Please enter both your name and address');
      return false;
    }
    return true;
  };



  const handlePayment = async () => {
  if (!validatePaymentInputs()) return;
  setIsProcessing(true);

  const userId = localStorage.getItem('userId');
  console.log("User ID in Payment Page:", userId);

  if (!userId) {
    alert('User ID not found. Please log in again.');
    setIsProcessing(false);
    return;
  }

  const paymentInfo =
    paymentMethod === 'upi'
      ? upiId
      : paymentMethod === 'credit'
      ? cardNumber
      : `${name}, ${address}`;

  try {
    // 🟡 Step 1: Send sale data to backend and get response
    const response = await axios.post('http://localhost:8080/api/Sales', {
      userId,
      items: cartItems,
      paymentMethod,
      paymentInfo,
      salesId: state.salesId,
    });

    const savedSale = response.data;
    console.log("✅ Saved sale:", savedSale); // 🧠 Inspect salesId here

    // 🟢 Step 2: Navigate to invoice page with salesId
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);

      navigate('/bill', {
        state: {
          cartItems,
          paymentMethod,
          paymentInfo,
          salesId: savedSale.salesId,     // ✅ REQUIRED!
          SoledAt: savedSale.SoledAt,     // ✅ optional
        },
      });
    }, 1000);
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Try again.');
    setIsProcessing(false);
  }
};


  return (
    <div className="payment-page">
      <h2>Payment Options</h2>
      <div className="payment-options">
        <label>
          <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={(e) => setPaymentMethod(e.target.value)} />
          Credit / Debit Card
        </label>
        <label>
          <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
          UPI
        </label>
        <label>
          <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
          Cash
        </label>
      </div>

      {paymentMethod === 'upi' && (
        <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="input-field" />
      )}
      {paymentMethod === 'credit' && (
        <input type="text" placeholder="Enter Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="input-field" />
      )}
      {paymentMethod === 'cash' && (
        <>
          <input type="text" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          <textarea placeholder="Enter Address" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field"></textarea>
        </>
      )}

      <div className="cart-summary">
        <h3>Selected Items</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="summary-item">
            <p>{item.name} - ₹{item.price} × {item.quantity}</p>
            <p>Total: ₹{Number(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <hr />
        <p><strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong></p>
      </div>

      <button className="pay-button" onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Make Payment'}
      </button>

      {success && <p className="success-msg">✅ Payment successful!</p>}
    </div>
  );
};

export default Payment;
